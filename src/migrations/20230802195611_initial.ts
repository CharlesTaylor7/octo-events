import type { Knex } from 'knex'
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex: Knex) {
  return knex.schema
    .createTable('issues', (table) => {
      table.integer('id').primary()
    })
    .createTable('events', (table) => {
      table.increments().primary()
      table.string('action')
      table.timestamp('created_at')
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex: Knex) {
  return knex.schema.dropTable('events').dropTable('issues')
}
