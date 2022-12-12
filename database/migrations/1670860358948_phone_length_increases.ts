import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.raw(`ALTER TABLE ${this.tableName} MODIFY phone varchar(20)`)
  }

  public async down() {
    this.schema.raw(`ALTER TABLE ${this.tableName} MODIFY phone varchar(2)`)
  }
}
