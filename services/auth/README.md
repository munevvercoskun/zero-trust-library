# auth-service

Handles who you are and what you're allowed to do.

- **Owns:** users, roles (member, librarian, admin), sessions, refresh tokens, 2FA
- **Database:** Users DB, which no other service can reach
- **Called by:** the gateway
- **Calls:** notification-service (password reset emails)
- **Internet access:** none
