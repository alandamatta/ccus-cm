import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'

export default class ChildEnrollmentController {
  public async enroll({ request, response }: HttpContextContract) {
    const body = request.body()
    Logger.info('enrollChild body %o', body)
    response.status(201)
    return response.send({})
  }
}
