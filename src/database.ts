import { PrismaClient } from '@prisma/client'

// prisma autogenerates typescript definitions for database tables from the prisma/scheam.prisma file
export type { Event, Issue } from '@prisma/client'

// Official recommendation is to only have 1 global instance of prisma client.
// The object manages a connection pool, so having multiple around could cause deadlocks or resource leaks.
// https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prismaclient-in-long-running-applications

const prisma: PrismaClient = new PrismaClient()
export default prisma
