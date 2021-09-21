import $ from 'jquery'
import { uiValidationHelper, uiValidationClean, clearAllInputs } from './ui-utils'
import { toast, setDefaults } from 'bulma-toast'

setDefaults({
  duration: 3000,
  position: 'top-center',
})

const studentForm = $('#savePatientForm')
const dateOfBirth = studentForm.find('#dateOfBirth')

studentForm.on('submit', (event) => {
  event.preventDefault()
  let formData = studentForm.serialize()
  uiValidationClean(studentForm)
  $.post('/student/save', formData)
    .done((data) => {
      clearAllInputs()
      toast({
        message: '<span class="icon"> <i class="far fa-check-circle"></i></span> Data saved successfully!',
        type: 'is-success',
      })
    })
    .fail((data) => {
      includeValidationMessageIntoHelpElements(data.responseJSON.errors)
    })
})

function includeValidationMessageIntoHelpElements(errors) {
  uiValidationHelper(studentForm, errors)
}

dateOfBirth.on('focusout', (event) => {
  const today = new Date()
  const dob = new Date(dateOfBirth.val())
  let year = today.getYear() - dob.getYear()
  let month = today.getMonth() - dob.getMonth()
  if (month < 0) {
    month *= -1
    year -= 1
    month = 12 - month
  }
  if (!isNaN(year)) {
    const result = `${year}y${month}m`
    $('#age').val(result)
  }
})
