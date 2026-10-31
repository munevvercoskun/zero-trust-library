# library-service

Handles the catalogue and borrowing.

- **Owns:** books, copies, loans, holds, cover images
- **Database:** Library DB, which no other service can reach
- **Called by:** the gateway
- **Calls:** notification-service (due-date reminders, hold available)
- **Internet access:** none

Borrowing runs in a single database transaction, so two people can't borrow the last copy at the same time.
