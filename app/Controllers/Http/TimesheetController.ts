import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TimesheetService from 'App/Services/TimesheetService'

const timesheetService = new TimesheetService()

export default class TimesheetController {
  public async index(ctx: HttpContextContract) {
    await ctx.auth.use('web').authenticate()
    return await TimesheetController.view(ctx)
  }
  public async checkIn(ctx: HttpContextContract) {
    await ctx.auth.use('web').authenticate()
    await timesheetService.checkIn(ctx)
    return await ctx.response.redirect().withQs().back()
  }
  public async cancel(ctx: HttpContextContract) {
    await ctx.auth.use('web').authenticate()
    await timesheetService.cancel(ctx)
    return await ctx.response.redirect().withQs().back()
  }
  private static async view(ctx) {
    const defaultProps = await timesheetService.pageDefaultProps(ctx)
    return ctx.view.render('timesheet', { ...defaultProps })
  }
}
