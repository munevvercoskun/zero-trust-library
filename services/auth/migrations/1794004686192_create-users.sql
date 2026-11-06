-- Up Migration

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL, --text is used instead of varchar to allow for longer email addresses and to avoid length limitations. it also allows for case-insensitive comparisons when using the lower() function in the unique index.
    name text NOT NULL,
    phone text NULL,
    role text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'librarian')), -- CHECK that the role is one of the allowed values
    password_hash text NOT NULL CHECK (password_hash LIKE '$argon2id$%'), -- CHECK that the password hash is in the correct format for Argon2id
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at timestamptz NOT NULL DEFAULT now(), -- timestamptz is used instead of timestamp to store the timezone information, which is important for tracking when users were created and updated in a global context.
    updated_at timestamptz NOT NULL DEFAULT now()

);
CREATE UNIQUE INDEX users_email_lower_key ON users (lower(email)); -- Create a unique index on the lowercased email to enforce case-insensitive uniqueness

-- Down Migration

DROP TABLE users;
