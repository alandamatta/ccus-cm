import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DisabledAtFixTries extends BaseSchema {
  protected tableName = 'disabled_at_fix_tries'

  public async up() {
    this.schema.table('courses', (table) => {
      table.dropColumn('deleted_at')
    })
    this.schema.table('locations', (table) => {
      table.dropColumn('deleted_at')
    })
    this.schema.table('users', (table) => {
      table.dropColumn('deleted_at')
    })
    this.schema.table('parents', (table) => {
      table.dropColumn('deleted_at')
    })
    this.schema.table('courses', (table) => {
      table.timestamp('deleted_at')
    })
    this.schema.table('locations', (table) => {
      table.timestamp('deleted_at')
    })
    this.schema.table('users', (table) => {
      table.timestamp('deleted_at')
    })
    this.schema.table('parents', (table) => {
      table.timestamp('deleted_at')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
