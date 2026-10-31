# Threat model

One row per data flow in the architecture.

STRIDE: **S**poofing, **T**ampering, **R**epudiation, **I**nformation disclosure, **D**enial of service, **E**levation of privilege.

| Data flow | STRIDE | Threat | Control | How it's tested |
| --- | --- | --- | --- | --- |
| Browser → gateway | S | Stolen access token reused by an attacker | 15-minute access token, refresh rotation, HttpOnly cookie | Replayed old refresh token is rejected and revokes the session |
| Gateway → auth-service | | | | |
| Gateway → library-service | | | | |
| auth-service → notification-service | | | | |
| library-service → notification-service | | | | |
| notification-service → email provider | | | | |
| auth-service → Users DB | | | | |
| library-service → Library DB | | | | |
