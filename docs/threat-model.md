# Threat model

What the system protects, who it protects it from, and the design decisions that came out of it. Built with STRIDE.

STRIDE: **S**poofing, **T**ampering, **R**epudiation, **I**nformation disclosure, **D**enial of service, **E**levation of privilege.

## What needs protecting

| Asset | Where it lives | Why it matters |
| --- | --- | --- |
| Passwords | Users DB, as argon2id hashes | Reused passwords put members' other accounts at risk |
| Refresh tokens | Browser cookie; Users DB as hashes | A stolen token is a stolen session |
| 2FA secrets and backup codes | Users DB, encrypted / hashed | Leaking them undoes 2FA |
| Personal details (name, email, phone) | Users DB | Personal data under privacy law |
| Loan history | Library DB | Reading history is personal; libraries have long treated borrowing records as confidential |
| Token signing key (Ed25519 private key) | auth-service only | Whoever holds it can sign in as anyone |
| Email API key | notification-service only | Lets anyone send email as the library |
| Database credentials | Secret Manager | Direct access to all of the above |

## Who I'm defending against

- **Anonymous internet user:** scans, brute-forces logins, sends malformed requests.
- **Signed-in member:** tries to see other members' data or act as a librarian.
- **Stolen token:** someone holding a member's access or refresh token.
- **Compromised service:** an attacker running code inside one pod, trying to reach the rest.
- **Malicious dependency:** a package or GitHub Action that turns hostile.

Out of scope: Google's own staff or infrastructure, physical access, and attackers with control of a member's device.

## Trust boundaries

1. Internet → edge (TLS, Cloud Armor)
2. Edge → cluster (only the gateway is reachable)
3. Service → service (every call authenticated with mTLS; no pod is trusted because it is inside the cluster)
4. Cluster → internet (only notification-service may leave, only to the email provider)
5. GitHub → Google Cloud (deploys)

## Flows

One row per arrow in the architecture, with the threat that matters most on it. "Network test" means a script that tries the forbidden connection from inside the cluster and confirms it fails.

| Data flow | STRIDE | Main threat | Control | How it's checked |
| --- | --- | --- | --- | --- |
| Browser → gateway | S | Stolen or brute-forced login | Short-lived access tokens, rotating refresh token in an HttpOnly cookie, rate limits, optional 2FA | Automated tests |
| Browser → gateway | T | Extra fields in a request, e.g. `"role": "admin"` | Requests checked against the API spec; unknown fields rejected | Automated tests |
| Gateway → auth-service | I | Password hashes or tokens leaking in responses | Responses checked against the spec too | Automated tests |
| Gateway → library-service | E | Member acting as a librarian, or reading other members' loans | Role inside a signed token; member routes use the ID from the token, never from the URL | Automated tests |
| library-service → auth-service | S | Another service calling internal routes | Internal routes on a separate port that only library-service may reach | Network test |
| auth, library → notification | S | Someone else sending email as the library | Only auth and library may call it; fixed email templates | Network test |
| notification → email provider | I | Data leaving through a compromised notification pod | The only allowed way out; no database access | Network test |
| Service → its own database | I | One service reading another's data | Separate databases and users; only the owner can connect | Network test |
| library → cover bucket | T | Harmful file uploaded as a cover | File type checked from its bytes, re-encoded, given a random name, served from a separate domain | Automated tests |
| GitHub → Google Cloud | T | Malicious dependency or leaked secret | Pinned actions, Dependabot, secret scanning, image scans | CI |

## Design decisions

1. **Tokens are signed with a key only auth-service holds.** The other services get a public key that can check tokens but not create them, so one compromised service can't forge logins for everyone.
2. **Internal routes live on their own port.** Network policies can block ports but not URL paths, so a separate port is what makes "only library-service may call this" enforceable.
3. **The service that can reach the internet gets the least data.** library-service passes the recipient's email to notification-service, which never queries the user database. A compromise there exposes only the emails being sent.
4. **The database enforces the rules that matter most.** One active loan per copy is a unique index, not just an `if` in the code, so a race or a bug can't break it.

## Accepted risks

- A disabled account keeps working until its access token expires (up to 15 minutes).
- Outbound traffic is limited by IP range, not domain name.
- The ML risk score is trained on synthetic data, so its numbers show the method, not real accuracy.
- Single region, no disaster recovery.
