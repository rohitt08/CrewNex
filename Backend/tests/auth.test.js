const request = require("supertest");
const app = require("../server");

describe("Auth Endpoints", () => {
  let userToken;
  const testUser = {
    name: "Test User",
    email: "testuser@example.com",
    password: "password123",
    role: "seeker",
  };

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);
    
    expect(res.statusCode).toEqual(201);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("email", testUser.email);
    expect(res.body.user).toHaveProperty("email", testUser.email);
  });

  it("should not register a user with an existing email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);
    
    expect(res.statusCode).toEqual(400);
  });

  it("should login an existing user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    userToken = res.body.token; // Save for future tests if needed
  });

  it("should fail to login with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: "wrongpassword",
      });
    
    expect(res.statusCode).toEqual(400);
  });
});
