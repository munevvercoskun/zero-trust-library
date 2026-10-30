# notification-service

Sends email for the other services.

- **Owns:** the email provider API key (no other service has it)
- **Database:** none
- **Called by:** auth-service and library-service only, never the gateway
- **Internet access:** yes, the only service allowed out, and only to the email provider

Locally, emails go to Mailpit, so nothing leaves your machine.

Built in Phase 3.
