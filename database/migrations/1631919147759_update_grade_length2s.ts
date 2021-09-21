import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UpdateGradeLength2s extends BaseSchema {
  protected tableName = 'students'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('grade', 2)
    })
  }
  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
