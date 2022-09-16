import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ChildEnrollmentRequestValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    code: schema.string({ trim: true }),
    locationId: schema.number(),
    filler: schema.object().members({
      firstName: schema.string(),
      lastName: schema.string(),
      middleName: schema.string.optional(),
      email: schema.string({}, [rules.email()]),
      addressLine1: schema.string.optional(),
      addressLine2: schema.string.optional(),
      phone1: schema.string(),
    }),
    contact: schema.object.optional().members({
      firstName: schema.string(),
      lastName: schema.string(),
      middleName: schema.string.optional(),
      email: schema.string.optional({}, [rules.email()]),
      addressLine1: schema.string(),
      addressLine2: schema.string.optional(),
      phone1: schema.string(),
    }),
    children: schema.array().members(
      schema.object().members({
        firstName: schema.string(),
        lastName: schema.string(),
        middleName: schema.string.optional(),
        grade: schema.string(),
        dateOfBirth: schema.date({ format: 'YYYY-MM-dd' }),
        notes: schema.string(),
      })
    ),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {}
}
