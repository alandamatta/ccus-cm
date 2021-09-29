import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { msg } from 'App/Messages/Message'

export default class LocationValidator {
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
    name: schema.string({}, [rules.maxLength(60)]),
    city: schema.string({}, [rules.maxLength(60)]),
    state: schema.string({}, [rules.maxLength(2)]),
    zip: schema.string({ trim: true }),
    course: schema.array.optional().members(
      schema.object().members({
        name: schema.string({ trim: true }, [rules.maxLength(60)]),
        dayOfWeek: schema.string({ trim: true }),
        time: schema.date({ format: 'HH:mm' }),
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
    'name.required': msg.required,
    'name.maxLength': msg.max60Char,
    'city.required': msg.required,
    'city.maxLength': msg.max60Char,
    'state.required': msg.required,
    'state.maxLength': msg.max2Char,
    'zip.required': msg.required,
    'course.*.name.required': msg.required,
    'course.*.name.maxLength': msg.max60Char,
    'course.*.dayOfWeek.required': msg.required,
    'course.*.time.required': msg.required,
  }
}
