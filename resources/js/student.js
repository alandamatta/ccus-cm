import $ from 'jquery'
import { uiValidationHelper, uiValidationClean, clearAllInputs } from './ui-utils'
import { toast, setDefaults } from 'bulma-toast'
import { modal } from './modal'
import { prepareSelect } from './components/select'
import { ajaxGet, ajaxRequest } from './ajaxUtils'

const studentForm = $('#saveStudentForm')
const dateOfBirth = studentForm.find('#dateOfBirth')
const modalId = 'parentsModal'
setFocusOutEventForAgeCalculationOnDOBInput()
toastSettings()
handleStudentFormSubmitEventToPerformAnAjaxCall()

modal(modalId, function (data) {
  const modalElement = $(`#${modalId}`)
  findCorrectParentInput().val(data.id)
  $('#contactsSection').append(contactHTML(data))
  modalElement.removeClass('is-active')
  clearAllInputs(modalElement)
})

window.addContact = function () {
  const modalElement = $(`#${modalId}`)
  modalElement.addClass('is-active')
  loadLocations()
}

function findCorrectParentInput() {
  const parent1 = $('#parent1')
  const parent2 = $('#parent2')
  if (parent1 && parent1.val() && parent1.val() > 0) {
    return parent2
  }
  return parent1
}

function includeValidationMessageIntoHelpElements(errors) {
  uiValidationHelper(studentForm, errors)
}

function loadLocations() {
  const select = $(`#${modalId}`).find('#locationId')
  ajaxGet('/parent/setup', function (data) {
    prepareSelect(select, data.locations)
  })
}

function handleStudentFormSubmitEventToPerformAnAjaxCall() {
  studentForm.on('submit', (event) => {
    event.preventDefault()
    uiValidationClean(studentForm)
    const formData = new FormData(document.getElementById('saveStudentForm'))
    const file = document.getElementById('file').value
    formData.append('file', file)
    const config = {
      url: '/student/save',
      type: 'POST',
      data: formData,
      enctype: 'multipart/form-data',
      processData: false,
      contentType: false,
    }

    const onDone = (data) => {
      clearAllInputs(studentForm)
      toast({
        message:
          '<span class="icon"> <i class="far fa-check-circle"></i></span> Data saved successfully!',
        type: 'is-success',
      })
    }

    const onFail = (data) => {
      includeValidationMessageIntoHelpElements(data.responseJSON.errors)
    }

    ajaxRequest(config, onDone, onFail)
  })
}

function toastSettings() {
  setDefaults({
    duration: 3000,
    position: 'top-center',
    type: 'is-success',
  })
}

function setFocusOutEventForAgeCalculationOnDOBInput() {
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
}

function contactHTML(contact) {
  let html = `
    <div class="column is-half">
      <div class="notification">
        <div class="columns">
          <div class="column">
            <p class="title is-5">${contact.name}</p>
          </div>
        </div>

        <div class="columns">
          <div class="column">
            <span class="icon"><i class="fas fa-phone-alt"></i></span><span
            class="is-size-6">${contact.phone}</span>
          </div>
        </div>

        <div class="columns">
          <div class="column">
            <span class="icon"><i class="fas fa-envelope"></i></span><span
            class="is-size-6">${contact.email}</span>
          </div>
        </div>

        <div class="columns">
          <div class="column">
            <span class="icon"><i class="fas fa-map-marker-alt"></i></span><span class="is-size-6">${contact.address}</span>
          </div>
        </div>
      </div>
    </div>
  `
  return html
}
