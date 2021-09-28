import $ from 'jquery'
import { generateTimesheetTable } from './components/timesheetTable'
import { ajaxGet } from './ajaxUtils'

$('.checkInButton').on('click', function (event) {
  // event.preventDefault()
  $(this).addClass('is-loading')
})

$('.cancelCheckInButton').on('click', function (event) {
  // event.preventDefault()
  const element = $(this)
  element.find('span').addClass('is-hidden')
  element.addClass('is-loading')
})
