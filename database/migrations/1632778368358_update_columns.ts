import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UpdateColumns extends BaseSchema {
  protected tableName = 'attendances'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.renameColumn('checkIn', 'check_in')
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.renameColumn('check_in', 'checkIn')
    })
  }
}
