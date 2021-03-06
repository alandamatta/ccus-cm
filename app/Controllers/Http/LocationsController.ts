import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Location from 'App/Models/Location'
import LocationsService from 'App/Services/LocationsService'
import Logger from '@ioc:Adonis/Core/Logger'
import LocationValidator from 'App/Validators/LocationValidator'
import DaysOfTheWeek from 'App/Constants/DaysOfTheWeek'
import UnitedStatesStates from 'App/Constants/UnitedStatesStates'
import CoursesService from 'App/Services/CoursesService'

const coursesService = new CoursesService()
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
    const daysOfTheWeek = DaysOfTheWeek
    const states = UnitedStatesStates
    return await ctx.view.render('location', { showModal: 'is-active', daysOfTheWeek, states })
  }
  public async search(ctx: HttpContextContract) {
    Logger.info(JSON.stringify(ctx.request.qs()))
    const locationList = await locationService.search(ctx.request.qs().search)
    return await ctx.view.render('location', { ...ctx.request.qs(), locationList })
  }
  public async create(ctx: HttpContextContract) {
    this.tempCoursesControl(ctx)
    const auth = ctx.auth
    await auth.use('web').authenticate()
    const body = ctx.request.body()
    const closeModal = body.closeModal
    await ctx.request.validate(LocationValidator)
    if (body?.id > 0) {
      const location = await Location.findOrFail(body.id)
      const updated = await location.merge(body, true).save()
      await coursesService.updateMany(body.course, updated)
      const coursesIds = await body.course.map((element) => element.id)
      await coursesService.deleteManyByIdAndLocationId(coursesIds, location.id)
    } else {
      await locationService.create(body)
    }
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
    await ctx.request.validate(LocationValidator)
    return await ctx.response.redirect().toRoute('location.modal.render')
  }
  public async removeTempCourse(ctx: HttpContextContract) {
    const updatedCourses = ctx.request
      .body()
      .course.filter((element) => element.index != ctx.params.index)
    ctx.session.flash('tempCourses', updatedCourses)
    ctx.session.flash({ ...ctx.request.body() })
    await ctx.request.validate(LocationValidator)
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
  public async find(ctx: HttpContextContract) {
    await ctx.auth.use('web').authenticate()
    const params = ctx.request.params()
    const locationId = params.id
    const location = await Location.findBy('id', locationId)
    const locationList = await locationService.search(EMPTY)
    const daysOfTheWeek = DaysOfTheWeek
    const states = UnitedStatesStates
    const tempCourses = await coursesService.findByLocationId(locationId)
    let index = 0
    tempCourses.map((element) => {
      element.index = index
      index++
    })
    return await ctx.view.render('location', {
      showModal: 'is-active',
      ...ctx.request.qs(),
      locationList,
      location,
      daysOfTheWeek,
      states,
      tempCourses,
    })
  }
  public async delete(ctx: HttpContextContract) {
    const user = await ctx.auth.use('web').authenticate()
    const params = ctx.request.params()
    const locationId = params.id
    const dependents = await locationService.checkForLocationDependents(locationId)
    if (dependents && dependents.length > 0) {
      return await ctx.view.render('location', { dependents })
    }
    await locationService.deleteById(locationId, user)
    return await ctx.response.redirect().toRoute('/location')
  }
}
