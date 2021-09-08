export { addCourse, removeCourse }

function addCourse() {
  const counter = $('#location_courses_counter')
  $('#location_courses').append(component(counter.val()))
  counter.val(parseInt(counter.val()) + 1)
}

function component(counter) {
  const id = 'location_course' + new Date().getUTCMilliseconds()
  return `
    <div class="columns" id="${id}">
      <div class="column">
        <div class="notification">
          <button class="delete" type="button" onclick="locationjs.removeCourse('${id}')"></button>

          <div class="columns">
            <div class="column">
              <div class="field">
                <label for="course[${counter}].name" class="label">Course Name</label>
                <div class="control">
                  <input type="text" class="input name is-small" id="course[${counter}].name" name="course[${counter}].name">
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <div class="field">
                <label for="course[${counter}].dayOfTheWeek" class="label">Day of the Week</label>
                <div class="control">
                  <input type="text" class="input name is-small" id="course[${counter}].dayOfTheWeek" name="course[${counter}].dayOfTheWeek">
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label for="course[${counter}].courseDuration" class="label">Course Duration</label>
                <div class="control">
                  <input type="text" class="input name is-small" id="course[${counter}].courseDuration" name="course[${counter}].courseDuration">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

function removeCourse(id) {
  $('#' + id).replaceWith('')
}
