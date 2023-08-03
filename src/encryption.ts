import type { IncomingHttpHeaders } from 'node:http'
import crypto from 'crypto'
import config from '@/config'


export function webhookRequestIsValid(req: Request): boolean {
  const requestSignature = req.headers['x-hub-signature-256']
  if (!requestSignature) return false

  const signature = githubSha256Signature(req.body)
  return signature === requestSignature
}


// testing purposes
export function signRequest(body: string, headers: Headers) {
  headers['x-hub-signature-256'] = githubSha256Signature(body)
  return headers
}


type Request = {
  headers: Headers
  body: string
}

type Headers = IncomingHttpHeaders


function githubSha256Signature(body: string) {
  const digest = crypto
    .createHmac('sha256', config.githubWebhookSecret)
    .update(JSON.stringify(body))
    .digest('hex')

  return `sha256=${digest}` 
}
