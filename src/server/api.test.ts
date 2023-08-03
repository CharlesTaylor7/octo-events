import request from 'supertest'
import { Knex } from 'knex'
import api from '@/server/api'
import { setupTestDatabase } from '@/database'

let knex: Knex

beforeAll(async () => {
  knex = await setupTestDatabase()
})

afterAll(async () => {
  await knex.destroy()
})

afterEach(async () => {
  await knex.raw('DELETE FROM events')
  await knex.raw('DELETE FROM issues')
})

describe('api', () => {
  test('/hello-world', async () => {
    const response = await request(api)
      .get('/hello-world')
      .expect('Content-Type', /text\/html/)
      .expect(200)

    expect(response.text).toEqual('Hello, World!')
  })

  describe('/issues/:issueId/events', () => {
    test('when the issue does not exist, responds with 404 not found', async () => {
      const response = await request(api)
        .get('/issues/23/events')
        .expect('Content-Type', /application\/json/)
        .expect(404)
    })

    test('when the issue has events, responds with 200 and them', async () => {
      //await knex.transaction(async (knex) => {
        await knex.batchInsert('issues', [{ id: 34 }, { id: 42 }, { id: 57 }])
        await knex.batchInsert('events', [
          { issue_id: 34, action: 'created' },
          { issue_id: 34, action: 'deleted' },
          { issue_id: 57, action: 'commented' },
        ])

        const response = await request(api)
          .get('/issues/34/events')
          .expect('Content-Type', /application\/json/)
          .expect(200)
        expect(response.body).toEqual([
          { action: 'created', created_at: null },
          { action: 'deleted', created_at: null },
        ])
      //})
    })
    test('when the issue has no events, responds with 200 and an empty list', async () => {
      //await knex.transaction(async (knex) => {
        await knex.batchInsert('issues', [{ id: 34 }, { id: 42 }, { id: 57 }])
        const response = await request(api)
          .get('/issues/34/events')
          .expect('Content-Type', /application\/json/)
          .expect(200)
        expect(response.body).toEqual([])
      //})
    })
  })
})
