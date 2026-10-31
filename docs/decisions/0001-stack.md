# 0001: Stack

**Status:** Accepted
**Date:** 2026-10-30

## Context

The original project used plain JavaScript and Express, with SQL written by hand and no validation layer. Most of its bugs were mismatches nobody caught until runtime: routes the frontend called that did not exist, columns the code used that the database did not have.

For the rebuild I want tools that catch those mistakes early and stay close to what I already know.

## Decision

| Area | Choice | Why |
| --- | --- | --- |
| Language | TypeScript on the current Node.js LTS | Type errors show up before the code runs. |
| Web framework | Express 5 | I have experience with Express. Version 5 passes errors from async handlers to the error handler without extra code. |
| Database | PostgreSQL, one database per service | Each service owns its data; no service can query another's tables. |
| Database access | `pg` with parameterized SQL | No ORM hiding the queries. Every query is visible, and parameters rule out SQL injection. |
| Migrations | `node-pg-migrate` | Tables are created and changed only through versioned files, never by hand. |
| Request validation | `express-openapi-validator` | Requests are checked against `docs/openapi.yaml`, so the spec is enforced, not just documented. |
| Password hashing | `argon2` (argon2id) | Current recommendation for password storage; slow by design. |
| Tokens | `jose`, JWTs signed with Ed25519 | auth-service signs with a private key. The gateway and other services only hold the public key, so they can check tokens but never create them. I don't use HS256 because a secret that can check a token can also create one, so one hacked service could forge a login for anyone. |
| Security headers | `helmet` | Sensible defaults for headers like Content-Security-Policy. |
| Rate limiting | `express-rate-limit` | Per-route limits, stricter on login and password reset. |
| Gateway | Express with `http-proxy-middleware` | Same language as the services, so one set of tools to learn and test. |
| Logging | `pino` | Structured JSON logs, with the `Authorization` header and cookies redacted. |
| Email | `nodemailer`, Mailpit locally | Nothing leaves my machine during development. |
| Tests | Vitest and Supertest | Fast unit tests, and HTTP tests against the real Express app. |
| Frontend | React with Vite and TypeScript | Create React App is deprecated. Vite is the usual replacement. |
| Frontend API client | `openapi-typescript` | Generated from the spec, so the frontend cannot call a route that does not exist. |

## Alternatives considered

- **Fastify instead of Express.** Faster, with schema validation built in. Rejected for now: learning a new framework would slow down the security work, which is the point of the project.
- **Prisma or another ORM.** Less SQL to write. Rejected because it hides the queries, and I want to be able to show exactly what runs against the database.
- **JWTs signed with a shared secret (HS256).** Simpler, but every service holding the secret could also create valid tokens. One leaked service would mean forged logins everywhere.
- **nginx or Envoy as the gateway.** More common in production. Kept as a possible later swap; an Express gateway is easier to test and explain at this stage.

## Consequences

- Each service needs a TypeScript build step and its own `package.json`.
- The OpenAPI spec has to be written before the routes, because validation depends on it.
- Ed25519 keys have to be generated and stored: in `.env` locally (git-ignored) and in Secret Manager in the cloud.
