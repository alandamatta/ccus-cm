import '../css/bulma.css'
import '../css/bulma-quickview.min.css'
import $ from 'jquery'
import * as bqv from './bulma-quickview.min'
import { setDefaults, toast } from 'bulma-toast'
import * as student from './student'
import * as timesheet from './timesheet'

bqv.attach()

$("input[type='file']").on('change', function() {
  const input = $(this)
  const id = input.attr('id')
  const files = input.prop('files')
  if (files && files.length > 0) {
    $('._' + id + '-label').text(files[0].name)
  }
})
setDefaults({
  duration: 3000,
  position: 'top-center',
})
window.addCourse = function (element) {
  const el = $(element)
  const form = $(el.closest('form'))
  form.attr('action', '/location/create/addTempCourse')
  form.submit()
}

window.removeCourse = function (element, index) {
  const el = $(element)
  const form = $(el.closest('form'))
  form.attr('action', `/location/create/removeTempCourse/${index}`)
  form.submit()
}

const delayKeyUp = (() => {
  let timer = null
  const delay = (func, ms) => {
    timer ? clearTimeout(timer) : null
    timer = setTimeout(func, ms)
  }
  return delay
})()

$('.search').on('keyup', function () {
  const element = $(this)
  const form = $(element.closest('form'))
  delayKeyUp(() => {
    form.submit()
  }, 500)
})

$('.datatableDelete').on('click', function () {
  return confirm('Are you sure?')
})

window.delay = delayKeyUp
window.ajaxSaveStudent = () => {}
window.$ = $
window.toast = toast
