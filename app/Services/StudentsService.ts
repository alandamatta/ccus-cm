import Student from '../Models/Student'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateStudentValidator from 'App/Validators/CreateStudentValidator'
import Course from 'App/Models/Course'
import { DateTime } from 'luxon'
import PhotoService from 'App/Services/PhotoService'
import StudentByIdAndLocation from 'App/Queries/StudentByIdAndLocation'
import Database from '@ioc:Adonis/Lucid/Database'
import Env from '@ioc:Adonis/Core/Env'
import FindStudentByCourseId from 'App/Queries/FindStudentByCourseId'
import User from 'App/Models/User'
import SearchStudents from 'App/Queries/SearchStudents'
import SearchStudentsCount from 'App/Queries/SearchStudentsCount'

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
        student.locationId = user.locationId
        if (picture) {
          // @ts-ignore
          body.picture = await StudentsService.pictureUpload(ctx)
        }
        if (file) {
          // @ts-ignore
          body.file = await StudentsService.fileUpload(ctx)
        }
        delete body.createdAt
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
      const course = await Course.findOrFail(student.courseId)
      student.locationId = user.locationId
      // @ts-ignore
      student.picture = await StudentsService.pictureUpload(ctx)
      // @ts-ignore
      student.file = await StudentsService.fileUpload(ctx)
      student.locationId = user.locationId
      const savedStudent = await student.save()
      savedStudent.related('courses').save(course)
      return savedStudent
    }
  }

  private static async pictureUpload(ctx: HttpContextContract) {
    const picture = ctx.request.file('picture')
    if (picture) {
      const tempPath = Env.get('UPLOAD_ROOT') + '/pictures'
      picture.clientName = StudentsService.generateFileName(picture).replace(/\s/g, '')
      await picture.moveToDisk(tempPath, { name: picture.clientName })
      const photoPath = StudentsService.file(tempPath, picture.clientName)
      await photoService.compressImage(photoPath)
      return picture.clientName
    }
    return null
  }

  private static async fileUpload(ctx: HttpContextContract) {
    const file = ctx.request.file('file')
    if (file) {
      const tempPath = Env.get('UPLOAD_ROOT') + '/files'
      file.clientName = StudentsService.generateFileName(file).replace(/\s/g, '')
      await file.moveToDisk(tempPath, { name: file.clientName })
      return file.clientName
    }
    return null
  }

  public static async defaultViewProps(user) {
    let courses = await Course.query()
      .where('location_id', user.locationId)
      .andWhereNull('deleted_at')
    const coursesView = courses.map((e) => {
      return {
        label: e.name,
        value: e.id,
      }
    })
    let grades = StudentsService.grades()
    const qs = {
      page: 1,
      search: '',
      status: 1,
    }
    const { data, meta } = await StudentsService.studentsPaginated(qs, user)
    return { coursesView, grades, students: data, meta }
  }

  public static async studentsPaginated(qs: any, user: User) {
    const limit = 5
    const { page = 1, search = '', status = '', courseId = -1 } = qs
    const offset = limit * (page - 1)
    const params = {
      search,
      locationId: user.locationId,
      inactive: false,
      limit,
      offset,
      status,
      courseId,
    }
    const total = await Database.rawQuery(SearchStudentsCount(), params)
    const result = await Database.rawQuery(SearchStudents(), params)
    const data = result[0]
    const meta = {
      total: total[0][0].total,
      per_page: limit,
      current_page: Number(page),
      last_page: Math.ceil(total[0][0].total / limit),
      first_page: 1,
    }
    return { data, meta }
  }

  public async findByIdAndLocationId(locationId, studentId, admin) {
    const result = await Database.rawQuery(StudentByIdAndLocation(), {
      locationId,
      studentId,
      admin,
    })
    return result[0][0]
  }
  public inactivateById(id: number) {
    return Database.rawQuery('UPDATE students SET disabled_at = NOW() WHERE id = :id', { id })
  }
  public reactivateById(id: number) {
    return Database.rawQuery('UPDATE students SET disabled_at = NULL WHERE id = :id', { id })
  }
  public async findByCourseId(courseId: number) {
    const result = await Database.rawQuery(FindStudentByCourseId(), { courseId })
    return result[0]
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
