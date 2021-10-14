import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Student from 'App/Models/Student'
import Drive from '@ioc:Adonis/Core/Drive'

export default class FilesController {
  public async image(ctx: HttpContextContract) {
    const user = await ctx.auth.use('web').authenticate()
    const imgFolder = 'pictures/'
    return FilesController.findFile(ctx, imgFolder, user)
  }

  public async file(ctx: HttpContextContract) {
    const user = await ctx.auth.use('web').authenticate()
    const folder = 'files/'
    return FilesController.findFile(ctx, folder, user)
  }

  private static async findFile(ctx: HttpContextContract, folderBase: string, user) {
    const request = ctx.request
    const { studentId } = request.params()
    const location = folderBase + request.param('fileName')
    const student = await Student.query()
      .where('id', studentId)
      .andWhere('location_id', user.locationId)
    if (student && student.length > 0) {
      return ctx.response.stream(await Drive.getStream(location))
    }
  }
}
