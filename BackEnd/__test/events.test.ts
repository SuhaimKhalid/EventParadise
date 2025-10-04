const request = require('supertest');
const app = require('../app'); // Adjust the path as necessary

describe("Delete Event", () => {
    test("delete /api/events/:event_id", async () => {
        const result = await request(app).delete("/api/events/1").expect(204);
        const event = result.body;
        expect(event).toEqual({});
    });
});