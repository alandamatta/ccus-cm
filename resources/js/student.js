import $ from 'jquery'
import { uiValidationHelper, uiValidationClean, clearAllInputs } from './ui-utils'
import { toast, setDefaults } from 'bulma-toast'
import { modal } from './modal'
import { prepareSelect } from './components/select'
import { ajaxGet, ajaxRequest } from './ajaxUtils'

const studentForm = $('#saveStudentForm')
const submitStudentMobile = $('#submitStudentMobile')
const dateOfBirth = studentForm.find('.dateOfBirth')
const parentsModal = 'parentsModal'
setFocusOutEventForAgeCalculationOnDOBInput()
toastSettings()
handleStudentFormSubmitEventToPerformAnAjaxCall()

window.cleanAll = () => {
  studentForm.find('input').val('')
  studentForm.find('select').val('')
  studentForm.find('textarea').val('')
  submitStudentMobile.find('input').val('')
  submitStudentMobile.find('select').val('')
  submitStudentMobile.find('textarea').val('')
  $('.contactsSection').html('')
}

window.editContact = function (contact) {
  const modalElement = $(`#${parentsModal}`)
  const inputs = ['id', 'name', 'address', 'phone', 'email', 'locationId']
  for (const input of inputs) {
    modalElement.find(`#${input}`).val($(`#parent${contact}${input}`).val())
  }
  modalElement.addClass('is-active')
  loadLocations()
}

modal(parentsModal, function (data) {
  const modalElement = $(`#${parentsModal}`)
  const clazz = `.parent${data.id}card`
  $(clazz).val(data.id)
  const parentName = findCorrectParentInput()
  const card = $(`.parent${data.id}card`)
  if (card.val()) {
    card.replaceWith(contactHTML(data, false))
  } else {
    $('.contactsSection').append(contactHTML(data, true))
  }
  modalElement.removeClass('is-active')
  clearAllInputs(modalElement)
})

$('.pictureInput').each(function (index, element) {
  const fileInput = $(element)
  fileInput.on('change', function () {
    const input = $(this)
    if (input[0] && input[0].files[0]) {
      let reader = new FileReader()
      reader.onload = function (event) {
        $('.currentImg').attr('src', event.target.result)
      }
      reader.readAsDataURL(input[0].files[0])
    }
  })
})

window.addContact = function () {
  const modalElement = $(`#${parentsModal}`)
  modalElement.addClass('is-active')
  loadLocations()
}

function findCorrectParentInput() {
  const parent1 = $('.parent1')
  const parent2 = $('.parent2')
  if (parent1 && parent1.val() && parent1.val() > 0) {
    return 'parent2'
  }
  return 'parent1'
}

function includeValidationMessageIntoHelpElements(errors) {
  uiValidationHelper(studentForm, errors)
  uiValidationHelper(submitStudentMobile, errors)
}

function loadLocations() {
  const select = $(`#${parentsModal}`).find('#locationId')
  ajaxGet('/parent/setup', function (data) {
    prepareSelect(select, data.locations)
  })
}

function handleStudentFormSubmitEventToPerformAnAjaxCall() {
  studentForm.on('submit', (event) => studentFormSubmit(event, studentForm))
  submitStudentMobile.on('submit', (event) => studentFormSubmit(event, submitStudentMobile))
}

function studentFormSubmit(event, studentForm) {
  event.preventDefault()
  uiValidationClean(studentForm)
  const formData = new FormData(document.getElementById(studentForm.attr('id')))
  const file = studentForm.find('#file').val()
  formData.append('file', file)
  studentForm.find('.button').addClass('is-loading')
  const config = {
    url: '/student/save',
    type: 'POST',
    data: formData,
    enctype: 'multipart/form-data',
    processData: false,
    contentType: false,
  }

  const onDone = (data) => {
    toast({
      message:
        '<span class="icon"> <i class="far fa-check-circle"></i></span> Data saved successfully!',
      type: 'is-success',
    })
    document.location.reload()
  }

  const onFail = (data) => {
    studentForm.find('button').removeClass('is-loading')
    includeValidationMessageIntoHelpElements(data.responseJSON.errors)
  }

  ajaxRequest(config, onDone, onFail)
}

function toastSettings() {
  setDefaults({
    duration: 3000,
    position: 'top-center',
    type: 'is-success',
  })
}

function setFocusOutEventForAgeCalculationOnDOBInput() {
  $('.dateOfBirth').on('focusout', function (event) {
    const today = new Date()
    const dob = new Date($(this).val())
    let year = today.getYear() - dob.getYear()
    let month = today.getMonth() - dob.getMonth()
    if (month < 0) {
      month *= -1
      year -= 1
      month = 12 - month
    }
    if (!isNaN(year)) {
      const result = `${year}y${month}m`
      $('.age').val(result)
    }
  })
}

function contactHTML(contact, newContact) {
  let html = `
    <div class="column is-half parent${contact.id}card parentContactCard" ${newContact ? "attr-new='true'" : ""}">
      <input type="hidden" name="parent" value="${contact.id}">
      <input type="hidden" disabled id="parent${contact.id}id" value="${contact.id}">
      <input type="hidden" disabled id="parent${contact.id}name" value="${contact.name}">
      <input type="hidden" disabled id="parent${contact.id}phone" value="${contact.phone}">
      <input type="hidden" disabled id="parent${contact.id}email" value="${contact.email}">
      <input type="hidden" disabled id="parent${contact.id}address" value="${contact.address}">
      <input type="hidden" disabled id="parent${contact.id}locationId" value="${contact.locationId}">
      <div class="notification">
        <div class="columns no-padding-bottom">
          <div class="column">
            <p class="title is-5">${contact.name}</p>
          </div>
        </div>

        <div class="columns no-padding-bottom no-padding-top">
          <div class="column  no-padding-bottom">
            <span class="icon"><i class="fas fa-phone-alt"></i></span><span
            class="is-size-6">${contact.phone}</span>
          </div>
        </div>

        <div class="columns no-padding-bottom no-padding-top">
          <div class="column  no-padding-bottom">
            <span class="icon"><i class="fas fa-envelope"></i></span><span
            class="is-size-6">${contact.email}</span>
          </div>
        </div>

        <div class="columns no-padding-bottom no-padding-top">
          <div class="column  no-padding-bottom">
            <span class="icon"><i class="fas fa-map-marker-alt"></i></span><span class="is-size-6">${contact.address}</span>
          </div>
        </div>

        <div class="columns">
          <div class="column">
            <button type="button" class="button is-small is-info is-outlined" onclick="editContact(${contact.id})">Edit</button>
          </div>
        </div>
      </div>
    </div>
  `
  return html
}
