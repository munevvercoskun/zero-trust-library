//3 tests for the /ready endpoint:
//No pool → 503.
//A pool that works → 200 and { status: "ready" }.
//A pool that fails → 503 and { status: "unavailable" }

import type { Pool } from "pg";
import { createApp } from "../src/app.js";
import request from "supertest";
import {describe, it, expect} from "vitest";

const workingPool = { query: async () => ({}) } as unknown as Pool;
const brokenPool  = { query: async () => { throw new Error("db down"); } } as unknown as Pool;

describe("ready", () => {
    it("should return 503 if no pool is provided", async () => {
        await request(createApp()).get("/ready").expect(503).expect({ status: "unavailable" });
    });
    it("returns 200 and { status: 'ready' } if the pool works", async () => {
        await request(createApp(workingPool)).get("/ready").expect(200).expect({ status: "ready" });
    });
    it("returns 503 and { status: 'unavailable' } if the pool fails", async () => {
        await request(createApp(brokenPool)).get("/ready").expect(503).expect({ status: "unavailable" });
    });
});
