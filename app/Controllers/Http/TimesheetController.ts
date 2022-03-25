import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TimesheetService from 'App/Services/TimesheetService'

const timesheetService = new TimesheetService()

export default class TimesheetController {
  public async index(ctx: HttpContextContract) {
    await ctx.auth.use('web').authenticate()
    return await TimesheetController.view(ctx)
  }
  public async search(ctx: HttpContextContract) {
    await ctx.auth.use('web').authenticate()
    const defaultProps = await timesheetService.pageDefaultProps(ctx)
    return await ctx.view.render('components/timesheetList', defaultProps)
  }
  public async checkIn(ctx: HttpContextContract) {
    await ctx.auth.use('web').authenticate()
    await timesheetService.checkIn(ctx)
    const defaultProps = await timesheetService.pageDefaultProps(ctx)
    return await ctx.view.render('components/timesheetList', defaultProps)
  }
  public async cancel(ctx: HttpContextContract) {
    await ctx.auth.use('web').authenticate()
    await timesheetService.cancel(ctx)
    const defaultProps = await timesheetService.pageDefaultProps(ctx)
    return await ctx.view.render('components/timesheetList', defaultProps)
  }
  private static async view(ctx) {
    const defaultProps = await timesheetService.pageDefaultProps(ctx)
    return ctx.view.render('timesheet', { ...defaultProps })
  }
}
