import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TimesheetService from 'App/Services/TimesheetService'

const timesheetService = new TimesheetService()

export default class TimesheetController {
  public async index(ctx: HttpContextContract) {
    await ctx.auth.use('web').authenticate()
    return await TimesheetController.view(ctx)
  }
  public async setup(ctx: HttpContextContract) {
    await ctx.auth.use('web').authenticate()
    return (await timesheetService.studentsListTimesheet(ctx))[0]
  }
  public async checkIn(ctx: HttpContextContract) {
    await ctx.auth.use('web').authenticate()
    await timesheetService.checkIn(ctx)
    return await ctx.response.redirect().toRoute('timesheet.mainPage.init')
  }
  public async cancel(ctx: HttpContextContract) {
    await ctx.auth.use('web').authenticate()
    await timesheetService.cancel(ctx)
    return await ctx.response.redirect().toRoute('timesheet.mainPage.init')
  }
  private static async view(ctx) {
    const defaultProps = await timesheetService.pageDefaultProps(ctx)
    return ctx.view.render('timesheet', { ...defaultProps })
  }
}
