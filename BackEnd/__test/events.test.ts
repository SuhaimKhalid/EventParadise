import request from "supertest";
import app from "../src/api";
import db from "../src/db/connection";
import data from "../src/db/Development-Data/development_Data";
import seed from "../src/db/seeds/seeds";

describe("Join Event", () => {
  beforeAll(async () => {
    await seed(data);
  });

  test("Join Event", async () => {
    // Login as member
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: "charlie@example.com", password: "hashed_pw3" })
      .expect(200);
    const token = loginResponse.body.token;

    const result = await request(app)
      .post("/api/events/2/register")
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
  let token: string;
  beforeAll(async () => {
    await seed(data);
    // Login as staff to get token
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: "bob@example.com", password: "hashed_pw2" });
    token = loginResponse.body.token;
  });

  test("delete /api/events/:event_id", async () => {
    const result = await request(app)
      .delete("/api/events/1")
      .set("Authorization", `Bearer ${token}`)
      .expect(204);
    const event = result.body;
    expect(event).toEqual({});
  });
});

describe("Event Dates", () => {
  beforeAll(async () => {
    await seed(data);
  });

  test("GET /api/events includes start_date and end_date", async () => {
    const result = await request(app).get("/api/events").expect(200);
    const events = result.body.events;
    expect(events).toHaveLength(2);
    events.forEach((event: any) => {
      expect(event).toHaveProperty("start_date");
      expect(event).toHaveProperty("end_date");
      expect(typeof event.start_date).toBe("string");
      expect(typeof event.end_date).toBe("string");
    });
  });
});

describe("Get Events Created By User", () => {
  let token: string;
  beforeAll(async () => {
    await seed(data);
    // Login as staff to get token
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: "bob@example.com", password: "hashed_pw2" });
    token = loginResponse.body.token;
  });

  test("GET /api/users/:user_id/created-events", async () => {
    const result = await request(app)
      .get("/api/users/2/created-events")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    const events = result.body.events;
    expect(events).toHaveLength(2);
    events.forEach((event: any) => {
      expect(event).toHaveProperty("event_id");
      expect(event).toHaveProperty("title");
      expect(event).toHaveProperty("creator_id", 2);
    });
  });
});

describe("Error Handling", () => {
  beforeAll(async () => {
    await seed(data);
  });

  test("GET /api/events/:event_id with invalid ID", async () => {
    const result = await request(app).get("/api/events/invalid").expect(400);
    expect(result.body.msg).toBe("Invalid Event ID");
  });

  test("GET /api/events/:event_id with non-existent ID", async () => {
    const result = await request(app).get("/api/events/9999").expect(404);
    expect(result.body.msg).toBe("Event not found");
  });

  test("PATCH /api/events/:event_id with invalid ID", async () => {
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: "bob@example.com", password: "hashed_pw2" });
    const token = loginResponse.body.token;

    const result = await request(app)
      .patch("/api/events/invalid")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Title" })
      .expect(400);
    expect(result.body.msg).toBe("Invalid Event ID");
  });

  test("PATCH /api/events/:event_id with non-existent ID", async () => {
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: "bob@example.com", password: "hashed_pw2" });
    const token = loginResponse.body.token;

    const result = await request(app)
      .patch("/api/events/9999")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Title" })
      .expect(404);
    expect(result.body.msg).toBe("Event not found");
  });

  test("DELETE /api/events/:event_id with invalid ID", async () => {
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: "bob@example.com", password: "hashed_pw2" });
    const token = loginResponse.body.token;

    const result = await request(app)
      .delete("/api/events/invalid")
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
    expect(result.body.msg).toBe("Invalid Event ID");
  });

  test("POST /api/events/:event_id/register with invalid ID", async () => {
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: "charlie@example.com", password: "hashed_pw3" });
    const token = loginResponse.body.token;

    const result = await request(app)
      .post("/api/events/invalid/register")
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
    expect(result.body.msg).toBe("Invalid Event ID");
  });

  test("POST /api/events/:event_id/register with non-existent event", async () => {
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: "charlie@example.com", password: "hashed_pw3" });
    const token = loginResponse.body.token;

    const result = await request(app)
      .post("/api/events/9999/register")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
    expect(result.body.msg).toBe("Event not found");
  });

  test("GET /api/users/:user_id/created-events with invalid ID", async () => {
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: "bob@example.com", password: "hashed_pw2" });
    const token = loginResponse.body.token;

    const result = await request(app)
      .get("/api/users/invalid/created-events")
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
    expect(result.body.msg).toBe("Invalid User ID");
  });
});

afterAll(async () => {
  await db.end();
});
