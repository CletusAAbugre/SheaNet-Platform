const request = require("supertest");
const app = require("../server"); // Import the Express app

describe("API Endpoints", () => {
    it("should return a message from /api/message", async () => {
        const res = await request(app).get("/api/message");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("message", "Hello from the backend!");
    });

    it("should return 404 for an unknown route", async () => {
        const res = await request(app).get("/api/unknown");
        expect(res.statusCode).toEqual(404);
    });
});
