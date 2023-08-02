import request from 'supertest'
import app from '@/server/app'

describe('app', () => {
  test('/hello-world', async () => {
    const response = await request(app)
      .get('/hello-world')
      .expect('Content-Type', /text\/html/)
      .expect(200)

    expect(response.text).toEqual("Hello, World!")
  })
})
