import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StudentsService from 'App/Services/StudentsService'

const studentsService = new StudentsService()

export default class StudentsController {
  public async index(ctx: HttpContextContract) {
    const user = await ctx.auth.use('web').authenticate()
    const defaultProps = await StudentsService.defaultViewProps(user)
    return await ctx.view.render('student', { ...defaultProps })
  }

  public async create(ctx: HttpContextContract) {
    return await studentsService.create(ctx)
  }

  public async find(ctx: HttpContextContract) {
    const user = await ctx.auth.use('web').authenticate()
    const defaultViewProps = StudentsService.defaultViewProps(user)
    return await ctx.view.render('student', { ...defaultViewProps })
  }
}
