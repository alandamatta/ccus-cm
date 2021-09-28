import Database from '@ioc:Adonis/Lucid/Database'
import studentListTimesheetQuery from 'App/Queries/studentListTimesheet'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import Attendance from 'App/Models/Attendance'
import Student from 'App/Models/Student'
import { DateTime } from 'luxon'

export default class TimesheetService {
  public studentsListTimesheet(user) {
    const locationId = user.locationId
    const courseId = null
    return Database.rawQuery(studentListTimesheetQuery(), [locationId, courseId, courseId])
  }

  public async checkIn(ctx: HttpContextContract) {
    const user = ctx.auth.use('web').user
    const body = ctx.request.body()
    const userCanCheckStudentIn = await TimesheetService.userHasRightsToCheckIn(
      user,
      body.studentId
    )
    Logger.info('browser time: ' + body.time)
    if (userCanCheckStudentIn) {
      const attendance = new Attendance()
      attendance.fill(ctx.request.body(), true)
      attendance.time = DateTime.now()
      return await attendance.save()
    } else {
      Logger.error('User access violation attempt')
    }
  }

  public async cancel(ctx: HttpContextContract) {
    const { attendanceId } = ctx.request.params()
    const attendance = await Attendance.findOrFail(attendanceId)
    await attendance.delete()
  }

  private static async userHasRightsToCheckIn(user, studentId) {
    const result = await Student.query()
      .where('id', studentId)
      .andWhere('locationId', user.locationId)
    return result && result.length > 0
  }
}
