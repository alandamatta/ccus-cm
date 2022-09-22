import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { msg } from 'App/Messages/Message'

export default class ChildEnrollmentRequestValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    code: schema.string({ trim: true }),
    locationId: schema.number(),
    filler: schema.object().members({
      fullName: schema.string([rules.minLength(2), rules.maxLength(60)]),
      email: schema.string({}, [rules.email()]),
      addressLine1: schema.string.optional(),
      addressLine2: schema.string.optional(),
      phone1: schema.string(),
    }),
    contact: schema.object.optional().members({
      fullName: schema.string([rules.minLength(2), rules.maxLength(60)]),
      email: schema.string.optional({}, [rules.email()]),
      addressLine1: schema.string.optional(),
      addressLine2: schema.string.optional(),
      phone1: schema.string(),
    }),
    children: schema.array().members(
      schema.object().members({
        fullName: schema.string(),
        grade: schema.string(),
        dateOfBirth: schema.date({ format: 'YYYY-MM-dd' }),
        notes: schema.string.optional(),
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
  public messages = {
    'code.required': msg.required,
    'locationId.required': msg.required,
    'locationId.number': msg.invalid,
    'filler.fullName.required': msg.required,
    'filler.fullName.minLength': msg.max2Char,
    'filler.fullName.maxLength': msg.max60Char,
    'filler.email.required': msg.required,
    'filler.email.invalid': msg.invalid,
    'filler.phone1.required': msg.required,
    'contact.fullName.required': msg.required,
    'contact.fullName.minLength': msg.max2Char,
    'contact.fullName.maxLength': msg.max60Char,
    'contact.email.required': msg.required,
    'contact.email.invalid': msg.invalid,
    'contact.phone1.required': msg.required,
    'children.required': msg.required,
    'children.fullName.required': msg.required,
    'children.grade.required': msg.required,
    'children.dateOfBirth.required': msg.required,
    'children.dateOfBirth.invalid': msg.invalid,
  }
}
