import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TimesheetController {
  public async index(ctx: HttpContextContract) {
    return ctx.view.render('timesheet')
  }
}
