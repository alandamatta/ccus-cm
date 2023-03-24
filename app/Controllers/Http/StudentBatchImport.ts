import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ImportStudentValidator from 'App/Validators/ImportStudentValidator'
import StudentsService from 'App/Services/StudentsService'
import Course from 'App/Models/Course'

export default class StudentBatchImport {
  public async index(ctx: HttpContextContract) {
    await ctx.auth.authenticate()
    return ctx.view.render('studentBatchImport')
  }
  public async viewImport({ session, request, response }: HttpContextContract) {
    await request.validate(ImportStudentValidator)
    const studentsService = new StudentsService()
    const file = request.file('file')
    const courses: Course[] = request.body().courses
    const list = await studentsService.xlsx2Entity(file, courses)
    session.put('students', list)
    return response.redirect().back()
  }
}
