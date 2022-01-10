import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { msg } from 'App/Messages/Message'

export default class UserActivationValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.exists({
        table: 'users',
        column: 'email',
        where: {
          key: this.ctx.request.body().key,
        },
      }),
    ]),
    password: schema.string({}, [rules.confirmed('confirmPassword'), rules.minLength(8)]),
    confirmPassword: schema.string({}, [rules.minLength(8)]),
  })

  public messages = {
    'email.required': msg.required,
    'email.email': msg.invalid,
    'email.exists': msg.invalid,
    'password.confirmed': msg.passwordsDontMatch,
    'password.required': msg.required,
    'password.minLength': msg.min8Char,
    'confirmPassword.required': msg.required,
    'confirmPassword.confirmed': msg.passwordsDontMatch,
    'confirmPassword.minLength': msg.min8Char,
  }
}
