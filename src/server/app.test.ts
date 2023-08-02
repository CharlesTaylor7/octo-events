import request from 'supertest'
import app from '@/server/app'

describe('app', () => {
  test('/hello-world', () => {
    return request(app)
      .get('/hello-world')
      .expect('Content-Type', /text\/html/)
      .expect(200)
      .then(response => {
        expect(response.text).toEqual("Hello, World!")
      })
  })
})
