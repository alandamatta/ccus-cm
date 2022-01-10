import Database from '@ioc:Adonis/Lucid/Database'
import UsersList from 'App/Queries/UsersList'
import User from 'App/Models/User'

export default class UsersService {
  public async findAllUsers() {
    const users = await Database.rawQuery(UsersList())
    return users[0]
  }
  public findByKey(key: string) {
    return User.findBy('key', key)
  }
  public async setPassword(key: string, password: string) {
    const user = await this.findByKey(key)
    if (user) {
      await user.merge({ password }).save()
    }
  }
}
