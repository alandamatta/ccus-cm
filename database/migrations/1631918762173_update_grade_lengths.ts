import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UpdateGradeLengths extends BaseSchema {
  protected tableName = 'students'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('grade')
    })
  }

  public async down() {}
}
