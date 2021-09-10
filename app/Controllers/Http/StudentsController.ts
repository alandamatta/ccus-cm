import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StudentsController {
  public async index(ctx: HttpContextContract) {
    await ctx.auth.use('web').authenticate()
    return await ctx.view.render('student')
  }
}
