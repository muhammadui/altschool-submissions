import request from "supertest";
import mongoose from "mongoose";
import server from "../server.mjs";
import Blog from "../src/models/Blog.mjs";

let authToken = null; // Pass the token from user tests
let createdBlogId = null;

describe("Blog Operations", () => {
  beforeAll(async () => {
    // Setup test database connection
    await mongoose.connect(process.env.MONGODB_TEST_URI);

    // Authenticate and retrieve token
    const signupResponse = await request(server)
      .post("/api/users/signup")
      .send({
        first_name: "Test",
        last_name: "User",
        email: "test@example.com",
        password: "SecurePass123!",
      });

    authToken = signupResponse.body.token;
  });

  afterAll(async () => {
    // Clean up test database
    await Blog.deleteMany({});
    await mongoose.connection.close();
    server.close();
  });

  it("should create a blog", async () => {
    const response = await request(server)
      .post("/api/blogs")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Test Blog",
        body: "This is a test blog post content.",
        tags: ["test", "example"],
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.blog.title).toBe("Test Blog");
    createdBlogId = response.body.blog._id;
  });

  it("should update a blog", async () => {
    const response = await request(server)
      .patch(`/api/blogs/${createdBlogId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Updated Test Blog",
        state: "published",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.blog.title).toBe("Updated Test Blog");
    expect(response.body.blog.state).toBe("published");
  });

  it("should get user blogs", async () => {
    const response = await request(server)
      .get("/api/blogs/user/blogs")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.blogs.length).toBeGreaterThan(0);
  });

  it("should get published blogs", async () => {
    const response = await request(server).get("/api/blogs");

    expect(response.statusCode).toBe(200);
    expect(response.body.blogs.length).toBeGreaterThan(0);
  });

  it("should get single blog", async () => {
    const response = await request(server).get(`/api/blogs/${createdBlogId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Updated Test Blog");
  });

  it("should delete a blog", async () => {
    const response = await request(server)
      .delete(`/api/blogs/${createdBlogId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Blog deleted successfully");
  });
});
