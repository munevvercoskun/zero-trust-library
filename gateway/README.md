# gateway

The only way into the system from outside.

- Checks the access token on every request before passing it on
- Rate limits per route, with stricter limits on login and password reset
- Allows one CORS origin: the frontend
- Routes to auth-service and library-service only

Built in Phase 3.
