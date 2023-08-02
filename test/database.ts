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
  console.log(`initializing ${database}`)
  await admin.raw('DROP DATABASE IF EXISTS ??', database)
  await admin.raw('CREATE DATABASE ??', database)
  admin.destroy()

  const testDb = knex(knexConfig.test)
  await testDb.migrate.latest()
  return testDb
}
