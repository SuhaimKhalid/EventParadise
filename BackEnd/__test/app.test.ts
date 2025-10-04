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
  describe("Post /api/users", () => {
    test("Register user as Member", async () => {
      const registerUser = {
        name: "Suhaim",
        email: "suhaimkhalid007@gmail.com",
        password: "Suhaim",
        role: "member",
      };
      const result = await request(app)
        .post("/api/auth/register")
        .send(registerUser)
        .expect(201);
      const user = result.body.user;
      expect(user).toMatchObject({
        user_id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        role: expect.any(String),
        created_at: expect.any(String),
      });
    });
    test("Login User as Member", async () => {
      const registerUser = {
        name: "Suhaim",
        email: "suhaimkhalid007@gmail.com",
        password: "Suhaim",
        role: "member",
      };

      await request(app).post("/api/auth/register").send(registerUser);

      const loginUser = {
        email: "suhaimkhalid007@gmail.com",
        password: "Suhaim",
      };
      const result = await request(app)
        .post("/api/auth/login")
        .send(loginUser)
        .expect(200);
      console.log(result.body);
      const user = result.body.user;
      expect(user).toMatchObject({
        user_id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        role: expect.any(String),
        created_at: expect.any(String),
      });
      expect(result.body.token).toBeDefined();
      expect(typeof result.body.token).toBe("string");
    });
  });
});
