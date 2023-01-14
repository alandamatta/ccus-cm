import { test } from '@japa/runner'
import { file } from '@ioc:Adonis/Core/Helpers'

const apiEndpoint = '/api/private/student/import'

test.group('import students', () => {
  test('endpoint should check for csv file', async ({ client }) => {
    const fakeExcelSheet = await file.generateXlsx('1mb')

    let response = await client.post(apiEndpoint).header('Accept', 'application/json')
    response.assertStatus(422)
    response.assertBody({
      errors: [
        {
          rule: 'required',
          field: 'locations',
          message: 'Minimum of one location is required to be informed',
        },
        {
          rule: 'required',
          field: 'file',
          message: 'File is required to make the import',
        },
      ],
    })

    response = await client
      .post(apiEndpoint)
      .header('Accept', 'application/json')
      .file('file', fakeExcelSheet.contents, fakeExcelSheet.name)
    response.assertStatus(422)
    response.assertBody({
      errors: [
        {
          rule: 'required',
          field: 'locations',
          message: 'Minimum of one location is required to be informed',
        },
      ],
    })

    response = await client
      .post(apiEndpoint)
      .field('locations.0.id', '1')
      .header('Accept', 'application/json')
    response.assertStatus(422)
    response.assertBody({
      errors: [
        {
          rule: 'required',
          field: 'file',
          message: 'File is required to make the import',
        },
      ],
    })
  })

  test('Import student endpoint should return ok if request body is valid', async ({ client }) => {
    const fakeExcelSheet = await file.generateXlsx('1mb')
    let response = await client
      .post(apiEndpoint)
      .header('Accept', 'application/json')
      .file('file', fakeExcelSheet.contents, fakeExcelSheet.name)
      .field('locations.0.id', '1')
    response.assertStatus(200)
  })
})
