import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginController {
  public async index(ctx: HttpContextContract) {
    return ctx.view.render('login')
  }
  public async login(ctx: HttpContextContract) {
    const auth = ctx.auth
    const body = ctx.request.body()
    try {
      await auth.use('web').attempt(body.email, body.password)
      await ctx.response.redirect('/')
    } catch {
      ctx.session.flash('error', 'Invalid credentials')
      return ctx.response.redirect('/login')
    }
    //TODO: add a log here
  }
  public async logout(ctx: HttpContextContract) {
    const auth = ctx.auth
    await auth.use('web').authenticate()
    await auth.use('web').logout()
    await ctx.response.redirect('/login')
    //TODO: add a log here
  }
}
