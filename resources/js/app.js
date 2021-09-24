import '../css/bulma.css'
import $ from 'jquery'
import { setDefaults, toast } from 'bulma-toast'
import * as student from './student'

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

window.ajaxSaveStudent = () => {}
window.$ = $
window.toast = toast
