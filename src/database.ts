import { PrismaClient } from '@prisma/client'

let client: PrismaClient | undefined
export function connect(): PrismaClient {
  if (!client) {
    client = new PrismaClient()
  }
  return client
}
