import Database from '@ioc:Adonis/Lucid/Database'
import studentListTimesheetQuery from 'App/Queries/studentListTimesheet'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import Attendance from 'App/Models/Attendance'
import { DateTime } from 'luxon'

export default class TimesheetService {
  public studentsListTimesheet(user) {
    const locationId = user.locationId
    const courseId = null
    return Database.rawQuery(studentListTimesheetQuery(), [locationId, courseId, courseId])
  }

  public async checkIn(ctx: HttpContextContract) {
    Logger.info(JSON.stringify(ctx.request.body()))
    const attendance = new Attendance()
    attendance.fill(ctx.request.body(), true)
    attendance.time = DateTime.now()
    await attendance.save()
  }

  public async cancel(ctx: HttpContextContract) {
    const { attendanceId } = ctx.request.params()
    const attendance = await Attendance.findOrFail(attendanceId)
    await attendance.delete()
  }
}
