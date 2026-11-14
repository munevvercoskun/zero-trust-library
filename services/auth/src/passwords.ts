// creeated two small functions, so the rest of the code never touches argon2 directly

import argon2, { hash } from "argon2";


export async function hashPassword(plain: string): Promise<string> {
    return argon2.hash(plain, { type: argon2.argon2id });
}


export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
    try {
        return await argon2.verify(hash, plain);
    } catch (error) {
        console.error("Error verifying password:", error);
        return false;
    }
}
