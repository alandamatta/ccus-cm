import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersCourses extends BaseSchema {
  protected tableName = 'students_courses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('student_id').unsigned().references('students.id')
      table.integer('course_id').unsigned().references('courses.id')
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('disabled_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
