import Database from '@ioc:Adonis/Lucid/Database'
import studentListTimesheetQuery from 'App/Queries/StudentListTimesheet'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import Attendance from 'App/Models/Attendance'
import Student from 'App/Models/Student'
import CoursesService from 'App/Services/CoursesService'
import Course from 'App/Models/Course'
import { DateTime } from 'luxon'

const coursesService = new CoursesService()

export default class TimesheetService {
  public async pageDefaultProps(ctx: HttpContextContract) {
    const user = ctx.auth.use('web').user
    const body = ctx.request.qs()
    const locationId = user ? user.locationId : -1
    const rawDate = TimesheetService.getDate(ctx)
    const date = TimesheetService.formatDateToString(rawDate)
    const search = body.search || ''
    let courseId = await TimesheetService.getCourseId(locationId, body.courseId || -1)
    const studentsTimesheet = await this.findByLocationIdAndCourseIdAndDate(
      locationId,
      courseId,
      rawDate,
      search
    )
    const rawCourses = await coursesService.findByLocationId(locationId)
    let courses = rawCourses.map(CoursesService.mapLocationForTheView)
    courses.push({ value: '-1', label: 'All' })
    const isCoursesScheduled = await TimesheetService.isCoursesScheduledAtTheDate(
      rawDate,
      locationId
    )
    return { studentsTimesheet, date, courses, courseId, search, isCoursesScheduled }
  }

  public async findByLocationIdAndCourseIdAndDate(
    locationId: number,
    courseId: number,
    rawDate: DateTime,
    search: string
  ) {
    const dayOfTheWeek = rawDate.weekday
    const date = TimesheetService.formatDateToString(rawDate)
    const args = {
      locationId,
      courseId,
      date,
      search,
      dayOfTheWeek,
    }
    return Database.rawQuery(studentListTimesheetQuery(), args)
  }

  private static formatToDateTime(date: string): DateTime {
    return DateTime.fromFormat(date, 'yyyy-MM-dd')
  }

  private static formatDateToString(date: DateTime) {
    return date.toFormat('yyyy-MM-dd')
  }

  public async checkIn(ctx: HttpContextContract) {
    const user = ctx.auth.use('web').user
    const body = ctx.request.body()
    const userCanCheckStudentIn = await TimesheetService.isUserHasRightsOverStudentData(
      user,
      body.studentId
    )
    if (userCanCheckStudentIn) {
      body.time = DateTime.fromFormat(body.time, 'yyyy-MM-dd HH:mm')
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

  private static async isUserHasRightsOverStudentData(user, studentId) {
    const result = await Student.query()
      .where('id', studentId)
      .andWhere('locationId', user.locationId)
    return result && result.length > 0
  }

  private static async getCourseId(locationId: number, courseId: number) {
    const userHasRights = await TimesheetService.isUserHasRightsOverCourse(locationId, courseId)
    return userHasRights ? courseId : -1
  }

  private static async isUserHasRightsOverCourse(locationId: number, courseId: number) {
    const result = await Course.query().where('id', courseId).andWhere('location_id', locationId)
    return result && result.length > 0
  }

  private static getDate(ctx: HttpContextContract) {
    const body = ctx.request.qs()
    const date = body.date || ctx.session.get('today')
    return TimesheetService.formatToDateTime(date)
  }

  private static async isCoursesScheduledAtTheDate(date: DateTime, locationId: number) {
    const dayOfTheWeek = date.weekday
    const result = await coursesService.findCourseByDayOfTheWeekAndLocationId(
      dayOfTheWeek,
      locationId
    )
    return result && result.length > 0
  }
}
