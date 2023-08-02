/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('issues', function (table) {
      table.integer('id').primary()
    })
    .createTable('events', function (table) {
      table.increments().primary()
      table.string('action')
      table.timestamp('created_at')
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('events').dropTable('issues')
}
