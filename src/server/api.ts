import express from 'express'

const api = express()

api.get('/hello-world', (req, res) => {
  res.send('Hello, World!')
})

api.get('/issues/:issueId/events', (req, res) => {
  res.header('content-type', 'application/json')
  res.status(404)
  res.send()
})

// api.post('/webhook', webhookHandler)

export default api
