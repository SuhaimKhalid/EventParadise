"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const api_1 = __importDefault(require("../src/api"));
const connection_1 = __importDefault(require("../src/db/connection"));
const development_Data_1 = __importDefault(require("../src/db/Development-Data/development_Data"));
const seeds_1 = __importDefault(require("../src/db/seeds/seeds"));
describe("Payments Endpoints", () => {
    let token;
    beforeAll(async () => {
        await (0, seeds_1.default)(development_Data_1.default);
        // Login as a user to get token
        const loginResponse = await (0, supertest_1.default)(api_1.default)
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
        const response = await (0, supertest_1.default)(api_1.default)
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
        const response = await (0, supertest_1.default)(api_1.default).get("/api/payments/1").expect(200);
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
        const response = await (0, supertest_1.default)(api_1.default)
            .get("/api/users/1/payments")
            .expect(200);
        expect(Array.isArray(response.body.payments)).toBe(true);
    });
});
afterAll(async () => {
    await connection_1.default.end();
});
