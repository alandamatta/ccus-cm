import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StudentsService from 'App/Services/StudentsService'
import Student from 'App/Models/Student'

const studentsService = new StudentsService()

export default class StudentsController {
  public async index(ctx: HttpContextContract) {
    const user = await ctx.auth.use('web').authenticate()
    const defaultProps = await StudentsService.defaultViewProps(user)
    return await ctx.view.render('student', { ...defaultProps })
  }

  public async create(ctx: HttpContextContract) {
    await ctx.auth.use('web').authenticate()
    return await studentsService.create(ctx)
  }

  public async find(ctx: HttpContextContract) {
    const user = await ctx.auth.use('web').authenticate()
    const defaultViewProps = await StudentsService.defaultViewProps(user)
    const { id } = ctx.request.params()
    const selectedStudent = await Student.findBy('id', id)
    return await ctx.view.render('student', { ...defaultViewProps, selectedStudent })
  }
}
