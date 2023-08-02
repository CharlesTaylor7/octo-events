import request from 'supertest'
import Knex from 'knex'
import api from '@/server/api'
import { createTestDatabase, dropTestDatabase } from '@/test/database'

beforeAll(createTestDatabase)
afterAll(dropTestDatabase)

describe('api', () => {
  test('/hello-world', async () => {
    const response = await request(api)
      .get('/hello-world')
      .expect('Content-Type', /text\/html/)
      .expect(200)

    expect(response.text).toEqual('Hello, World!')
  })

  describe.skip('/issues/:issueId/events', () => {
    test('when the issue does not exist, responds with 404 not found', async () => {
      const response = await request(api)
        .get('/issues/23/events')
        .expect('Content-Type', /application\/json/)
        .expect(404)
    })

    test.skip('when the issue has no events, responds with 200 and an empty list', async () => {
      const response = await request(api)
        .get('/issues/34/events')
        .expect('Content-Type', /application\/json/)
        .expect(200)
      expect(response.body).toEqual([])
    })

    test.skip('when the issue has events, responds with 200 and them', async () => {})
  })
})
