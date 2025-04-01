const request = require("supertest");
const app = require("../server");

describe("User API", () => {
    it("should register a user", async () => {
        const res = await request(app)
            .post("/api/users/register")
            .send({
                name: "Denaton Brunelle",
                email: "denaton@example.com",
                password: "password456",
                role: "seller"
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("user");
    });
});
