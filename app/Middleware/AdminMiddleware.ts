import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Location from 'App/Models/Location'

const ADMIN_ONLY_PATHS = ['/user', '/location']

export default class AdminMiddleware {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const user = await ctx.auth.use('web').authenticate()
    const isUrlForAdminsOnly = ADMIN_ONLY_PATHS.filter((value) =>
      ctx.request.url().startsWith(value)
    )
    if (isUrlForAdminsOnly.length > 0 && (!user || !user.admin)) {
      ctx.response.redirect().toPath('/logout')
      return
    }
    const location = await Location.findOrFail(user.locationId)
    await ctx.session.put('global_userLocation', location.name)
    await next()
  }
}
