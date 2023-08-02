import express from 'express'
//import eventsHandler from '@/server/events'
//import webhookHandler from '@/server/webhook'

const app = express()

app.get('/hello-world', (req, res) => {
  res.send('Hello, World!')
})

// app.get('/issues/:issueId/events', eventsHandler)
// app.post('/webhook', webhookHandler)

export default app
