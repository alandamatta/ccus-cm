import Database from '@ioc:Adonis/Lucid/Database'
import studentListTimesheetQuery from 'App/Queries/stuentListTimesheet'

export default class TimesheetService {
  public studentsListTimesheet(user) {
    const locationId = user.locationId
    return Database.rawQuery(studentListTimesheetQuery(), [locationId])
  }
}
