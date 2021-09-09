import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Courses extends BaseSchema {
  protected tableName = 'courses'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.renameColumn('duration', 'time')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {})
  }
}
