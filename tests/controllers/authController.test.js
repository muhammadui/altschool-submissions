const request = require("supertest");
const app = require("../../app");
const User = require("../../models/User");
const { generateToken } = require("../../utils/jwt");

describe("Auth Controller", () => {
  const validUser = {
    fullname: "Test User",
    email: "test@example.com",
    password: "Test123!@#",
  };

  describe("POST /signup", () => {
    it("should create new user", async () => {
      const res = await request(app).post("/signup").send(validUser);
      expect(res.status).toBe(302);

      const user = await User.findOne({ email: validUser.email });
      expect(user).toBeTruthy();
    });

    it("should validate user input", async () => {
      const res = await request(app).post("/signup").send({
        fullname: "123", // invalid
        email: "invalid",
        password: "weak",
      });
      expect(res.status).toBe(400);
    });
  });

  describe("POST /login", () => {
    beforeEach(async () => {
      await User.deleteMany({});
      await request(app).post("/signup").send(validUser);
    });

    it("should login with valid credentials", async () => {
      const res = await request(app).post("/login").send({
        email: validUser.email,
        password: validUser.password,
      });
      expect(res.status).toBe(302);
      expect(res.headers.location).toBe("/todos");
    });
  });
});
