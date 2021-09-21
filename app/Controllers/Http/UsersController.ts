import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'
import Location from 'App/Models/Location'

export default class UsersController {
  public async index(ctx: HttpContextContract) {
    const auth = ctx.auth
    await auth.use('web').authenticate()
    const users = await User.all()
    return await ctx.view.render('user', { users: users })
  }
  public async indexCreate(ctx: HttpContextContract) {
    const auth = ctx.auth
    await auth.use('web').authenticate()
    const users = await User.all()
    const rawLocations = await Location.all()
    const locations = rawLocations.map((location) => {
      return {
        label: location.name,
        value: location.id,
      }
    })
    return await ctx.view.render('user', { showModal: 'is-active', users, locations })
  }
  public async create(ctx: HttpContextContract) {
    const auth = ctx.auth
    await auth.use('web').authenticate()
    await ctx.request.validate(UserValidator)
    const user = new User()
    const body = ctx.request.body()
    await user.fill(body, true).save()
    return ctx.response.redirect('/user')
  }
}
