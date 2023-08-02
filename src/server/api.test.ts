import request from 'supertest'
import api from '@/server/api'

describe('api', () => {
  test('/hello-world', async () => {
    const response = await request(api)
      .get('/hello-world')
      .expect('Content-Type', /text\/html/)
      .expect(200)

    expect(response.text).toEqual('Hello, World!')
  })

  describe('/issues/:issueId/events', () => {
    test.skip("when the issue does not exist, responds with 404 not found", () => {
    })

    test.skip("when the issue has no events, responds with 200 and an empty list", () => {
    })

    test.skip("when the issue has events, responds with 200 and them", () => {
    })
  })
})
