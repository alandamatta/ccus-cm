import $ from 'jquery'
import { handleAjaxFormSubmit } from './ajaxUtils'

function modal(id, onSave) {
  const modalElement = $(`#${id}`)
  modalElement.find('.close').on('click', () => closeModal(modalElement))
  const form = modalElement.find('form')
  form.on('submit', (event) => submitAjax(event, form, onSave))
}

function submitAjax(event, form, onSave) {
  event.preventDefault()
  handleAjaxFormSubmit(form, onSave)
}

function closeModal(modal) {
  modal.removeClass('is-active')
}

export { modal }
