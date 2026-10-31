# Scope

What the app does, who can do it, and what is left out on purpose.

Every API endpoint and every screen should trace back to a line in this file. If a feature is not listed here, this file gets updated first, then the spec, then the code. The original project skipped this step, and the frontend and backend ended up expecting different things.

## Roles

| Role | Who it is |
| --- | --- |
| Visitor | Anyone who is not signed in |
| Member | A registered library user |
| Librarian | Staff who manage the catalogue and loans |
| Admin | Manages accounts and roles, not books |

Each user has exactly one role, stored as a single field on the user record. There is no separate librarian table this time.

## What each role can do

### Visitor
- Search and browse the catalogue, including how many copies are available
- Register an account
- Sign in
- Request a password reset

### Member
Everything a visitor can do, plus:
- Borrow an available copy (self-checkout)
- Place a hold on a book when no copy is available
- See their own current loans, due dates and loan history
- Edit their profile (name, phone)
- Change their password, set up 2FA, view and sign out of active sessions
- Download their data, or delete their account (only with no active loans)

### Librarian
Everything a member can do, plus:
- Add, edit and remove books and copies, including cover images
- Check out a copy on a member's behalf at the desk
- Record a returned copy
- See all active and overdue loans

Note: returns are recorded by a librarian, not by the member. Letting members mark their own books as returned would make the loan records meaningless.

Note: a desk checkout follows the same rules as a self-checkout (loan limit, overdue block), applied to the member, not the librarian. Each loan stores both the member it belongs to and the user who issued it, so desk checkouts can be traced.

### Admin
- View and edit user accounts (name, email, role)
- Change a user's role (member, librarian)
- Disable or re-enable an account
- Every admin action is written to the audit log

Note: nobody can see another user's password, 2FA secret or reset tokens, admins included. These are stored hashed or encrypted and never returned by the API.

## Rules

- A copy can be on only one active loan at a time.
- A member can have at most 5 active loans. Loan period is 21 days. (Placeholder numbers, kept in config so they are easy to change.)
- A member with an overdue loan cannot borrow again until it is returned.
- When a held book is returned, the copy is kept for the first member in the queue for 3 days, then passes to the next.
- Deleting an account removes the member's name, email and phone. Loan records stay, without anything that identifies the person.

## Out of scope

Left out on purpose, so the project stays focused on security rather than features:

- Payments and fines. No card data to protect; an overdue loan simply blocks new loans.
- E-books and digital lending
- Multiple branches
- Sign in with Google or other social logins
- A mobile app

## Decisions

- Visitors can see copy availability. It is catalogue data and says nothing about who borrowed what.
- Librarians can check out books on a member's behalf. Kept because it is how a real desk works, and it is a good test of "acting for someone else" permissions.
