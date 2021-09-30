import $ from 'jquery'

$('.checkInButton').on('click', function (event) {
  event.preventDefault()
  const element = $(this)
  const form = element.closest('form')
  const date = $('#date').val()
  const now = new Date()
  const time = `${now.getHours()}:${now.getMinutes()}`
  form.find('[name=time]').val(date + ' ' + time)
  $(this).addClass('is-loading')
  $('button').attr('disabled', 'disable')
  form.submit()
})

$('.cancelCheckInButton').on('click', function (event) {
  const element = $(this)
  element.find('span').addClass('is-hidden')
  $('button').attr('disabled', 'disable')
  element.addClass('is-loading')
})
