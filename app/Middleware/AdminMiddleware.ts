import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'

export default class AdminMiddleware {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const user = await ctx.auth.use('web').authenticate()
    Logger.info(ctx.request.url())
    if (!user || !user.admin) {
      ctx.response.redirect().toPath('/logout')
      return
    }
    await next()
  }
}
