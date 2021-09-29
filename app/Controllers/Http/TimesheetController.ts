import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TimesheetService from 'App/Services/TimesheetService'
import Logger from '@ioc:Adonis/Core/Logger'

const timesheetService = new TimesheetService()

export default class TimesheetController {
  public async index(ctx: HttpContextContract) {
    await ctx.auth.use('web').authenticate()
    return await TimesheetController.view(ctx)
  }
  public async checkIn(ctx: HttpContextContract) {
    await ctx.auth.use('web').authenticate()
    await timesheetService.checkIn(ctx)
    const defaultProps = await timesheetService.pageDefaultProps(ctx)
    Logger.info(JSON.stringify('defaultProps: ' + JSON.stringify(defaultProps)))
    return await ctx.response.redirect().withQs().back()
  }
  public async cancel(ctx: HttpContextContract) {
    await ctx.auth.use('web').authenticate()
    await timesheetService.cancel(ctx)
    return await ctx.response.redirect().withQs().back()
  }
  private static async view(ctx) {
    Logger.info(JSON.stringify(ctx.request.qs()))
    const defaultProps = await timesheetService.pageDefaultProps(ctx)
    return ctx.view.render('timesheet', { ...defaultProps })
  }
}
