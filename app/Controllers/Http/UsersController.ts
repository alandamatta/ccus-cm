import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'
import Location from 'App/Models/Location'
import UsersService from 'App/Services/UsersService'

const userService = new UsersService()

export default class UsersController {
  public async index(ctx: HttpContextContract) {
    const users = await userService.findAllUsers()
    return await ctx.view.render('user', { users: users })
  }
  public async indexCreate(ctx: HttpContextContract) {
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
    await ctx.request.validate(UserValidator)
    const user = new User()
    const body = ctx.request.body()
    delete body.confirmPassword
    await user.fill(body, true).save()
    return ctx.response.redirect('/user')
  }
  public async find(ctx: HttpContextContract) {
    const qs = ctx.request.params()
    const user = await User.findBy('id', qs.id)
    const rawLocations = await Location.all()
    const locations = rawLocations.map((location) => {
      return {
        label: location.name,
        value: location.id,
      }
    })
    return ctx.view.render('user', { showModal: 'is-active', user, locations })
  }
  public async delete(ctx: HttpContextContract) {
    const params = ctx.request.params()
    const user = await User.findOrFail(params.id)
    await user.delete()
    return ctx.response.redirect().toPath('/user')
  }
}
