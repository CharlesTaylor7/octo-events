## Requirements
- [ ] /issues/:issueId/events
- [ ] Webhook
- [ ] README
- [ ] Basic Auth for API (double check with Lucas)

## Niceties
- [] 100% test coverage
- [] Deploy to fly.io/AWS etc.

## Shortlist
- [x] Express hello world 
- [x] Jest test
- [x] Github action
- [x] Verify jest & typescript configuration before starting feature development

## Tech Stack Choices

Out of the gate I determined I wanted to use Node.js, Typescript & Postgres.
For the API layer I reached for Express.js for familiarity.
I determined I would also like an ORM & DB migration tool so the app could evolve over time easily with new requirements.

I performed some google searches to find an initial list of 5 ORMS with typescript support. I arrived at the following list of ORMs and which I researched:
- Objection + knex
- MikroORM
- Sequelize
- Prisma
- TypeOrm

I hate all of them equally, so I'm gonna stick with just knex for now.
