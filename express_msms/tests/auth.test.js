const request = require("supertest");
const express = require("express");
const { setupApp } = require("../src/app");

const { userController } = require("../src/controllers/user.controller");
const { userRouter } = require("../src/routes/user.routes");

const { customerService } = require("../src/services/customer.service");
const {
  customerController,
} = require("../src/controllers/customer.controller");
const { customerRouter } = require("../src/routes/customer.routes");

const { routes } = require("../src/routes/routes");

const userService = {
  findUserByEmail: jest.fn(() => ({
    email: "a@a.com",
    password: "$2b$10$fxNNwQpeEd.OxOq1gON73ObMgfW5leolB9wAe5/p8lwuMdyCuKn9K",
  })),
};

const _userRouter = userRouter(userController(userService));

const _customerRouter = customerRouter(customerController(customerService()));

const _router = routes(_userRouter, _customerRouter);

/**
 * This is an integeration test to test auth flow
 */
describe("Auth with cookies", () => {
  let authCookie; // Store the auth token

  test("Login should set authToken cookie", async () => {
    const response = await request(setupApp(_router))
      .post("/api/user/log-in")
      .send({ email: "a@a.com", password: "string" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("acc_token");

    // Extract and store the cookie
    authCookie = response.headers["set-cookie"].find((cookie) =>
      cookie.startsWith("token")
    );
    expect(authCookie).toBeDefined();
  });

  test("Protected route should deny access without authToken", async () => {
    // const response = await request(setupApp(_router)).get("/api/user/log-out");
    const response = await request(setupApp(_router)).post("/api/user/log-out");
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ errors: [{ msg: "Access denied" }] });
  });

  test("Protected route should grant access with authToken", async () => {
    console.log(authCookie);
    expect(authCookie).toBeDefined();

    const response = await request(setupApp(_router))
      .post("/api/user/log-out")
      .set("Cookie", authCookie); // Send the stored cookie

    expect(response.body).not.toEqual({ errors: [{ msg: "Access denied" }] });
    expect(response.statusCode).toBe(200);
  });
});
