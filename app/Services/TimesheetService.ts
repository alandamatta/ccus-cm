import Database from '@ioc:Adonis/Lucid/Database'
import studentListTimesheetQuery from 'App/Queries/studentListTimesheet'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import Attendance from 'App/Models/Attendance'
import Student from 'App/Models/Student'
import CoursesService from 'App/Services/CoursesService'

const coursesService = new CoursesService()

export default class TimesheetService {
  public studentsListTimesheet(ctx: HttpContextContract) {
    const user = ctx.auth.use('web').user
    const locationId = user ? user.locationId : -1
    let courseId = ''
    const date = TimesheetService.today(ctx)
    return Database.rawQuery(studentListTimesheetQuery(), { locationId, courseId, date })
  }

  public async pageDefaultProps(ctx: HttpContextContract) {
    const user = ctx.auth.use('web').user
    const body = ctx.request.body()
    const locationId = user ? user.locationId : -1
    const date = TimesheetService.getDate(ctx)
    let courseId = body.courseId || ''
    const studentsTimesheet = await this.findByLocationIdAndCourseIdAndDate(
      locationId,
      courseId,
      date
    )
    const rawCourses = await coursesService.findByLocationId(locationId)
    const courses = rawCourses.map(CoursesService.mapLocationForTheView)
    return { studentsTimesheet, date, courses }
  }

  public async findByLocationIdAndCourseIdAndDate(
    locationId: number,
    courseId: number,
    date: string
  ) {
    return Database.rawQuery(studentListTimesheetQuery(), { locationId, courseId, date })
  }

  public async checkIn(ctx: HttpContextContract) {
    const user = ctx.auth.use('web').user
    const body = ctx.request.body()
    const userCanCheckStudentIn = await TimesheetService.isUserHasRightsOverData(
      user,
      body.studentId
    )
    if (userCanCheckStudentIn) {
      const attendance = new Attendance()
      attendance.fill(ctx.request.body(), true)
      return await attendance.save()
    } else {
      Logger.error('User access violation attempt')
    }
  }

  public async cancel(ctx: HttpContextContract) {
    const { attendanceId } = ctx.request.params()
    const user = await ctx.auth.use('web').user
    const attendance = await Attendance.findOrFail(attendanceId)
    if (user && attendance.locationId === user.locationId) {
      return await attendance.delete()
    }
  }

  private static async isUserHasRightsOverData(user, studentId) {
    const result = await Student.query()
      .where('id', studentId)
      .andWhere('locationId', user.locationId)
    return result && result.length > 0
  }

  public static today(ctx: HttpContextContract) {
    const rawToday = new Date(ctx.session.get('today'))
    Logger.info('today from session: ' + rawToday)
    const day = `${rawToday.getDate()}`.padStart(2, '0')
    const month = `${rawToday.getMonth() + 1}`.padStart(2, '0')
    return `${rawToday.getFullYear()}-${month}-${day}`
  }

  private static getDate(ctx: HttpContextContract) {
    const body = ctx.request.body()
    const today = TimesheetService.today(ctx)
    Logger.info('today: ' + today)
    Logger.info('body.date: ' + body.date)
    return body.date || today
  }
}
