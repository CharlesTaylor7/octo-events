import Knex from 'knex'
import knexConfig from '../knexfile'

function connectAsAdmin() {
  return Knex({
    client: 'postgresql',
    connection: {
      host: 'localhost',
      user: 'postgres',
    },
  })
}

const database = knexConfig.test.connection.database

export async function createTestDatabase(): Promise<void> {
  const knex = connectAsAdmin()
  await knex.raw('CREATE DATABASE ??', database).catch(console.error)
  knex.destroy()
}

export async function dropTestDatabase(): Promise<void> {
  const knex = connectAsAdmin()
  await knex.raw('DROP DATABASE IF EXISTS ??', database).catch(console.error)
  knex.destroy()
}
