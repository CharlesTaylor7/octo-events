import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('events', table =>
    table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP')).alter()
  )
}


export async function down(knex: Knex): Promise<void> {
}

