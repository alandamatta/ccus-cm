import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Student from 'App/Models/Student'
import Drive from '@ioc:Adonis/Core/Drive'

export default class FilesController {
  public async index(ctx: HttpContextContract) {
    const user = await ctx.auth.use('web').authenticate()
    const request = ctx.request
    const { studentId } = request.params()
    const location = request.param('fileName')
    const student = await Student.query()
      .where('id', studentId)
      .andWhere('location_id', user.locationId)
    if (student && student.length > 0) {
      return ctx.response.stream(await Drive.getStream(location))
    }
  }
}
