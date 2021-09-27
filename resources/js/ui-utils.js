export { uiValidationHelper, uiValidationClean, clearAllInputs }

const uiValidationHelper = (formElement, errors) => {
  let input
  let select
  for (let error of errors) {
    formElement.find(helperId(error.field)).text(error.message)
    input = formElement.find(`#${error.field}`)
    input.addClass('is-danger')
    input.parent().addClass('is-danger')
    input.parent().addClass('has-icons-left')
    input.parent().parent().addClass('has-icons-left')
    formElement.find(helperIconId(error.field)).removeClass('is-hidden')
  }
}

const uiValidationClean = (formElement) => {
  let input
  formElement.find('input.is-danger').each((index, element) => {
    input = $(element)
    input.removeClass('is-danger')
    input.parent().removeClass('has-icons-left')
    formElement.find(helperIconId(element.id)).addClass('is-hidden')
    formElement.find(helperId(element.id)).text('')
  })
  formElement.find('select').each((index, element) => {
    input = $(element)
    input.parent().removeClass('is-danger')
    input.parent().parent().removeClass('has-icons-left')
    formElement.find(helperIconId(element.id)).addClass('is-hidden')
    formElement.find(helperId(element.id)).text('')
  })
}

function clearAllInputs(section) {
  section.find('select, textarea, input').each((index, element) => {
    element.value = null
  })
}

function helperId(field) {
  return `#${field}-help`
}

function helperIconId(field) {
  return `#${field}-help-icon`
}
