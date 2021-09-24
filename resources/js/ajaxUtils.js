import $ from 'jquery'
import { uiValidationClean, uiValidationHelper } from './ui-utils'
import { infoToast } from './toastUtils'

function handleAjaxFormSubmit(form, onDone, onFail) {
  let formData = form.serialize()
  uiValidationClean(form)
  $.post(form.attr('action'), formData)
    .done((data) => {
      onDone ? onDone(data) : false
      infoToast('Data saved successfully!')
    })
    .fail((data) => {
      onFail ? onFail(data) : false
      uiValidationHelper(form, data.responseJSON.errors)
    })
}

function ajaxPost(url, data, onDone, onFail) {
  $.post(url)
    .done((data) => {
      onDone(data)
    })
    .fail((data) => {
      onFail(data)
    })
}

function ajaxGet(url, onDone, onFail) {
  $.get(url)
    .done((data) => {
      onDone(data)
    })
    .fail((data) => {
      onFail(data)
    })
}

export { handleAjaxFormSubmit, ajaxPost, ajaxGet }
