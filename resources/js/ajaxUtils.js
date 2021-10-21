import $ from 'jquery'
import { uiValidationClean, uiValidationHelper } from './ui-utils'
import { infoToast } from './toastUtils'

function handleAjaxFormSubmit(form, onDone, onFail) {
  let formData = form.serialize()
  uiValidationClean(form)
  $.post(form.attr('action'), formData)
    .done((data) => {
      onDone ? onDone(data) : false
    })
    .fail((data) => {
      onFail ? onFail(data) : false
      uiValidationHelper(form, data.responseJSON.errors)
    })
}

function ajaxRequest(config, onDone, onFail) {
  /*CONFIG
  {
    url: 'the/url',
    type: "POST",
    data: data,
    enctype: 'multipart/form-data',
    processData: false,
    contentType: false
  }
   */
  $.ajax(config).done(onDone).fail(onFail)
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

export { handleAjaxFormSubmit, ajaxPost, ajaxGet, ajaxRequest }
