import { test } from '@japa/runner'

test.group('Child enrollment child enrollment controller', () => {
  test('Test with invalid data', async ( { client }) => {
    //TODO: confirm endpoint
    let response = await client.post(`/api/v1/children/enroll`)
      .form({})
    response.assertStatus(400);
    response.assertBody({
      "code": [
        "Required"
      ],
      "locationId": [
        "Required"
      ],
      "filler": [
        "required validation failed"
      ],
      "children": [
        "required validation failed"
      ]
    })

    response = await client.post(`/api/v1/children/enroll`)
      .form({})
    response.assertStatus(400);
    response.assertBodyContains({

    })
  })
})
