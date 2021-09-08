import '../css/bulma.css'
import $ from 'jquery'
import { toast, setDefaults } from 'bulma-toast'
import list from 'list.js'

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

$('.hide-in-5').delay(3200).fadeOut(300)
window.$ = $
window.toast = toast
