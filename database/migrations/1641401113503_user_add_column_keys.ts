import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserAddColumnKeys extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('key', 50)
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('key')
    })
  }
}
