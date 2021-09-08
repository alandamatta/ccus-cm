import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Location from 'App/Models/Location'
import Logger from '@ioc:Adonis/Core/Logger'

export default class LocationsController {
  public async index(ctx: HttpContextContract) {
    const auth = ctx.auth
    await auth.use('web').authenticate()
    return await ctx.view.render('location')
  }
  public async indexCreate(ctx: HttpContextContract) {
    const auth = ctx.auth
    await auth.use('web').authenticate()
    return await ctx.view.render('location', { showModal: 'is-active' })
  }
  public async create(ctx: HttpContextContract) {
    //modal
    this.tempCoursesControl(ctx)
    const auth = ctx.auth
    await auth.use('web').authenticate()
    const body = ctx.request.body()
    const closeModal = body.closeModal
    const location = new Location()
    location.fill(body, true)
    Logger.info(JSON.stringify(body))
    await ctx.request.validate({ schema: this.schema() })
    if (closeModal === 'true') {
      ctx.session.flash('infoIndex', 'Data saved successfully!')
      return await ctx.response.redirect().toRoute('location.index')
    }
    ctx.session.flash('infoModal', 'Data saved successfully!')
    return await ctx.response.redirect().toRoute('location.modal.render')
  }
  public async addTempCourse(ctx: HttpContextContract) {
    Logger.info('addTempCourse route')
    const body = ctx.request.body()
    const session = ctx.session
    let course: any = {}
    course.index = 0
    let tempCourses: any[] = [course]
    if (body.course && body.course.length > 0) {
      course.index = body.course.length
      tempCourses = [...body.course, course]
    }
    Logger.info(JSON.stringify(course))
    Logger.info(JSON.stringify(tempCourses))
    session.flash('tempCourses', tempCourses)
    session.flash({ ...body })
    await ctx.request.validate({ schema: this.schema() })
    return await ctx.response.redirect().toRoute('location.modal.render')
  }
  public async removeTempCourse(ctx: HttpContextContract) {
    Logger.info('removeTempCourse route. Params=' + JSON.stringify(ctx.params))
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
      course: schema.array().members(
        schema.object().members({
          name: schema.string({}, [rules.maxLength(60)]),
        })
      ),
    })
  }
}
