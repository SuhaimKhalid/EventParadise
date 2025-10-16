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
describe("Emails Endpoints", () => {
    beforeAll(async () => {
        await (0, seeds_1.default)(development_Data_1.default);
    });
    test("POST /api/emails/send - send email log", async () => {
        const emailData = {
            user_id: 1,
            event_id: 1,
            status: "sent",
        };
        const response = await (0, supertest_1.default)(api_1.default)
            .post("/api/emails/send")
            .send(emailData)
            .expect(201);
        expect(response.body.emailLog).toMatchObject({
            email_id: expect.any(Number),
            user_id: 1,
            event_id: 1,
            status: "sent",
            sent_at: expect.any(String),
        });
    });
    test("GET /api/emails/:id - get email status", async () => {
        const response = await (0, supertest_1.default)(api_1.default).get("/api/emails/1").expect(200);
        expect(response.body.emailLog).toMatchObject({
            email_id: 1,
            user_id: expect.any(Number),
            event_id: expect.any(Number),
            status: expect.any(String),
            sent_at: expect.any(String),
        });
    });
});
afterAll(async () => {
    await connection_1.default.end();
});
