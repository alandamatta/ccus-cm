import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StudentsService from 'App/Services/StudentsService'
import Database from '@ioc:Adonis/Lucid/Database'

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
    const selectedStudent = await studentsService.findByIdAndLocationId(
      user.locationId,
      id,
      user.admin
    )
    let contacts = []
    if (selectedStudent && (selectedStudent.parent1Id || selectedStudent.parent2Id)) {
      const parent1Id = selectedStudent.parent1Id || null
      const parent2Id = selectedStudent.parent2Id || null
      const result = await Database.rawQuery(
        'select id, name, address, phone, email from parents p where id in (:id)',
        {
          id: [parent1Id, parent2Id],
        }
      )
      contacts = result[0]
      selectedStudent.contacts = contacts
    }
    return await ctx.view.render('student', { ...defaultViewProps, selectedStudent })
  }
}
