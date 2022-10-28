const jwt = require("jsonwebtoken");
const { createToken, createRefreshToken } = require("./tokens");
const { BadRequestError } = require("../expressError");
require("dotenv").config();

/** create token */
describe("createToken", () => {
  test("should create token for non-admin user", () => {
    const token = createToken({
      empNumber: 105,
      email: "usertest@email.com",
      isAdmin: false,
    });
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    expect(payload).toEqual({
      iat: expect.any(Number),
      exp: expect.any(Number),
      empNumber: 105,
      email: "usertest@email.com",
      isAdmin: false,
    });
  });

  test("should create token for admin user", () => {
    const token = createToken({
      empNumber: 105,
      email: "usertest@email.com",
      isAdmin: true,
    });
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    expect(payload).toEqual({
      iat: expect.any(Number),
      exp: expect.any(Number),
      empNumber: 105,
      email: "usertest@email.com",
      isAdmin: true,
    });
  });

  test("should throw BadRequestError if missing user data", () => {
    try {
      const token = createToken({ email: "usertest@email.com" });
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/** create refresh token */
describe("createRefreshToken", () => {
  test("should create refresh token for non-admin user", () => {
    const token = createRefreshToken({
      empNumber: 105,
      email: "usertest@email.com",
      isAdmin: false,
    });
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    expect(payload).toEqual({
      iat: expect.any(Number),
      exp: expect.any(Number),
      empNumber: 105,
      email: "usertest@email.com",
      isAdmin: false,
    });
  });

  test("should create refresh token for admin user", () => {
    const token = createRefreshToken({
      empNumber: 105,
      email: "usertest@email.com",
      isAdmin: true,
    });
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    expect(payload).toEqual({
      iat: expect.any(Number),
      exp: expect.any(Number),
      empNumber: 105,
      email: "usertest@email.com",
      isAdmin: true,
    });
  });

  test("should throw BadRequestError if missing user data", () => {
    try {
      const token = createRefreshToken({ email: "usertest@email.com" });
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
