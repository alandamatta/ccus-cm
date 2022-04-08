import { DateTime } from 'luxon'
import {
  BaseModel,
  belongsTo,
  BelongsTo,
  column,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
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

  @column()
  public parent1Id: number

  @belongsTo(() => Parent)
  public parent2: BelongsTo<typeof Parent>

  @column()
  public parent2Id: number

  @belongsTo(() => Location)
  public location: BelongsTo<typeof Location>

  @column()
  public locationId: number

  @belongsTo(() => Course)
  public course: BelongsTo<typeof Course>

  @column()
  public courseId: number

  @manyToMany(() => Course, {
    pivotTable: 'students_courses',
    pivotTimestamps: true,
    pivotColumns: ['disabled_at'],
  })
  public courses: ManyToMany<typeof Course>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public disabledAt: DateTime

  public getAge(): string {
    const today = new DateTime()
    const thisYear = today.year
    const thisMonth = today.month
    const dobYear = this.dateOfBirth.year
    const dobMonth = this.dateOfBirth.month
    let year = thisYear - dobYear
    let month = thisMonth - dobMonth
    if (month < 0) {
      month *= -1
      year -= 1
      month = 12 - month
    }
    let result = '?'
    if (!isNaN(year)) {
      result = `${year}y${month}m`
    }
    return result
  }
}
