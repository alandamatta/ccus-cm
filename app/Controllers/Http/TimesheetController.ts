import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TimesheetService from 'App/Services/TimesheetService'

const timesheetService = new TimesheetService()

export default class TimesheetController {
  public async index(ctx: HttpContextContract) {
    const user = await ctx.auth.use('web').authenticate()
    const studentsTimesheet = await timesheetService.studentsListTimesheet(user)
    return await ctx.view.render('timesheet', { studentsTimesheet })
  }
  public async setup(ctx: HttpContextContract) {
    const user = await ctx.auth.use('web').authenticate()
    return (await timesheetService.studentsListTimesheet(user))[0]
  }
}
