import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ImportStudentValidator from 'App/Validators/ImportStudentValidator'
import StudentsService from 'App/Services/StudentsService'
import Course from 'App/Models/Course'

export default class StudentV1Controller {
  public async index({}: HttpContextContract) {}

  public async readXlsx({ response, request }: HttpContextContract) {
    await request.validate(ImportStudentValidator)
    const studentsService = new StudentsService()
    const file = request.file('file')
    const courses: Course[] = request.body().courses
    const list = await studentsService.xlsx2Entity(file, courses)
    response.ok(list)
  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
