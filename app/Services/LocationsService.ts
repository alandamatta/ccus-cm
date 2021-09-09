import Location from 'App/Models/Location'
import Logger from '@ioc:Adonis/Core/Logger'
export default class LocationsService {
  public async create(requestBody: any) {
    const location = await new Location().fill(requestBody, true).save()
    Logger.info(JSON.stringify(location))
  }
}
