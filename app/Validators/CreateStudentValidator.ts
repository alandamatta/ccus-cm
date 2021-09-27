import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { msg } from 'App/Messages/Message'

export default class CreateStudentValidator {
  constructor(protected ctx: HttpContextContract) {}
  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    fullName: schema.string({ trim: true }),
    dateOfBirth: schema.date({}, [rules.before('today')]),
    courseId: schema.number(),
    grade: schema.string({}, [rules.maxLength(2)]),
    notes: schema.string.optional({}, [rules.maxLength(255)]),
    file: schema.file.optional({
      size: '2mb',
      extnames: ['pdf', 'doc', 'txt'],
    }),
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
    'fullName.required': msg.required,
    'dateOfBirth.required': msg.required,
    'dateOfBirth.before': msg.invalid,
    'courseId.required': msg.required,
    'grade.required': msg.required,
    'grade.maxLength': msg.invalid,
    'file.extname': 'Only pdf, doc and txt are allowed',
    'file.required': msg.required,
  }
}
