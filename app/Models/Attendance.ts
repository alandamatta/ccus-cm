import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Location from 'App/Models/Location'
import Course from 'App/Models/Course'
import Student from 'App/Models/Student'

export default class Attendance extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public time: DateTime

  @belongsTo(() => Location)
  public location: BelongsTo<typeof Location>

  @column()
  public locationId: number

  @belongsTo(() => Course)
  public course: BelongsTo<typeof Course>

  @column()
  public courseId: number

  @belongsTo(() => Student)
  public student: BelongsTo<typeof Student>

  @column()
  public studentId: number

  @column() //true=checking in | false=checking out
  public checkIn: boolean

  @column()
  public active: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
