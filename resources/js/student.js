import $ from 'jquery'

const studentForm = $('#savePatientForm')

studentForm.on('submit', (event) => {
  event.preventDefault()
  let formData = studentForm.serialize()
  $.post('/student/save', formData)
    .done((data) => {
      console.log('done')
    })
    .fail((data) => {
      console.log('fail')
      console.log(data.responseJSON.errors)
    })
})

