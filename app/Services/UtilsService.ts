import { DateTime } from 'luxon'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UtilsService {
  public static today(ctx: HttpContextContract) {
    const body = ctx.request.qs()
    const date = body.date || ctx.session.get('today')
    return this.formatToDateTime(date)
  }
  public static formatToDateTime(date: string): DateTime {
    return DateTime.fromFormat(date, 'yyyy-MM-dd')
  }
  public static formatDateToString(date: DateTime) {
    return date.toFormat('yyyy-MM-dd')
  }
}
