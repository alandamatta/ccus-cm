import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Location from 'App/Models/Location'

export default class Parent extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public address: string

  @column()
  public email: string

  @column()
  public phone: string

  @column()
  public active: boolean

  @belongsTo(() => Location)
  public location: BelongsTo<typeof Location>

  /**
   * @deprecated locationId should not be set for parent
   */
  @column()
  public locationId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime
}
