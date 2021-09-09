import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Location from 'App/Models/Location'
import Course from 'App/Models/Course'
import Parent from 'App/Models/Parent'

export default class Student extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public fullName: string

  @column()
  public dateOfBirth: DateTime

  @column()
  public grade: string

  @column()
  public notes: string

  @column()
  public picture: string

  @column()
  public file: string

  @column()
  public active: boolean

  @belongsTo(() => Parent)
  public parent1: BelongsTo<typeof Parent>

  @belongsTo(() => Parent)
  public parent2: BelongsTo<typeof Parent>

  @belongsTo(() => Location)
  public location: BelongsTo<typeof Location>

  @belongsTo(() => Course)
  public course: BelongsTo<typeof Course>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
