import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async index(ctx: HttpContextContract) {
    const auth = ctx.auth
    await auth.use('web').authenticate()
    let session = ctx.session
    const allUsers = await User.all()
    session.put('users', allUsers)
    return await ctx.view.render('user', { users: allUsers })
  }
  public async indexCreate(ctx: HttpContextContract) {
    const auth = ctx.auth
    await auth.use('web').authenticate()
    let session = ctx.session
    const allUsers = await User.all()
    session.put('users', allUsers)
    return await ctx.view.render('user', { showModal: 'is-active' })
  }
  public async create(ctx: HttpContextContract) {
    const auth = ctx.auth
    await auth.use('web').authenticate()
    const user = new User()
    const body = ctx.request.body()
    await user.fill(body, true).save()
    return ctx.response.redirect('/user')
  }
}
