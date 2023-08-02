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
})
