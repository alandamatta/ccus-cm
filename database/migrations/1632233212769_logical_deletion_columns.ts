import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class LogicalDeletionColumns extends BaseSchema {
  public async up() {
    this.schema.table('courses', (table) => {
      table.timestamp('deleted_at', { useTz: true })
    })
    this.schema.table('locations', (table) => {
      table.timestamp('deleted_at', { useTz: true })
    })
    this.schema.table('users', (table) => {
      table.timestamp('deleted_at', { useTz: true })
    })
    this.schema.table('parents', (table) => {
      table.timestamp('deleted_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.table('courses', function (table) {
      table.dropColumn('deleted_at')
    })
    this.schema.table('locations', function (table) {
      table.dropColumn('deleted_at')
    })
    this.schema.table('users', function (table) {
      table.dropColumn('deleted_at')
    })
  }
}
