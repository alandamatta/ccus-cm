import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Students extends BaseSchema {
  protected tableName = 'students'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.varchar('full_name', 60)
      table.date('date_of_birth')
      table.varchar('grade', 1)
      table.integer('parent1_id').unsigned().references('parents.id')
      table.integer('parent2_id').unsigned().references('parents.id')
      table.integer('location_id').unsigned().references('locations.id')
      table.integer('course_id').unsigned().references('courses.id')
      table.string('notes', 255)
      table.text('picture')
      table.text('file')
      table.boolean('active').defaultTo(true)

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
