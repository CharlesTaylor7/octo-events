/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'octo_events',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'dev_migrations',
    },
  },

  test: {
    client: 'postgresql',
    connection: {
      database: 'octo_events_test',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'test_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'octo_events',
      user: 'TODO',
      password: 'TODO',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'prod_migrations',
    },
  },
}
