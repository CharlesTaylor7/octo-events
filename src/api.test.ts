import request from 'supertest'

import api from '@/api'
import prisma from '@/database'
import { signRequest } from '@/encryption'

beforeAll(() => api.ready());
afterAll(() => api.close());

afterEach(async () => {
  await prisma.$executeRaw`DELETE FROM events`
  await prisma.$executeRaw`DELETE FROM issues`
})

describe('api', () => {
  describe('POST /webhook', () => {
    test('requst without body, reply with 400 Bad Request', async () => {
      await request(api.server).post('/webhook').expect(400)
    })
    test('invalid signature', async () => {
      await request(api.server).post('/webhook').send({}).expect(401)
    })

    test('with valid signature, send issue event', async () => {
      const body = {
        action: 'opened',
        issue: {
          number: 123,
        },
      }
      await request(api.server)
        .post('/webhook')
        .send(body)
        .set(signRequest(body, { 'X-GitHub-Event': 'issues' }))
        .expect(201)

      const rows = await prisma.event.findMany({ select: {action: true, created_at: true}})
      
      expect(rows).toEqual([{
        action: 'opened',
        created_at: expect.any(Date),
      }])
    })

    test('with valid signature, send ping', async () => {
      const body = {}
      await request(api.server)
        .post('/webhook')
        .send(body)
        .set(signRequest(body, { 'X-GitHub-Event': 'ping' }))
        .expect(200)
    })

    test('with valid signature, send non-issue event', async () => {
      const body = {}
      await request(api.server)
        .post('/webhook')
        .send(body)
        .set(signRequest(body, { 'X-GitHub-Event': 'other' }))
        .expect(200)
    })
  })

  describe('GET /issues/:issueId/events', () => {
    test('when the issue does not exist, responds with 404 not found', async () => {
      await request(api.server)
        .get('/issues/23/events')
        .expect('Content-Type', /application\/json/)
        .expect(404)
    })

    test('when the issue has events, responds with 200 and them', async () => {
      await prisma.issue.createMany({data:[{ id: 34 }, { id: 42 }, { id: 57 }]})
      await prisma.event.createMany({
        data: [
        { issue_id: 34, action: 'created' },
        { issue_id: 34, action: 'deleted' },
        { issue_id: 57, action: 'commented' },
      ]})

      const response = await request(api.server)
        .get('/issues/34/events')
        .expect('Content-Type', /application\/json/)
        .expect(200)

      expect(response.body)
        .toEqual([
          { action: 'created', created_at: expect.any(String) },
          { action: 'deleted', created_at: expect.any(String) },
        ])
    })
    test('when the issue has no events, responds with 200 and an empty list', async () => {
      await prisma.issue.createMany({data: [{ id: 34 }, { id: 42 }, { id: 57 }]})
      const response = await request(api.server)
        .get('/issues/34/events')
        .expect('Content-Type', /application\/json/)
        .expect(200)
      expect(response.body).toEqual([])
    })
  })
})
