import Database from '@ioc:Adonis/Lucid/Database'
import UsersList from 'App/Queries/UsersList'

export default class UsersService {
  public async findAllUsers() {
    const users = await Database.rawQuery(UsersList())
    return users[0]
  }
}
