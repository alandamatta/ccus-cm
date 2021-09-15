import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Location from 'App/Models/Location'
import LocationsService from 'App/Services/LocationsService'
import Logger from '@ioc:Adonis/Core/Logger'

const locationService = new LocationsService()
const EMPTY: string = ''

export default class LocationsController {
  public async index(ctx: HttpContextContract) {
    const auth = ctx.auth
    await auth.use('web').authenticate()
    const locationList = await locationService.search(EMPTY)
    return await ctx.view.render('location', { locationList })
  }
  public async indexCreate(ctx: HttpContextContract) {
    const auth = ctx.auth
    await auth.use('web').authenticate()
    return await ctx.view.render('location', { showModal: 'is-active' })
  }
  public async search(ctx: HttpContextContract) {
    Logger.info(JSON.stringify(ctx.request.qs()))
    const locationList = await locationService.search(ctx.request.qs().search)
    return await ctx.view.render('location', { ...ctx.request.qs(), locationList })
  }
  public async create(ctx: HttpContextContract) {
    //modal
    const locationService = new LocationsService()
    this.tempCoursesControl(ctx)
    const auth = ctx.auth
    await auth.use('web').authenticate()
    const body = ctx.request.body()
    const closeModal = body.closeModal
    const location = new Location()
    location.fill(body, true)
    await ctx.request.validate({ schema: this.schema() })
    await locationService.create(body)
    if (closeModal === 'true') {
      ctx.session.flash('infoIndex', 'Data saved successfully!')
      return await ctx.response.redirect().toRoute('location.index')
    }
    ctx.session.flash('infoModal', 'Data saved successfully!')
    return await ctx.response.redirect().toRoute('location.modal.render')
  }
  public async addTempCourse(ctx: HttpContextContract) {
    const body = ctx.request.body()
    const session = ctx.session
    let course: any = {}
    course.index = 0
    let tempCourses: any[] = [course]
    if (body.course && body.course.length > 0) {
      course.index = body.course.length
      tempCourses = [...body.course, course]
    }
    session.flash('tempCourses', tempCourses)
    session.flash({ ...body })
    await ctx.request.validate({ schema: this.schema() })
    return await ctx.response.redirect().toRoute('location.modal.render')
  }
  public async removeTempCourse(ctx: HttpContextContract) {
    const updatedCourses = ctx.request
      .body()
      .course.filter((element) => element.index != ctx.params.index)
    ctx.session.flash('tempCourses', updatedCourses)
    ctx.session.flash({ ...ctx.request.body() })
    await ctx.request.validate({ schema: this.schema() })
    return await ctx.response.redirect().toRoute('location.modal.render')
  }
  private tempCoursesControl({ request, session }: HttpContextContract) {
    let course: any = {}
    course.index = 0
    let tempCourses: any[] = []
    const body = request.body()
    if (body.course && body.course.length > 0) {
      tempCourses = [...body.course]
    }
    session.flash('tempCourses', tempCourses)
  }
  private schema() {
    return schema.create({
      name: schema.string({}, [rules.maxLength(60)]),
      city: schema.string({}, [rules.maxLength(60)]),
      state: schema.string({}, [rules.maxLength(2)]),
      zip: schema.string({ trim: true }),
      course: schema.array.optional().members(
        schema.object().members({
          name: schema.string({ trim: true }, [rules.maxLength(60)]),
        })
      ),
    })
  }
}
