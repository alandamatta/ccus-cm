import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CoursesService from 'App/Services/CoursesService'

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
    const course = await coursesService.findByIdWhenUserHaveAccess(user, qs.id)
    const defaultProps = await coursesService.defaultProps(user, qs)
    return await ctx.view.render('course', {
      ...course,
      showModal: 'is-active',
      ...defaultProps,
      id: qs.id,
    })
  }
  public async delete(ctx: HttpContextContract) {
    const user = await ctx.auth.use('web').authenticate()
    const params = ctx.request.params()
    const { id } = params
    const dependents = await coursesService.checkForCourseDependents(id)
    if (dependents && dependents.length > 0) {
      const qs = ctx.request.qs()
      const defaultProps = await coursesService.defaultProps(user, qs)
      return await ctx.view.render('course', { dependents, ...defaultProps })
    }
    await coursesService.deleteByIdAndLocationId(id, user.locationId)
    return await ctx.response.redirect().toPath('/course')
  }
}
