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
import FindCoursesByLoationId from 'App/Queries/FindCoursesByLoationId'
import GetLocationsForUser from 'App/Queries/GetLocationsForUser'
import StudentsService from 'App/Services/StudentsService'
import { DateTime } from 'luxon'

const studentsService = new StudentsService()

export default class CoursesService {
  public async create(ctx: HttpContextContract) {
    const user = await ctx.auth.use('web').authenticate()
    await ctx.request.validate(CourseValidator)
    let body = ctx.request.body()
    body.locationId = user.admin ? body.locationId : user.locationId
    body.deletedAt = body.disabled === 'on' ? DateTime.now() : null
    if (body.id && body.id > 0) {
      const course = await Course.findOrFail(body.id)
      return await course.merge(body, true).save()
    }
    body.id = null
    const course = new Course()
    return await course.fill(body, true).save()
  }
  public async deleteByIdAndLocationId(courseId: number, user) {
    const { locationId, admin } = user
    await Database.rawQuery(DeleteCourseByIdAndLocationId(), {
      courseId,
      locationId,
      admin,
    })
  }
  public async search(search: string, user: any) {
    const { locationId, admin } = user
    const result = await Database.rawQuery(CourseList(), { search, locationId, admin })
    return result[0]
  }
  public async getAllLocations(user: User, courseId: number = -1) {
    let result: Location[] = []
    const { admin } = user
    if (user.admin) {
      result = await Database.rawQuery(GetLocationsForUser(), { admin, id: courseId })
    } else if (user.admin) {
      return []
    }
    return result[0]
  }
  public async findByLocationId(locationId) {
    const result = await Database.rawQuery(FindCoursesByLoationId(), { locationId })
    return result[0]
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
  public async defaultProps(user, request) {
    const qs = request.qs()
    const courseId = request.params().id || -1
    const locations = await this.getAllLocations(user, courseId)
    const courses = await this.search(qs.search || '', user)
    const daysOfTheWeek = DaysOfTheWeek
    const showLocationSelect = user.admin
    const studentsEnrolledInCourse = await studentsService.findByCourseId(courseId)
    const locationUpdateRestrictionMessage = studentsEnrolledInCourse.length > 0
    return {
      locations,
      courses,
      daysOfTheWeek,
      showLocationSelect,
      locationUpdateRestrictionMessage,
    }
  }
  public async updateMany(courses: Course[], location: Location) {
    for (let course of courses) {
      const oldCourse = await Course.findBy('id', course.id)
      if (oldCourse) {
        await oldCourse.merge(course, true).save()
      } else {
        course.locationId = location.id
        const newCourse = new Course()
        await newCourse.fill(course, true).save()
      }
    }
  }
  public deleteManyByIdAndLocationId(ids: number[], locationId) {
    return Database.rawQuery(
      'DELETE FROM courses WHERE location_id = :locationId AND id NOT IN(:ids)',
      { ids, locationId }
    )
  }
  public static mapLocationForTheView(location) {
    return {
      label: location.name,
      value: location.id,
    }
  }
}
