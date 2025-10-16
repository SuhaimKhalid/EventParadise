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
describe("Join Event", () => {
    beforeAll(async () => {
        await (0, seeds_1.default)(development_Data_1.default);
    });
    test("Join Event", async () => {
        // Login as member
        const loginResponse = await (0, supertest_1.default)(api_1.default)
            .post("/api/auth/login")
            .send({ email: "charlie@example.com", password: "hashed_pw3" })
            .expect(200);
        const token = loginResponse.body.token;
        const result = await (0, supertest_1.default)(api_1.default)
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
    let token;
    beforeAll(async () => {
        await (0, seeds_1.default)(development_Data_1.default);
        // Login as staff to get token
        const loginResponse = await (0, supertest_1.default)(api_1.default)
            .post("/api/auth/login")
            .send({ email: "bob@example.com", password: "hashed_pw2" });
        token = loginResponse.body.token;
    });
    test("delete /api/events/:event_id", async () => {
        const result = await (0, supertest_1.default)(api_1.default)
            .delete("/api/events/1")
            .set("Authorization", `Bearer ${token}`)
            .expect(204);
        const event = result.body;
        expect(event).toEqual({});
    });
});
describe("Event Dates", () => {
    beforeAll(async () => {
        await (0, seeds_1.default)(development_Data_1.default);
    });
    test("GET /api/events includes start_date and end_date", async () => {
        const result = await (0, supertest_1.default)(api_1.default).get("/api/events").expect(200);
        const events = result.body.events;
        expect(events).toHaveLength(2);
        events.forEach((event) => {
            expect(event).toHaveProperty("start_date");
            expect(event).toHaveProperty("end_date");
            expect(typeof event.start_date).toBe("string");
            expect(typeof event.end_date).toBe("string");
        });
    });
});
afterAll(async () => {
    await connection_1.default.end();
});
