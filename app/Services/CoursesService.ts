import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Location from 'App/Models/Location'
import Course from 'App/Models/Course'
import Database from '@ioc:Adonis/Lucid/Database'
import CourseValidator from 'App/Validators/CourseValidator'
import CourseList from 'App/Queries/CourseList'
import DaysOfTheWeek from 'App/Constants/DaysOfTheWeek'
import CourseDependentsCheck from 'App/Queries/CourseDependentsCheck'
import DeleteCourseByIdAndLocationId from 'App/Queries/DeleteCourseByIdAndLocationId'
import User from 'App/Models/User'
import LocationByIdWhenUserHaveAccess from 'App/Queries/LocationByIdWhenUserHaveAccess'

export default class CoursesService {
  public async create(ctx: HttpContextContract) {
    const user = await ctx.auth.use('web').authenticate()
    await ctx.request.validate(CourseValidator)
    let body = ctx.request.body()
    if (body.id && body.id > 0) {
      const course = await Course.findOrFail(body.id)
      course.locationId = user.locationId
      return await course.merge(body, true).save()
    }
    body.id = null
    const course = new Course()
    body.locationId = user.locationId
    return await course.fill(body, true).save()
  }
  public async deleteByIdAndLocationId(courseId: number, locationId: number) {
    await Database.rawQuery(DeleteCourseByIdAndLocationId(), {
      courseId,
      locationId,
    })
  }
  public async search(search: string, locationId: number) {
    const result = await Database.rawQuery(CourseList(), { search, locationId })
    return result[0]
  }
  public async getAllLocations(user) {
    let result: Location[] = []
    if (user.admin) {
      result = await Location.all()
    } else {
      result = await Location.query().where('id', user.locationId)
    }
    return result.map(CoursesService.mapLocationForTheView)
  }
  public findByLocationId(id) {
    return Course.query().where('location_id', id)
  }
  public findCourseByDayOfTheWeekAndLocationId(dayOfWeek, locationId) {
    return Course.query().where('day_of_week', dayOfWeek).andWhere('location_id', locationId)
  }
  public async findByIdWhenUserHaveAccess(user: User, courseId: number) {
    const locationId = user?.locationId
    const admin = user?.admin
    const result = await Database.rawQuery(LocationByIdWhenUserHaveAccess(), {
      locationId,
      courseId,
      admin,
    })
    return result && result[0] && result[0][0] ? result[0][0] : []
  }
  public async checkForCourseDependents(courseId: number) {
    const result = await Database.rawQuery(CourseDependentsCheck(), { courseId })
    return result[0]
  }
  public async defaultProps(user, qs) {
    const locationId = user.locationId
    const locations = await this.getAllLocations(user)
    const courses = await this.search(qs.search || '', user.locationId)
    const daysOfTheWeek = DaysOfTheWeek
    return { locations, locationId, courses, daysOfTheWeek }
  }
  public static mapLocationForTheView(location) {
    return {
      label: location.name,
      value: location.id,
    }
  }
}
