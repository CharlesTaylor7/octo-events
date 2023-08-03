import type { IncomingHttpHeaders } from 'node:http'
import type { Request } from 'express'
import crypto from 'crypto'
import config from '@/config'

export function webhookRequestIsValid(req: Request): boolean {
  const requestSignature = req.get('X-Hub-Signature-256')
  if (!requestSignature) return false

  const signature = githubSha256Signature(req.body)
  return signature === requestSignature
}

// testing purposes
export function signRequest(body: object, headers: Headers) {
  headers['X-Hub-Signature-256'] = githubSha256Signature(body)
  return headers
}

type Headers = IncomingHttpHeaders

function githubSha256Signature(body: object) {
  const signature = crypto.createHmac('sha256', config.githubWebhookSecret).update(JSON.stringify(body)).digest('hex')

  return `sha256=${signature}`
}
