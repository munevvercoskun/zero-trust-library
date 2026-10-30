# zero-trust-library

A library management app (search the catalogue, borrow and return books, manage members), rebuilt from scratch with security as the main goal.

## Background

This is a solo rebuild of my 2025 capstone project at Toronto Metropolitan University. The original was built by a team of four, and I worked on the backend and the Google Cloud deployment. A lot of it worked, but the frontend and backend never fully lined up, and looking back, the security had gaps I didn't know how to spot at the time.

Instead of patching the old code, I'm starting over with a new codebase and a clean git history. It's the same app, but this time every security control is there to answer a specific threat, and I want to be able to show each one working, not just say it's there.

## What it's going to have

Planned, not built yet:

- Three services (auth, library, notification) behind one API gateway, each with its own database
- mTLS between services and default-deny Kubernetes network policies
- Only the notification service is allowed to reach the internet
- 2FA, refresh token rotation, rate limiting, safe file uploads
- Secret, dependency and container image scanning in CI
- An experimental ML risk score for logins, compared against plain rules

## Status

**Phase 0: repo setup.** Nothing runs yet. Right now the repo has its structure, secret scanning before every commit, and a CI check that scans the full history.

| Phase | What | Status |
| --- | --- | --- |
| 0 | Clean repo, secret scanning | In progress |
| 1 | Threat model, API spec, data model | Not started |
| 2 | auth-service | Not started |
| 3 | library, notification, gateway, frontend | Not started |
| 4 | Local Kubernetes hardening | Not started |
| 5 | Google Cloud deploy | Not started |
| 6 | ML login risk score and write-up | Not started |

## Repo layout

```
services/
  auth/           users, roles, sessions, 2FA
  library/        books, copies, loans, holds
  notification/   email (the only service with internet access)
gateway/          the single entry point for the frontend
frontend/         React app
infra/            Docker Compose, Kubernetes and Terraform files
docs/             threat model, API spec, evidence from scans
```

## Running it

Not yet. This section gets filled in once the first service exists.

## Security

How to report a problem: see [SECURITY.md](SECURITY.md).
