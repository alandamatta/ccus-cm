import Student from '../Models/Student'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateStudentValidator from 'App/Validators/CreateStudentValidator'
import Course from 'App/Models/Course'
import Application from '@ioc:Adonis/Core/Application'
import { DateTime } from 'luxon'
import PhotoService from 'App/Services/PhotoService'
// import Logger from '@ioc:Adonis/Core/Logger'

const photoService = new PhotoService()

export default class StudentsService {
  public async create(ctx: HttpContextContract) {
    const user = await ctx.auth.use('web').authenticate()
    await ctx.request.validate(CreateStudentValidator)
    const body = ctx.request.body()
    const photo = ctx.request.file('picture')
    const student = new Student().fill(body, true)
    if (photo) {
      const tempPath = Application.tmpPath('uploads')
      photo.clientName = StudentsService.generateFileName(photo)
      await photo.move(tempPath)
      const photoPath = StudentsService.file(tempPath, photo.clientName)
      await photoService.compressImage(photoPath)
      student.picture = photo.clientName
    }
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

  private static file(tmpPath, fileName) {
    return `${tmpPath}/${fileName}`
  }

  private static generateFileName(photo) {
    return `${DateTime.now().diff(DateTime.local(1900, 5, 1)).milliseconds}.${photo.extname}`
  }
}
