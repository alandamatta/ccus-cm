import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Location from 'App/Models/Location'
import Parent from 'App/Models/Parent'
import ParentValidator from 'App/Validators/ParentValidator'

export default class ParentsService {
  public async create(ctx: HttpContextContract) {
    await ParentsService.validate(ctx)
    const parent = new Parent()
    const body = ctx.request.body()
    return await parent.fill(body, true).save()
  }
  public async setupParentsModal(ctx: HttpContextContract) {
    const user = await ctx.auth.use('web').authenticate()
    const rawLocations = await ParentsService.findAllLocations()
    return rawLocations.map((location) => ParentsService.mapLocationForTheView(location, user))
  }
  private static async validate(ctx: HttpContextContract) {
    await ctx.request.validate(ParentValidator)
  }
  private static async findAllLocations() {
    return await Location.all()
  }
  private static mapLocationForTheView(location, user) {
    return {
      value: location.id,
      label: location.name,
      default: location.id === user.locationId,
    }
  }
}
