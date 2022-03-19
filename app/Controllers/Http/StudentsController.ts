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

  public async search(ctx: HttpContextContract) {
    const user = await ctx.auth.use('web').authenticate()
    const { data, meta } = await StudentsService.studentsPaginated(ctx.request.qs(), user)
    return ctx.view.render('components/studentList', { students: data, meta })
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
        'select id, name, address, phone, email, location_id as locationId from parents p where id in (:id)',
        {
          id: [parent1Id, parent2Id],
        }
      )
      contacts = result[0]
      selectedStudent.contacts = contacts
    }
    return ctx.view.render('student', { ...defaultViewProps, selectedStudent })
  }

  public async inactivate(ctx: HttpContextContract) {
    const { id } = ctx.request.params()
    await studentsService.inactivateById(id)
    return ctx.response.redirect().back()
  }

  public async reactivate(ctx: HttpContextContract) {
    const { id } = ctx.request.params()
    await studentsService.reactivateById(id)
    return ctx.response.redirect().back()
  }
}
