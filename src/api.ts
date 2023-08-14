// @ts-nocheck
import prisma from '@/database'
import { webhookRequestIsValid } from '@/encryption'
import Fastify from 'fastify'

const api = Fastify({
  logger: true,
})

api.get('/issues/:issueId/events', {
  async handler(req, res) {
    const issue = await prisma.issue.findUnique({
      where: { id: Number(req.params.issueId) },
      include: { events: { select: { action: true, created_at: true } } },
    })
    if (issue) {
      res.status(200).send(issue.events)
    } else {
      res.status(404).send({})
    }
  },
})

api.post('/webhook', {
  async handler(req, res) {
    if (!webhookRequestIsValid(req)) {
      res.status(401).send('Unauthorized')
      return
    }
    const eventType = req.headers['x-github-event']
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

    res.status(201).send()
  },
})

export default api
