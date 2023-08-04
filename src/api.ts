import express from 'express'
import { connect } from '@/database'
import { webhookRequestIsValid } from '@/encryption'

const api = express()
api.use(express.json())

api.get('/hello-world', (req, res) => {
  res.send('Hello, World!')
})

api.get('/issues/:issueId/events', async (req, res) => {
  try {
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
  } catch (e) {
    console.log(e)
    res.status(500)
    res.send("Sorry we're experiencing technical difficulties right now")
  }
})

api.post('/webhook', async (req, res) => {
  try {
    if (!webhookRequestIsValid(req)) {
      res.status(401).send('Unauthorized')
      return
    }
    const eventType = req.get('X-GitHub-Event')
    if (eventType === 'ping') {
      // respond to pings
      res.status(200).send('pong')
      return
    }

    if (eventType !== 'issues') {
      // acknowledge non issue events, but do nothing with them
      res.status(200).send()
      return
    }

    const knex = connect()
    await knex('issues').insert({ id: req.body.issue.id }).onConflict('id').ignore()
    await knex('events').insert({ issue_id: req.body.issue.id, action: req.body.action })

    res.status(201)
    res.send()
  } catch (e) {
    console.log(e)
    res.status(500)
    res.send("Sorry we're experiencing technical difficulties right now")
  }
})

export default api
