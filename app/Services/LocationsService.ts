import Location from 'App/Models/Location'
import Course from 'App/Models/Course'
import Database from '@ioc:Adonis/Lucid/Database'
import LocationList from 'App/Queries/LocationList'
import LocationDependentsCheck from 'App/Queries/LocationDependentsCheck'
import User from 'App/Models/User'
import DeleteLocationById from 'App/Queries/DeleteLocationById'

export default class LocationsService {
  public async create(requestBody: any) {
    let course: Course
    const location = await new Location().fill(requestBody, true).save()
    if (requestBody.course) {
      for (const element of requestBody.course) {
        course = new Course().fill(element, true)
        await location.related('courses').save(course)
      }
    }
  }
  public async search(search) {
    search = `%${search}%`
    const result = await Database.rawQuery(LocationList(), [search])
    return result[0]
  }
  public findAll() {
    return Location.all()
  }
  public async checkForLocationDependents(locationId: number) {
    const result = await Database.rawQuery(LocationDependentsCheck(), { locationId })
    return result[0]
  }
  public deleteById(id: number, user: User) {
    const { admin } = user
    return Database.rawQuery(DeleteLocationById(), { id, admin })
  }
}
