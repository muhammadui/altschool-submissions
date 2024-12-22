import request from "supertest";
import mongoose from "mongoose";
import server from "../server.mjs";
import User from "../src/models/User.mjs";

describe("User Authentication", () => {
  let authToken;
  let createdUserId;

  beforeAll(async () => {
    // Setup test database connection
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterAll(async () => {
    // Clean up test database
    await User.deleteMany({});
    await mongoose.connection.close();
    server.close();
  });

  it("should signup a new user", async () => {
    const response = await request(server).post("/api/users/signup").send({
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      password: "SecurePass123!",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.token).toBeTruthy();
    createdUserId = response.body.user.id;
    authToken = response.body.token;
  });

  it("should prevent duplicate user signup", async () => {
    const response = await request(server).post("/api/users/signup").send({
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      password: "SecurePass123!",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("User already exists");
  });

  it("should signin the user", async () => {
    const response = await request(server).post("/api/users/signin").send({
      email: "test@example.com",
      password: "SecurePass123!",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeTruthy();
  });
});

export { authToken, createdUserId };
