import Database from '@ioc:Adonis/Lucid/Database'
import studentListTimesheetQuery from 'App/Queries/StudentListTimesheet'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import Attendance from 'App/Models/Attendance'
import CoursesService from 'App/Services/CoursesService'
import Course from 'App/Models/Course'
import { DateTime } from 'luxon'
import checkUserAccessToStudent from 'App/Queries/CheckUserAccessToStudent'

const coursesService = new CoursesService()

export default class TimesheetService {
  public async pageDefaultProps(ctx: HttpContextContract) {
    const user = ctx.auth.use('web').user
    const body = ctx.request.qs()
    const locationId = user ? user.locationId : -1
    const rawDate = TimesheetService.getDate(ctx)
    const date = TimesheetService.formatDateToString(rawDate)
    const search = body.search || ''
    const hideCI = body.hideCI === 'true'
    const hideCO = body.hideCO === 'true'
    let courseIdFilter = await TimesheetService.getCourseId(locationId, body.courseIdFilter || -1)
    const studentsTimesheet = await this.findByLocationIdAndCourseIdAndDate(
      locationId,
      courseIdFilter,
      rawDate,
      search,
      hideCI,
      hideCO
    )
    const rawCourses = await coursesService.findByLocationId(locationId)
    let courses = rawCourses.map(CoursesService.mapLocationForTheView)
    courses.push({ value: '-1', label: 'All' })
    const isCoursesScheduled = await TimesheetService.isCoursesScheduledAtTheDate(
      rawDate,
      locationId
    )
    return { studentsTimesheet, date, courses, courseIdFilter, search, isCoursesScheduled }
  }

  public async findByLocationIdAndCourseIdAndDate(
    locationId: number,
    courseId: number,
    rawDate: DateTime,
    search: string,
    hideCI: boolean,
    hideCO: boolean
  ) {
    const dayOfTheWeek = rawDate.weekday
    const date = TimesheetService.formatDateToString(rawDate)
    const args = {
      locationId,
      courseId,
      date,
      search,
      dayOfTheWeek,
      hideCI,
      hideCO,
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
    const body = ctx.request.qs()
    const userCanCheckStudentIn = await TimesheetService.isUserHasRightsOverStudentData(
      user,
      body.studentId
    )
    if (userCanCheckStudentIn) {
      await this.saveOrUpdate(ctx)
    } else {
      Logger.error('User access violation attempt')
    }
  }

  private async saveOrUpdate(ctx: HttpContextContract) {
    const body = ctx.request.qs()
    const user = ctx.auth.use('web').user
    const locationId = user ? user.locationId : -1
    const studentId = body.studentId || -1
    const updateCheckIn = body.checkIn === '1' && body.checkInRef && body.checkInRef > 0
    const updateCheckOut = body.checkIn === '0' && body.checkOutRef && body.checkOutRef > 0
    const time = TimesheetService.stringCheckInTimeToDateTimeCheckInTime(body.time)
    if (updateCheckIn) {
      await this.update(body.checkInRef, locationId, studentId, time)
    } else if (updateCheckOut) {
      await this.update(body.checkOutRef, locationId, studentId, time)
    } else {
      await this.save(ctx)
    }
  }

  private async save(ctx: HttpContextContract) {
    const body = ctx.request.qs()
    body.time = TimesheetService.stringCheckInTimeToDateTimeCheckInTime(body.time)
    const attendance = new Attendance()
    attendance.fill(body, true)
    return attendance.save()
  }

  public async update(attendanceId, locationId, studentId, time) {
    return Attendance.query()
      .where('id', attendanceId)
      .andWhere('location_id', locationId)
      .andWhere('student_id', studentId)
      .update({ time: time.toString() })
  }

  public async cancel(ctx: HttpContextContract) {
    const { attendanceId } = ctx.request.params()
    const user = await ctx.auth.use('web').user
    const attendance = await Attendance.findOrFail(attendanceId)
    if (user && attendance.locationId === user.locationId) {
      await attendance.delete()
    }
  }

  private static async isUserHasRightsOverStudentData(user, studentId) {
    const locationId = user.locationId
    const result = await Database.rawQuery(checkUserAccessToStudent(), { locationId, studentId })
    return result && result[0].length > 0
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

  private static stringCheckInTimeToDateTimeCheckInTime(dateString) {
    return DateTime.fromFormat(dateString, 'yyyy-MM-dd HH:mm')
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
