import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { msg } from 'App/Messages/Message'

export default class ParentValidator {
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
    name: schema.string({ trim: true }, [rules.maxLength(60)]),
    address: schema.string({ trim: true }, [rules.maxLength(80)]),
    phone: schema.number(),
    email: schema.string({ trim: true }, [
      rules.maxLength(255),
      rules.email(),
      rules.unique({
        table: 'parents',
        column: 'email',
        whereNot: { id: this.ctx.request.body().id },
      }),
    ]),
    locationId: schema.number(),
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
    'address.required': msg.required,
    'address.maxLength': msg.max60Char,
    'phone.required': msg.required,
    'phone.maxLength': msg.invalid,
    'phone.number': msg.invalid,
    'email.required': msg.required,
    'email.maxLength': '',
    'email.email': msg.invalid,
    'email.unique': msg.notUnique,
    'locationId.required': msg.required,
  }
}
