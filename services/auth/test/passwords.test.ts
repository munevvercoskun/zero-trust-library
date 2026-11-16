//4 tests for the password hashing and verification functions.

import { hashPassword, verifyPassword } from "../src/passwords.js";
import {describe, it, expect} from "vitest";


const PASSWORD = "spec rejects a password under 12 chr";

describe("hashPassword", () => {
    it("hashes a password", async () => {  //The hash starts with $argon2id$.
        const hash = await hashPassword(PASSWORD);
        expect(hash.startsWith("$argon2id$")).toBe(true);
    });
    it("hashes the same password differently each time", async () => {   //Hashing the same password twice gives different strings,because of the random salt.
        const hash1 = await hashPassword(PASSWORD);
        const hash2 = await hashPassword(PASSWORD);
        expect(hash1).not.toBe(hash2);
    });
});


describe("verifyPassword", () => {
    it("verifies a correct password", async () => {   //verifyPassword returns true for the right password and false for a wrong one.
        const hash = await hashPassword(PASSWORD);
        const result = await verifyPassword(hash, PASSWORD);
        expect(result).toBe(true);
    });
    it("verifies an incorrect password", async () => {   //verifyPassword returns true for the right password and false for a wrong one.
        const hash = await hashPassword(PASSWORD);
        const result = await verifyPassword(hash, "wrong-password");
        expect(result).toBe(false);
    });
    it("returns false for a garbage hash", async () => {    //verifyPassword against a garbage string like "not-a-hash" returns false, without crashing.
        const result = await verifyPassword("not-a-hash", PASSWORD);
        expect(result).toBe(false);
    });
});
