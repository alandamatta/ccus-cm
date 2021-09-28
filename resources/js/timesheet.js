import $ from 'jquery'
import { generateTimesheetTable } from './components/timesheetTable'
import { ajaxGet } from './ajaxUtils'
import { DateTime } from 'luxon'

$('.checkInButton').on('click', function (event) {
  event.preventDefault()
  const element = $(this)
  const form = element.closest('form')
  form.find('[name=time]').val(DateTime.now())
  $(this).addClass('is-loading')
  form.submit()
})

$('.cancelCheckInButton').on('click', function (event) {
  const element = $(this)
  element.find('span').addClass('is-hidden')
  element.addClass('is-loading')
})
