import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Location from 'App/Models/Location'

export default class Parent extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  public name: string

  public address: string

  public email: string

  public phone: string

  public active: boolean

  @belongsTo(() => Location)
  public location: BelongsTo<typeof Location>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
