import express from 'express'
import prisma from '@/database'
import { webhookRequestIsValid } from '@/encryption'

const api = express()
api.use(express.json())

api.get('/issues/:issueId/events', async (req, res) => {
  try {
    res.header('content-type', 'application/json')

    const issue = await prisma.issue.findUnique({
      where: { id: Number(req.params.issueId) },
      include: { events: { select: { action: true, created_at: true } } },
    })
    if (issue) {
      res.status(200).send(issue.events)
    } else {
      res.status(404).send()
    }
  } catch (e) {
    console.log(e)
    res.status(500).send("Sorry we're experiencing technical difficulties right now")
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

    const issueId = req.body.issue.number

    await prisma.issue.upsert({
      where: { id: issueId },
      create: { id: issueId },
      update: {},
    })
    await prisma.event.create({
      data: {
        action: req.body.action,
        issue_id: issueId,
      },
    })

    res.status(201)
    res.send()
  } catch (e) {
    console.log(e)
    res.status(500).send("Sorry we're experiencing technical difficulties right now")
  }
})

export default api
