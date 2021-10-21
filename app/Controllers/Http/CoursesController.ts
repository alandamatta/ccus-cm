import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CoursesService from 'App/Services/CoursesService'
import Course from 'App/Models/Course'

const coursesService = new CoursesService()

export default class CoursesController {
  public async index(ctx: HttpContextContract) {
    const auth = ctx.auth
    const user = await auth.use('web').authenticate()
    const qs = ctx.request.qs()
    const defaultProps = await coursesService.defaultProps(user, qs)
    return await ctx.view.render('course', { ...defaultProps })
  }
  public async create(ctx: HttpContextContract) {
    await ctx.auth.use('web').authenticate()
    await coursesService.create(ctx)
    return await ctx.response.redirect().toRoute('course.index')
  }
  public async indexCreate(ctx: HttpContextContract) {
    const auth = ctx.auth
    const user = await auth.use('web').authenticate()
    const qs = ctx.request.qs()
    const defaultProps = await coursesService.defaultProps(user, qs)
    return await ctx.view.render('course', { showModal: 'is-active', ...defaultProps })
  }
  public async search(ctx: HttpContextContract) {
    const auth = ctx.auth
    const user = await auth.use('web').authenticate()
    const { search } = ctx.request.qs()
    const courses = await coursesService.search(search, user.locationId)
    return await ctx.view.render('course', { search, courses })
  }
  public async find(ctx: HttpContextContract) {
    const user = await ctx.auth.use('web').authenticate()
    const qs = ctx.request.params()
    const course = await Course.findBy('id', qs.id)
    const courseJson = course?.toJSON()
    const defaultProps = await coursesService.defaultProps(user, qs)
    return await ctx.view.render('course', {
      ...courseJson,
      showModal: 'is-active',
      ...defaultProps,
      id: qs.id,
    })
  }
}
