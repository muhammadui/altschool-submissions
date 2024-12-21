const User = require("../../models/User");

describe("User Model", () => {
  it("should hash password before saving", async () => {
    const user = new User({
      fullname: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    await user.save();
    expect(user.password).not.toBe("password123");
  });

  it("should validate required fields", async () => {
    const user = new User({});
    let err;

    try {
      await user.validate();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });
});
