//the app refuses any request that doesn’t match "docs/openapi.yaml",
// and its error responses never contain more than they should.

import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";


const validUser = {
  email: "mona@gmail.com",
  name: "Mona",
  password: "spec rejects a password under 12 chr"
}

//request validation with body.error.message mentioning
describe("request validation", () => {
  it("rejects an unexpeced role field", async () => {
    const res = await request(createApp())
      .post("/api/auth/register")
      .send({ ...validUser, role:"admin"});

    expect(res.status).toBe(400);
    expect(res.body.error.message).toContain("additional properties");
  });

  //too short password
  it("rejects a password shorter than 12 characters", async () => {
    const res = await request(createApp())
      .post("/api/auth/register")
      .send({ ...validUser, password:"short"});

    expect(res.status).toBe(400);
    expect(res.body.error.message).toContain("password");
  });

  //The route doesn't exists
  it("route doesn't exists", async () => {
    const res = await request(createApp())
      .post("/api/nope").send({})

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("not_found");
  });

  //Nothing extra in errors or different error shapes
  it("Any other 400 errors", async () => {
    const res = await request(createApp())
    .post("/api/auth/register")
    .send({ ...validUser, role:"admin"});

    expect(Object.keys(res.body)).toEqual(["error"]);
    expect(Object.keys(res.body.error).sort()).toEqual(["code","message"]);

  })

});
