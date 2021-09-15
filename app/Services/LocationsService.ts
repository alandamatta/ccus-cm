import Location from 'App/Models/Location'
import Course from 'App/Models/Course'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'

export default class LocationsService {
  public async create(requestBody: any) {
    let course: Course
    Logger.info('Creating location')
    const location = await new Location().fill(requestBody, true).save()
    if (requestBody.course) {
      for (const element of requestBody.course) {
        Logger.info('Creating course')
        course = new Course().fill(element, true)
        await location.related('courses').save(course)
      }
    }
  }
  public async search(search) {
    search = `%${search}%`
    const result = await Database.rawQuery('select * from locations where name like ?', [search])
    return result[0]
  }
}
