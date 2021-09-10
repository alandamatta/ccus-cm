import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TimesheetController {
  public async index(ctx: HttpContextContract) {
    await ctx.auth.use('web').authenticate()
    return ctx.view.render('timesheet')
  }
}
