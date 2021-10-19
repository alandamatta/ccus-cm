import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DisabledAtForStudentTables extends BaseSchema {
  protected tableName = 'students'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('disabled_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('disabled_at')
    })
  }
}
