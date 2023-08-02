import knex, { Knex } from 'knex'
import knexConfig from '@/knexfile'

function connectAsAdmin(): Knex {
  return knex({
    client: 'postgresql',
    connection: {
      host: 'localhost',
      user: 'postgres',
    },
  })
}

const database = knexConfig.test.connection.database

export async function setupTestDatabase(): Promise<Knex> {
  const admin = connectAsAdmin()
  await admin.raw('DROP DATABASE IF EXISTS ??', database)
  await admin.raw('CREATE DATABASE ??', database)
  admin.destroy()

  const testDb = connect()
  await testDb.migrate.latest()
  return testDb
}

type ConfigKey = keyof typeof knexConfig

let connection: Knex | undefined
export function connect(): Knex {
  if (!connection) {
    const env = (process.env.NODE_ENV as ConfigKey) || 'development'
    connection = knex(knexConfig[env])
  } 
  return connection
}
