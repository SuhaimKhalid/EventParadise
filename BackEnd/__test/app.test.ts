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

// User Table
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

///////////////////

// Event Table
describe("Event Table Endpoints", () => {
  describe("GET /api/events", () => {
    test("Returns all events", async () => {
      const result = await request(app).get("/api/events").expect(200);

      const events = result.body.events;
      console.log(events);
      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThan(0);
      expect(events[0]).toMatchObject({
        event_id: expect.any(Number),
        title: expect.any(String),
        description: expect.any(String),
        date: expect.any(String),
        location: expect.any(String),
        type: expect.any(String),
        price: expect.any(Number),
        creator_id: expect.any(Number),
        created_at: expect.any(String), // Timestamp is stored as string
      });
    });
    test("Return Single Event by ID", async () => {
      const result = await request(app).get("/api/events/1").expect(200);

      const event = result.body.event;
      console.log("Single Event", event);
      expect(event.title).toBe("Music Festival");
      expect(event).toMatchObject({
        event_id: expect.any(Number),
        title: expect.any(String),
        description: expect.any(String),
        date: expect.any(String),
        location: expect.any(String),
        type: expect.any(String),
        price: expect.any(Number),
        creator_id: expect.any(Number),
        created_at: expect.any(String), // Timestamp is stored as string
      });
    });
  });
  describe("Patch /api/events/:event_id", () => {
    test("Update Event by ID (Staff Only)", async () => {
      const updateEvent = {
        title: "Suhaim-Tournament",
        description: "Death Match",
      };

      const result = await request(app)
        .patch("/api/events/1")
        .send(updateEvent)
        .expect(200);

      const event = result.body.event;
      console.log("Patch Event", event);

      expect(event).toMatchObject({
        event_id: expect.any(Number),
        title: "Suhaim-Tournament",
        description: "Death Match",
        date: expect.any(String),
        location: expect.any(String),
        type: expect.any(String),
        price: expect.any(Number),
        creator_id: expect.any(Number),
        created_at: expect.any(String),
      });
    });
  });
  describe("Post /api/events", () => {
    test("ADD Event", async () => {
      // Login as staff
      const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({ email: "bob@example.com", password: "hashed_pw2" })
        .expect(200);
      const token = loginResponse.body.token;

      const addEvent = {
        title: "Game Festival",
        description: "Death Match",
        date: new Date("2025-12-01T18:00:00Z"),
        location: "Central Park",
        type: "paid" as const,
        price: 50,
        creator_id: 2, // Bob's user_id
      };
      const result = await request(app)
        .post("/api/events/addEvent")
        .set("Authorization", `Bearer ${token}`)
        .send(addEvent)
        .expect(201);
      const event = result.body.event;
      console.log(event);
      expect(event).toMatchObject({
        event_id: expect.any(Number),
        title: "Game Festival",
        description: "Death Match",
        date: expect.any(String),
        location: expect.any(String),
        type: expect.any(String),
        price: expect.any(Number),
        creator_id: expect.any(Number),
        created_at: expect.any(String),
      });
    });
  });
  describe("Post /api/events/:event_id/join", () => {
    test("Join Event", async () => {
      // Login as member
      const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({ email: "alice@example.com", password: "hashed_pw1" })
        .expect(200);
      const token = loginResponse.body.token;

      const result = await request(app)
        .post("/api/events/2/join")
        .set("Authorization", `Bearer ${token}`)
        .expect(201);
      const event_member = result.body.event_member;
      console.log(event_member);
      expect(event_member).toMatchObject({
        event_member_id: expect.any(Number),
        event_id: 2,
        user_id: expect.any(Number),
        joined_at: expect.any(String),
      });
    });
  });
  describe("Delete Event", () => {
    test("delete /api/event/:event_id", async () => {
      const result = await request(app).delete("/api/events/1").expect(204);
      const event = result.body;
      expect(event).toEqual({});
    });
  });
});
