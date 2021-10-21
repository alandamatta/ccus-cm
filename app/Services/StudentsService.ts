import Student from '../Models/Student'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateStudentValidator from 'App/Validators/CreateStudentValidator'
import Course from 'App/Models/Course'
import Application from '@ioc:Adonis/Core/Application'
import { DateTime } from 'luxon'
import PhotoService from 'App/Services/PhotoService'
import StudentByIdAndLocation from 'App/Queries/StudentByIdAndLocation'
import Database from '@ioc:Adonis/Lucid/Database'

const photoService = new PhotoService()

export default class StudentsService {
  public async create(ctx: HttpContextContract) {
    const user = await ctx.auth.use('web').authenticate()
    await ctx.request.validate(CreateStudentValidator)
    const body = ctx.request.body()
    if (body && body.id && body.id > 0) {
      const dateExistsAndCurrentUserCanManageIt = await this.findByIdAndLocationId(
        user.locationId,
        body.id,
        user.admin
      )
      if (dateExistsAndCurrentUserCanManageIt) {
        const picture = ctx.request.file('picture')
        const file = ctx.request.file('file')
        this.handleParentFlow(body)
        const student = await Student.findOrFail(body.id)
        if (picture) {
          // @ts-ignore
          body.picture = await StudentsService.pictureUpload(ctx)
        }
        if (file) {
          // @ts-ignore
          body.file = await StudentsService.fileUpload(ctx)
        }
        return await student.merge(body, true).save()
      }
      return ctx.response.redirect().back()
    }
    return await this.save(ctx)
  }

  private async save(ctx: HttpContextContract) {
    const body = ctx.request.body()
    const user = ctx.auth.use('web').user
    if (user) {
      this.handleParentFlow(body)
      const student = new Student().fill(body, true)
      // @ts-ignore
      student.picture = await StudentsService.pictureUpload(ctx)
      // @ts-ignore
      student.file = await StudentsService.fileUpload(ctx)
      student.locationId = user.locationId
      return student.save()
    }
  }

  private static async pictureUpload(ctx: HttpContextContract) {
    const picture = ctx.request.file('picture')
    if (picture) {
      const tempPath = Application.tmpPath('uploads/pictures')
      picture.clientName = StudentsService.generateFileName(picture).replace(/\s/g, '')
      await picture.move(tempPath)
      const photoPath = StudentsService.file(tempPath, picture.clientName)
      await photoService.compressImage(photoPath)
      return picture.clientName
    }
    return null
  }

  private static async fileUpload(ctx: HttpContextContract) {
    const file = ctx.request.file('file')
    if (file) {
      const tempPath = Application.tmpPath('uploads/files')
      file.clientName = StudentsService.generateFileName(file).replace(/\s/g, '')
      await file.move(tempPath)
      return file.clientName
    }
    return null
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

  public async findByIdAndLocationId(locationId, studentId, admin) {
    const result = await Database.rawQuery(StudentByIdAndLocation(), {
      locationId,
      studentId,
      admin,
    })
    return result[0][0]
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

  private static generateFileName(photo): string {
    return `${photo.clientName}_${DateTime.now().diff(DateTime.local(1900, 5, 1)).milliseconds}.${
      photo.extname
    }`
  }

  private handleParentFlow(body) {
    if (Array.isArray(body.parent)) {
      body.parent1Id = body.parent[0]
      body.parent2Id = body.parent[1]
    } else if (body.parent && body.parent1Id) {
      body.parent2Id = body.parent
    } else if (body.parent && body.parent2Id) {
      body.parent1Id = body.parent
    } else if (body.parent && !body.parent2Id && !body.parent2Id) {
      body.parent1Id = body.parent
    }
  }
}
