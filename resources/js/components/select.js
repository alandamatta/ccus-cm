function prepareSelect(select, values) {
  let html = ''
  select.attr('disabled', !values && values.length > 0)
  for (const value of values) {
    html += option(value['value'], value['label'], value['default'])
  }
  select.html(html)
}

function option(value, label, selected) {
  return `
    <option ${selected ? 'selected' : ''} value="${value}">${label}</option>
  `
}

export { prepareSelect }
