import request from "supertest";
import db from "../src/db/connection";
import app from "../api";

import data from "../src/db/Development-Data/development_Data";
import seed from "../src/db/seeds/seeds";
import { User } from "../src/db/tableTypes";
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
    test("Return Single User by ID", async () => {
      const result = await request(app).get("/api/users/1").expect(200);

      const user = result.body.user;
      expect(user.name).toBe("Alice Johnson");
      expect(user).toMatchObject({
        user_id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        password: expect.any(String),
        role: expect.any(String),
        created_at: expect.any(String),
      });
    });
  });
  describe("Patch /api/users/:user_id", () => {
    test("Update User by ID", async () => {
      const updateUser = {
        name: "Suhaim",
        email: "suhaimkhalid007@gmail.com",
        role: "staff",
      };

      const result = await request(app)
        .patch("/api/users/1")
        .send(updateUser)
        .expect(200);
      const user = result.body.user;
      console.log(user);
      expect(user).toMatchObject({
        user_id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        password: expect.any(String),
        role: expect.any(String),
        created_at: expect.any(String),
      });
    });
  });
});
