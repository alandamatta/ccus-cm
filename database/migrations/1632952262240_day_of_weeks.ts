import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DayOfWeeks extends BaseSchema {
  protected tableName = 'day_of_week'

  private daysOfTheWeek = [
    { value: '7', label: 'Sunday' },
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' },
  ]

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('value')
      table.string('name', 20)
      table.string('locale')
    })

    this.defer(async (db) => {
      await Promise.all(
        this.daysOfTheWeek.map((element) => {
          return db.table(this.tableName).insert({ value: element.value, name: element.label })
        })
      )
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
