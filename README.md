# Demands API

This is a simple API to manage dayoffs demands for a company.
It's built with [bun](https://bun.sh), [elysia](https://elysiajs.com) and [drizzle](https://drizzle.dev).

## Migrations

If no migrations are found, you can run `bun migration:create` to create a new migration file.

To create the database, run `bun migration:run`.
To seed the database, run `bun migration:seed`.

# Launching the server

To launch the server, run `bun dev`.

## API endpoints documentation - Postman

- [Auth](https://www.postman.com/aerospace-saganist-97722033/demands/collection/rajwc63/users?action=share&creator=25637739)
- [Dayoffs](https://www.postman.com/aerospace-saganist-97722033/demands/collection/ugiftw8/dayoffs?action=share&creator=25637739)

## Architecture

Largely inspired by [bun-elysia-drizzle-sqlite](https://github.com/remuspoienar/bun-elysia-drizzle-sqlite) repo.
