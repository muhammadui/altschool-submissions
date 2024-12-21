const request = require("supertest");
const app = require("../../app");
const Todo = require("../../models/Todo");
const User = require("../../models/User");

describe("Todo Controller", () => {
  let authToken;
  let user;

  beforeEach(async () => {
    await Todo.deleteMany({});
    await User.deleteMany({});

    user = await User.create({
      fullname: "Test User",
      email: "test@example.com",
      password: "Test123!@#",
    });

    const loginRes = await request(app).post("/login").send({
      email: "test@example.com",
      password: "Test123!@#",
    });

    const cookies = loginRes.headers["set-cookie"];
    authToken = cookies[0];
  });

  describe("POST /todos", () => {
    it("should create todo", async () => {
      const res = await request(app)
        .post("/todos")
        .set("Cookie", authToken)
        .send({
          title: "Test Todo",
          description: "Test Description",
        });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe("Test Todo");
    });
  });

  describe("GET /todos", () => {
    it("should get all todos", async () => {
      await Todo.create([
        { title: "Todo 1", user: user._id },
        { title: "Todo 2", user: user._id },
      ]);

      const res = await request(app).get("/todos").set("Cookie", authToken);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });
});
