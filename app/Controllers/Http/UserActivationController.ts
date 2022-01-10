import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsersService from 'App/Services/UsersService'
import UserActivationValidator from 'App/Validators/UserActivationValidator'

const usersService = new UsersService()

export default class UserActivationController {
  public async index(ctx: HttpContextContract) {
    const params = ctx.request.params()
    const user = await usersService.findByKey(params.key)
    if (user) {
      return ctx.view.render('user_activation', { key: user.key })
    }
    return ctx.response.redirect().toRoute('login')
  }
  public async create(ctx: HttpContextContract) {
    await ctx.request.validate(UserActivationValidator)
    const body = ctx.request.body()
    await usersService.setPassword(body.key, body.password)
    const auth = ctx.auth
    try {
      await auth.use('web').attempt(body.email, body.password)
      await ctx.session.put('today', body.today)
      await ctx.response.redirect('/')
    } catch {
      ctx.session.flash('error', 'Invalid credentials')
      return ctx.response.redirect('/login')
    }
  }
}
