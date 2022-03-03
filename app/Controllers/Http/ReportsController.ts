import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import AttendanceReportByLocationAndCourse from 'App/Queries/AttendanceReportByLocationAndCourse'
import { DateTime } from 'luxon'
import LocationsService from 'App/Services/LocationsService'
import User from 'App/Models/User'
import Location from 'App/Models/Location'
import UtilsService from 'App/Services/UtilsService'
import CoursesService from 'App/Services/CoursesService'
import Course from 'App/Models/Course'

const locationsService = new LocationsService()
const coursesService = new CoursesService()

export default class ReportsController {
  public async index(ctx: HttpContextContract) {
    const user = await ctx.auth.authenticate()
    UtilsService.today(ctx)
    const {
      locationId = -1,
      courseId = -1,
      startDate = UtilsService.formatDateToString(DateTime.now().startOf('month')).toString(),
      endDate = UtilsService.formatDateToString(DateTime.now()).toString(),
      userLocation = user.locationId,
      admin = user.admin,
    } = ctx.request.qs()
    const params = {
      locationId,
      courseId,
      startDate,
      endDate,
      userLocation,
      admin,
    }
    const locations = await ReportsController.getUserLocations(user)
    const courses = await ReportsController.getUserCourses(user, locationId)
    const attendances = (await Database.rawQuery(AttendanceReportByLocationAndCourse(), params))[0]
    const props = { ...params, locations, attendances, courses }
    return await ctx.view.render('attendance', props)
  }
  private static async getUserCourses(user: User, locationId: number) {
    let courses: Course[] = []
    if (user.admin) {
      courses = await coursesService.findByLocationId(locationId)
    } else {
      courses = await coursesService.findByLocationId(user.locationId)
    }
    return courses.map((element) => {
      return {
        label: element.name,
        value: element.id,
      }
    })
  }
  private static async getUserLocations(user: User) {
    if (!user.admin) {
      const location = await Location.find(user.locationId)
      return [
        {
          label: location?.name,
          value: location?.id,
        },
      ]
    }
    return (await locationsService.findAll()).map((el) => {
      return {
        label: el.name,
        value: el.id,
      }
    })
  }
}
