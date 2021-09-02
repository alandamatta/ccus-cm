import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CoursesController {
  public async index(ctx: HttpContextContract) {
    const auth = ctx.auth
    await auth.use('web').authenticate()
    return await ctx.view.render('course')
  }
}
