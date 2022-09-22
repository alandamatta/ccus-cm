import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import ChildEnrollmentRequestValidator from "App/Validators/ChildEnrollmentRequestValidator";

export default class ChildEnrollmentController {
  public async enroll({ request, response }: HttpContextContract) {
    const body = request.body()
    Logger.info('enrollChild body %o', body)
    try {
      await request.validate(ChildEnrollmentRequestValidator)
      response.ok({})
    } catch (error) {
      response.badRequest(error.messages)
    }
  }
}
