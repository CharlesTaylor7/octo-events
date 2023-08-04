TODO: Docker

## Installation 
1. You need postgres installed, with a superuser named "postgres".
  Sample instructions for Mac:
    - `brew install postgresql@14`
    - `createuser -s postgres` ( There needs to be super user named postgres)

2. You need to install yarn (classic):
  `npm install --global yarn`

3. Install dependencies:
  `yarn`

## Development

Run the dev server with:
`yarn dev`


## Migrations
To migrate the database, you'll need to edit the `prisma/schema.prisma` file.
Then to apply those changes to the database run, `yarn migrate dev`. This will immediately update your local dev database, and serialize your changes as a new sql migration in the `prisma/migrations` folder.
You need to commit the automatically generated migration.sql file alongside your changes to the schema.prism file. That way, the production database will know how to migrate properly.
