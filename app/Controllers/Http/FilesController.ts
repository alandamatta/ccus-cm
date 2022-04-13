import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'
import Database from '@ioc:Adonis/Lucid/Database'
import findStudent from 'App/Queries/FindStudent'

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
    const student = await this.findStudent(studentId, user.locationId)
    if (student && student.length > 0) {
      return ctx.response.stream(await Drive.getStream(location))
    }
  }

  private static async findStudent(studentId: number, locationId: number) {
    return (await Database.rawQuery(findStudent(), { studentId, locationId }))[0]
  }
}
