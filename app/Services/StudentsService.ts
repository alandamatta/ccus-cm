import Student from '../Models/Student'

export default class StudentsService {
  public async create(requestBody: any) {
    await new Student().fill(requestBody, true).save()
  }
}
