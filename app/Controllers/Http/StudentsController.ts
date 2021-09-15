import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StudentsService from 'App/Services/StudentsService'
import CreateStudentValidator from 'App/Validators/CreateStudentValidator'
import Logger from '@ioc:Adonis/Core/Logger'

const studentsService = new StudentsService()

export default class StudentsController {
  public async index(ctx: HttpContextContract) {
    await ctx.auth.use('web').authenticate()
    return await ctx.view.render('student')
  }
  public async create(ctx: HttpContextContract) {
    Logger.info(JSON.stringify(ctx.request.body()))
    await ctx.request.validate(CreateStudentValidator)
    await studentsService.create(ctx.request.body())
  }
}
