import Mail from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'

const NOTIFICATION_MESSAGE = 'Christian Congregation in the US - CCUSCM app Notification'

export default class EmailService {
  public sendUserActivation(user: User) {
    const link = `${Env.get('APP_DOMAIN')}/activate/${user.key}`
    const view = {
      props: {
        name: user.name,
        activationLink: link,
        createdAt: user.createdAt,
      },
      name: 'emails/create_account',
    }
    return this.send(user.email, NOTIFICATION_MESSAGE, view)
  }
  public send(email: string, subject: string, view: any) {
    return Mail.use('smtp').send((message) => {
      message
        .to(email)
        .from('ccuscmapp.notify@gmail.com')
        .subject(subject)
        .htmlView(view.name, view.props)
    })
  }
}
