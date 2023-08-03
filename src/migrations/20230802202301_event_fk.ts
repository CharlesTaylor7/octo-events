import type { Knex } from 'knex'

export function up(knex: Knex) {
  return knex.schema.alterTable('events', function (table) {
    table.integer('issue_id').references('issues.id')
  })
}

export function down(knex: Knex) {
  return knex.schema.alterTable('events', function (table) {
    table.dropColumn('issue_id')
  })
}
