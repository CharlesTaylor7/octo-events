import request from 'supertest'
import { Knex } from 'knex'
import api from '@/api'
import { setupTestDatabase } from '@/database'
import { signRequest } from '@/encryption'

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
  test('GET /hello-world', async () => {
    await request(api)
      .get('/hello-world')
      .expect('Content-Type', /text\/html/)
      .expect(200)
      .expect('Hello, World!')
  })

  describe('POST /webhook', () => {
    test('invalid signature', async () => {
      await request(api).post('/webhook').expect(401).expect('Unauthorized')
    })

    test('with valid signature, send issue event', async () => {
      const body = {
        action: 'opened',
        issue: {
          id: 123,
        },
      }
      await request(api)
        .post('/webhook')
        .send(body)
        .set(signRequest(body, { 'X-GitHub-Event': 'issues' }))
        .expect(201)

      const rows = await knex('events').select('action')
      expect(rows).toEqual([{ action: 'opened'}])
    })

    test('with valid signature, send ping', async () => {
      const body = {}
      await request(api)
        .post('/webhook')
        .send(body)
        .set(signRequest(body, { 'X-GitHub-Event': 'ping' }))
        .expect(200)
    })

    test('with valid signature, send non-issue event', async () => {
      const body = {}
      await request(api)
        .post('/webhook')
        .send(body)
        .set(signRequest(body, { 'X-GitHub-Event': 'other' }))
        .expect(200)
    })


  })

  describe('GET /issues/:issueId/events', () => {
    test('when the issue does not exist, responds with 404 not found', async () => {
      await request(api)
        .get('/issues/23/events')
        .expect('Content-Type', /application\/json/)
        .expect(404)
    })

    test('when the issue has events, responds with 200 and them', async () => {
      await knex.batchInsert('issues', [{ id: 34 }, { id: 42 }, { id: 57 }])
      await knex.batchInsert('events', [
        { issue_id: 34, action: 'created' },
        { issue_id: 34, action: 'deleted' },
        { issue_id: 57, action: 'commented' },
      ])

      await request(api)
        .get('/issues/34/events')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect([
          { action: 'created', created_at: null },
          { action: 'deleted', created_at: null },
        ])
    })
    test('when the issue has no events, responds with 200 and an empty list', async () => {
      await knex.batchInsert('issues', [{ id: 34 }, { id: 42 }, { id: 57 }])
      const response = await request(api)
        .get('/issues/34/events')
        .expect('Content-Type', /application\/json/)
        .expect(200)
      expect(response.body).toEqual([])
    })
  })
})
