import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Parents extends BaseSchema {
  protected tableName = 'parents'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 60)
      table.string('address', 80)
      table.string('phone', 12)
      table.string('email', 255)
      table.boolean('active').defaultTo(true)
      table.integer('location_id').unsigned().references('locations.id')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
