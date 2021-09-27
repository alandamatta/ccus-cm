import Student from '../Models/Student'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateStudentValidator from 'App/Validators/CreateStudentValidator'
import Course from 'App/Models/Course'
import Logger from '@ioc:Adonis/Core/Logger'

export default class StudentsService {
  public async create(ctx: HttpContextContract) {
    const body = ctx.request.body()
    Logger.info(JSON.stringify(body))
    await ctx.request.validate(CreateStudentValidator)
    const user = await ctx.auth.use('web').authenticate()
    const student = new Student().fill(body, true)
    student.locationId = user.locationId
    return await student.save()
  }

  public static async defaultViewProps(user) {
    let courses = await Course.query().where('location_id', user.locationId)
    const coursesView = courses.map((e) => {
      return {
        label: e.name,
        value: e.id,
      }
    })
    let grades = StudentsService.grades()
    const students = await Student.query().where('location_id', user.locationId)
    return { coursesView, grades, students }
  }

  public static grades() {
    return [
      { value: 'PK', label: 'PK' },
      { value: 'K', label: 'K' },
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
      { value: '5', label: '5' },
      { value: '6', label: '6' },
      { value: '7', label: '7' },
      { value: '8', label: '8' },
      { value: '9', label: '9' },
      { value: '10', label: '10' },
      { value: '11', label: '11' },
      { value: '12', label: '12' },
    ]
  }
}
