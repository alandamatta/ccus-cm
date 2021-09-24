import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Attendances extends BaseSchema {
  protected tableName = 'attendances'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamp('time', { useTz: true })
      table.boolean('checkIn')
      table.boolean('active').defaultTo(true)
      table.integer('location_id').unsigned().references('locations.id')
      table.integer('course_id').unsigned().references('courses.id')
      table.integer('student_id').unsigned().references('students.id')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
