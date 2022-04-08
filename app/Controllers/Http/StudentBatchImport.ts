import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StudentBatchImport {
  public async index(ctx: HttpContextContract) {
    await ctx.auth.authenticate()
    return ctx.view.render('studentBatchImport')
  }
}
