# Octo Events
Octo events is an API server built with [Express](https://expressjs.com/), [Typescript](https://www.typescriptlang.org/) & [Prisma](https://www.prisma.io/). 
It receives webhook events from github issues, and then makes those events available to read later.

Consumers of the api can get a list of events that occurred on this repo by calling the endpoint `/issues/:issueNumber/events`. 

Octo Events is live and deployed on [fly.io](fly.io)
So to see a sample query in action, just visit this url: https://octo-events.fly.dev/issues/3/events

## CI / CD
This project makes use of Continuous Integration & Continuous Delivery via Github Actions.
Every push to the `main` branch will cause the testsuite and typescript verification to run. If both those pass, then the application is deployed to https://octo-events.fly.dev. You can see the workflow `.github/workflows/publish.yml` for the nitty gritty details.

## Docker
There is a provided Dockerfile intended for production deployment, but not local development. 
Currently the application is hosted on fly.io, for ease of setup. But this project could be deployed to other cloud providers with relative ease, because it is already running in a docker container.

## Local Development Setup 
1. You need postgres installed, with a superuser named "postgres".
  Sample instructions for Mac:
    - `brew install postgresql@14`
    - `createuser -s postgres` ( There needs to be super user named postgres)

2. You need to install yarn (classic):
```sh
npm install --global yarn
```

4. Install dependencies:
```sh
yarn
```

## Development Commands
Start the dev server:
`yarn dev`

Format code:
`yarn format`

Run tests:
`yarn test`

Verify typescript types:
`yarn typecheck`

I personally use [mprocs](https://github.com/pvolok/mprocs) to manage running multiple of these commands together.

## Migrations
Database migrations are managed via [Prisma](https://www.prisma.io/docs/concepts/components/prisma-migrate). 

To migrate the database, you'll need to edit the `prisma/schema.prisma` file

Then you can apply those changes by running `yarn migrate`. This will immediately update your local dev database, and serialize your changes as a new sql migration in the `prisma/migrations` folder.
You need to commit the automatically generated migration.sql file alongside your changes to the schema.prism file. That way, the production database will be able to migrate properly.
