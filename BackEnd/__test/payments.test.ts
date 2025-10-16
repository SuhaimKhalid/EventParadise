import request from "supertest";
import app from "../src/api";
import db from "../src/db/connection";
import data from "../src/db/Development-Data/development_Data";
import seed from "../src/db/seeds/seeds";

describe("Payments Endpoints", () => {
  let token: string;
  beforeAll(async () => {
    await seed(data);
    // Login as a user to get token
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: "alice@example.com", password: "hashed_pw1" });
    token = loginResponse.body.token;
  });

  test("POST /api/payments/create - create payment", async () => {
    const paymentData = {
      user_id: 1,
      event_id: 1,
      amount: 100,
    };
    const response = await request(app)
      .post("/api/payments/create")
      .set("Authorization", `Bearer ${token}`)
      .send(paymentData)
      .expect(201);
    expect(response.body.payment).toMatchObject({
      payment_id: expect.any(Number),
      user_id: 1,
      event_id: 1,
      amount: "100",
      status: "pending",
      created_at: expect.any(String),
    });
  });

  test("GET /api/payments/:id - get payment status", async () => {
    const response = await request(app).get("/api/payments/1").expect(200);
    expect(response.body.payment).toMatchObject({
      payment_id: 1,
      user_id: expect.any(Number),
      event_id: expect.any(Number),
      amount: expect.any(Number),
      status: expect.any(String),
      created_at: expect.any(String),
    });
  });

  test("GET /api/users/:id/payments - get user payments", async () => {
    const response = await request(app)
      .get("/api/users/1/payments")
      .expect(200);
    expect(Array.isArray(response.body.payments)).toBe(true);
  });
});

afterAll(async () => {
  await db.end();
});
