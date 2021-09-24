import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ParentsService from 'App/Services/ParentsService'

const parentsService = new ParentsService()

export default class ParentsController {
  public async create(ctx: HttpContextContract) {
    await ctx.auth.use('web').authenticate()
    return await parentsService.create(ctx)
  }
  public async setUpTheModal(ctx: HttpContextContract) {
    await ctx.auth.use('web').authenticate()
    const locations = await parentsService.setupParentsModal(ctx)
    return { locations }
  }
}
