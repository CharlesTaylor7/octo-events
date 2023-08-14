import prisma from '@/database'
import { webhookRequestIsValid } from '@/encryption'
import Fastify from 'fastify'
import { Type, Static } from '@sinclair/typebox'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'


const api = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>()

api.get('/issues/:issueId/events', {
  async handler(req, res) {
    const issue = await prisma.issue.findUnique({
      where: { id: Number((req.params as any).issueId) },
      include: { events: { select: { action: true, created_at: true } } },
    })
    if (issue) {
      res.status(200).send(issue.events)
    } else {
      res.status(404).send({})
    }
  },
})

const bodySchema = Type.Object({
  action: Type.String(),
  issue: Type.Object({
    number: Type.Number({}),
  })
})

type Body = Static<typeof bodySchema>;

api.post('/webhook', {
  schema: {
    body: bodySchema
  },
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
    const body = req.body 
    const issueId = body.issue.number

    await prisma.issue.upsert({
      where: { id: issueId },
      create: { id: issueId },
      update: {},
    })
    await prisma.event.create({
      data: {
        action: body.action,
        issue_id: issueId,
      },
    })

    res.status(201).send()
  },
})

export default api
