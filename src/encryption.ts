import type { IncomingHttpHeaders } from 'node:http'
import crypto from 'crypto'

type Request = {
  headers: Headers
  body: unknown
}

export function webhookRequestIsValid(req: Request): boolean {
  const requestSignature = req.headers['x-hub-signature-256']
  if (!requestSignature) return false

  const signature = githubSha256Signature(req.body)
  return signature === requestSignature
}

// testing purposes
export function signRequest(body: object, headers: Headers) {
  headers['x-hub-signature-256'] = githubSha256Signature(body)
  return headers
}

type Headers = IncomingHttpHeaders

function githubSha256Signature(body: unknown) {
  const signature = crypto
    .createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET as string)
    .update(JSON.stringify(body))
    .digest('hex')

  return `sha256=${signature}`
}
