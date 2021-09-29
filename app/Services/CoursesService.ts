import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Location from 'App/Models/Location'
import Course from 'App/Models/Course'
import Database from '@ioc:Adonis/Lucid/Database'
import CourseValidator from 'App/Validators/CourseValidator'

export default class CoursesService {
  public async create(ctx: HttpContextContract) {
    await ctx.request.validate(CourseValidator)
    let body = ctx.request.body()
    if (body.id && body.id > 0) {
      const course = await Course.findOrFail(body.id)
      return await course.merge(body, true).save()
    }
    body.id = null
    const course = new Course()
    return await course.fill(body, true).save()
  }
  public async search(search: string) {
    search = `%${search}%`
    const result = await Database.rawQuery('select * from courses where name like ?', [search])
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
  public async defaultProps(user, qs) {
    const locationId = user.locationId
    const locations = await this.getAllLocations(user)
    const courses = await this.search(qs.search || '')
    return { locations, locationId, courses }
  }
  public static mapLocationForTheView(location) {
    return {
      label: location.name,
      value: location.id,
    }
  }
}
