import express from 'express'
import { connect } from '@/database'

const api = express()
api.use(express.json())

api.get('/hello-world', (req, res) => {
  res.send('Hello, World!')
})

api.get('/issues/:issueId/events', async (req, res) => {
  const knex = connect()
  res.header('content-type', 'application/json')

  const rows = await knex('issues').where('id', req.params.issueId).limit(1)
  if (rows[0]) {
    res.status(200)
    const rows = await knex('events').select('action', 'created_at').where('issue_id', req.params.issueId)
    res.send(rows)
  } else {
    res.status(404)
    res.send({})
  }
})

// api.post('/webhook', webhookHandler)

export default api
