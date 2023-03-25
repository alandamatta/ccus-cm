import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ImportStudentValidator from 'App/Validators/ImportStudentValidator'
import StudentsService from 'App/Services/StudentsService'
import Course from 'App/Models/Course'
import Parent from 'App/Models/Parent'
import Student from 'App/Models/Student'

export default class StudentBatchImportController {
  public async index(ctx: HttpContextContract) {
    await ctx.auth.authenticate()
    const coursesWithLocations = await Course.query().preload('location')
    // transform to DTO
    const courses = coursesWithLocations.map((course) => {
      return {
        key: `${course.name} in ${course.location.name} - ${course.location.state}`,
        value: course.id,
      }
    })
    return ctx.view.render('studentBatchImport', { courses })
  }
  public async viewImport({ response, request, view, auth, session }: HttpContextContract) {
    await auth.authenticate()
    await request.validate(ImportStudentValidator)
    const studentsService = new StudentsService()
    const file = request.file('file')
    let courses: number[] = Array.isArray(request.body().courses)
      ? request.body().courses
      : [request.body().courses]
    courses = courses.filter((e) => e)
    if (!courses || courses.length === 0) {
      session.flash('errors', ['At least one location is required'])
      return response.redirect('/studentBatchImport')
    }
    const students = await studentsService.xlsx2Entity(file, courses)
    return await view.render('studentBatchImport', { students })
  }

  public async import({ session, response, request }: HttpContextContract) {
    // save parents
    const studentObj = JSON.parse(request.body().json)
    try {
      for (let studentEl of studentObj) {
        let parentsIds: number[] = []
        for (let parent of studentEl.parents) {
          let savedParent = new Parent()
          savedParent.fill(parent)
          await savedParent.save()
          parentsIds.push(savedParent.id)
        }
        const student = new Student()
        student.fill({
          ...studentEl.student,
          parent1Id: parentsIds[0] || null,
          parent2Id: parentsIds[1] || null,
        })
        const savedStudent = await student.save()
        for (let studentCourseId of studentEl.courses) {
          const course = await Course.findOrFail(studentCourseId.id)
          await savedStudent.related('courses').save(course)
        }
      }
    } catch (e) {
      session.flash('errors', ['Sorry, we are not able to import from this file.'])
      return response.redirect('/studentBatchImport')
    }
    return response.redirect('/studentBatchImport')
  }
}
