import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ImportStudentValidator from 'App/Validators/ImportStudentValidator'
import StudentsService from 'App/Services/StudentsService'

export default class StudentV1Controller {
  public async index({}: HttpContextContract) {}

  public async readXlsx({ response, request }: HttpContextContract) {
    await request.validate(ImportStudentValidator)
    const studentsService = new StudentsService()
    const file = request.file('file')
    let courses: number[] = Array.isArray(request.body().courses)
      ? request.body().courses
      : [request.body().courses]
    courses = courses.filter((e) => e)
    if (!courses || courses.length === 0) {
      response.badRequest({ errors: 'At least one location is required' })
      return response.redirect('/studentBatchImport')
    }
    const list = await studentsService.xlsx2Entity(file, courses)
    response.ok(list)
  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
