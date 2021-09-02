import Logger from '@ioc:Adonis/Core/Logger'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Location from 'App/Models/Location'

export default class LocationsController {
  public async index(ctx: HttpContextContract) {
    const auth = ctx.auth
    await auth.use('web').authenticate()
    return await ctx.view.render('location')
  }
  public async create(ctx: HttpContextContract) {
    const auth = ctx.auth
    await auth.use('web').authenticate()
    const body = ctx.request.body()
    const location = new Location()
    location.fill(body, true)
    Logger.info('Location Body: ')
    Logger.info('Location Model: ' + JSON.stringify(location.toJSON()))
    await ctx.request.validate({ schema: this.schema() })
    return await ctx.response.redirect('/location')
  }
  private schema() {
    return schema.create({
      name: schema.string({}, [rules.maxLength(60)]),
      city: schema.string({}, [rules.maxLength(60)]),
      state: schema.string({}, [rules.maxLength(2)]),
      zip: schema.string({ trim: true }),
    })
  }
}
