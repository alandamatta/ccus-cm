export { generateTimesheetTable }

function generateTimesheetTable(metadata) {
  const elements = metadata.elements
  let timesheet = header()
  for (const element of elements) {
    timesheet += html(element)
  }
  return timesheet
}

function header() {
  return `
    <div class="box no-shadow is-hidden-mobile transparent">
      <div class="columns">
        <div class="column is-4 no-padding-bottom">
          <div class="columns is-mobile">
            <div class="column is-1-desktop is-narrow no-padding-bottom">
              <input type="checkbox">
            </div>
            <div class="column no-padding-bottom">
              <div class="content has-text-weight-bold">
                <p>Student</p>
              </div>
            </div>
          </div>
        </div>

        <div class="column no-padding-bottom">
          <div class="content has-text-weight-bold">
            <p>Notes</p>
          </div>
        </div>
        <div class="column no-padding-bottom">
          <div class="columns is-4">
            <div class="column is-half-desktop no-padding-bottom">
              <div class="content has-text-weight-bold">
                <p>Time In</p>
              </div>
            </div>
            <div class="column is-half-desktop no-padding-bottom">
              <div class="content has-text-weight-bold">
                <p>Time Out</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

function html(element) {
  return `
    <div class="box closer-box">
      <div class="columns is-vcentered">
        <div class="column is-4">
          <div class="columns is-vcentered is-mobile">
            <div class="column is-1-desktop is-narrow">
              <input type="checkbox">
            </div>
            <div class="column">
              <div class="columns is-mobile">
                <div class="column is-narrow">
                  <figure class="image is-48x48">
                    <img src="https://bulma.io/images/placeholders/32x32.png" alt="Student Picture"
                         class="is-rounded">
                  </figure>
                </div>
                <div class="column">
                  <a href="#" class="is-link is-size-6 has-text-weight-normal" style="text-decoration: underline"><p
                    style="word-break: break-all">${element.name}</p></a>
                  <div class="content is-small is-size-7 has-text-weight-normal">
                    <p>DOB: ${element.dateOfBirth} (${element.age})</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="column ${!element.notes ? 'is-hidden-mobile' : ''}">
          <div class="content is-small has-text-weight-normal">
            <p>${element.notes ? element.notes : '--'}</p>
          </div>
        </div>
        <div class="column">
          <div class="columns is-mobile">
            <div class="column is-half-desktop is-half-mobile">
              <form action="" onsubmit="checkInSubmit">
                <button class="button is-info is-fullwidth is-outlined" type="submit">Check-in</button>
              </form>
            </div>
            <div class="column is-half-desktop is-half-mobile">
              <button class="button is-link is-fullwidth is-outlined" disabled>Check-out</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}
