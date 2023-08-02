import Knex from 'knex'

function connectAsAdmin() {
  return Knex({
    client: 'postgresql', 
    connection: { 
      host: 'localhost',
      user: 'postgres',
    }
  })
}

export async function createTestDatabase(): Promise<void> {
  const knex = connectAsAdmin()
  await knex.raw('CREATE DATABASE octo_events_test').catch(console.error);
  knex.destroy()
};

export async function dropTestDatabase(): Promise<void> {
  const knex = connectAsAdmin()
  await knex.raw('DROP DATABASE IF EXISTs octo_events_test').catch(console.error)
  knex.destroy();
};

