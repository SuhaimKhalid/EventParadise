import request from "supertest";
import db from "../src/db/connection";
import app from "../api";

import data from "../src/db/Development-Data/development_Data";
import seed from "../src/db/seeds/seeds";

beforeEach(async () => {
  await seed(data);
});

afterAll(async () => {
  await db.end();
});

describe("Users Table Endpoints", () => {
  describe("GET /api/users", () => {
    test("Returns all users", async () => {
      const result = await request(app).get("/api/users").expect(200);

      const users = result.body.users;

      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);

      expect(users[0]).toMatchObject({
        user_id: expect.any(Number), // Correct type
        name: expect.any(String),
        email: expect.any(String),
        password: expect.any(String),
        role: expect.any(String),
        created_at: expect.any(String), // Timestamp is stored as string
      });
    });
  });
});
