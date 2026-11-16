// created 2 functions. routes call them and never create sql themselves.

import type { Pool } from "pg";


export type UserForLogin = {
  id: string;
  role: "member" | "librarian" | "admin";
  passwordHash: string;
  isActive: boolean;
};



//adds a user, and tells you whether it was actually created
export async function createUser(pool: Pool, user: { email: string; name: string; passwordHash: string }): Promise<boolean>{
    const query = `
        INSERT INTO users (email, name, password_hash)
        VALUES ($1, $2, $3)
        ON CONFLICT ((lower(email))) DO NOTHING
        RETURNING id
    `;
    const result = await pool.query<{ id: string }>(query, [user.email, user.name, user.passwordHash]);
    return result.rowCount === 1;
}


//gets the few fields login needs, or null if there’s no such user.
export async function findUserByEmail(pool: Pool, email: string): Promise<UserForLogin | null>{
    const query = `
        SELECT id, role, password_hash AS "passwordHash", is_active AS "isActive"
        FROM users
        WHERE lower(email) = lower($1)
    `;
    const result = await pool.query<UserForLogin>(query, [email]);
    return result.rows[0] ?? null;
}
