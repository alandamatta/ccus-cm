import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StudentsController {
  public async index(ctx: HttpContextContract) {
    return await ctx.view.render('student')
  }
}
