import prisma from '@/database';
import { webhookRequestIsValid } from '@/encryption';
import Fastify from 'fastify';
import { Type } from '@sinclair/typebox';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

const api = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

api.get('/issues/:issueId/events', {
  schema: {
    params: Type.Object({
      issueId: Type.Number(),
    }),
  },
  async handler(req, res) {
    const issue = await prisma.issue.findUnique({
      where: { id: req.params.issueId },
      include: { events: { select: { action: true, created_at: true } } },
    });
    if (issue) {
      res.status(200).send(issue.events);
    } else {
      res.status(404).send({});
    }
  },
});

api.post('/webhook', {
  attachValidation: true,
  schema: {
    body: Type.Object({
      action: Type.String(),
      issue: Type.Object({
        number: Type.Number({}),
      }),
    }),
  },
  async handler(req, res) {
    if (!webhookRequestIsValid(req)) {
      res.status(401).send('Unauthorized');
      return;
    }

    const eventType = req.headers['x-github-event'];
    if (eventType === 'ping') {
      // respond to pings
      res.status(200).send('pong');
      return;
    }

    if (eventType !== 'issues') {
      // acknowledge non issue events, but do nothing with them
      res.status(200).send();
      return;
    }

    if (req.validationError) {
      res.status(400).send();
      return;
    }

    const body = req.body;
    const issueId = body.issue.number;

    const createEvent = { create: [{ action: body.action }] };
    await prisma.issue.upsert({
      where: { id: issueId },
      create: {
        id: issueId,
        events: createEvent,
      },
      update: {
        events: { create: [{ action: body.action }] },
      },
    });

    res.status(201).send();
  },
});

export default api;
