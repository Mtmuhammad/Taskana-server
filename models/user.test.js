"use strict";
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db");
const User = require("./user");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1refreshToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/********** authenticate ***********/
describe("authenticate", () => {
  test("should login user", async () => {
    const user = await User.authenticate("u1@yahoo.com", "u1password");
    expect(user).toEqual({
      empNumber: 101,
      firstName: "u1first",
      lastName: "u1last",
      email: "u1@yahoo.com",
      empRole: "UI/UX Developer",
      isAdmin: false,
    });
  });
  test("should login admin user", async () => {
    const user = await User.authenticate("admin@yahoo.com", "adminpassword");
    expect(user).toEqual({
      empNumber: 100,
      firstName: "adminFirst",
      lastName: "adminLast",
      email: "admin@yahoo.com",
      empRole: "Web Developer",
      isAdmin: true,
    });
  });
  test("should fail if wrong email", async () => {
    try {
      await User.authenticate("wrong@email.com", "u1password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
  test("should fail if wrong password", async () => {
    try {
      await User.authenticate("admin@email.com", "wrongpassword");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/********** register ***********/
describe("register", () => {
  const newUser = {
    firstName: "u2first",
    lastName: "u2last",
    email: "u2@yahoo.com",
    password: "u2password",
    empRole: "Quality Assurance",
    isAdmin: false,
  };

  const newAdmin = {
    firstName: "admin2first",
    lastName: "admin2last",
    email: "admin2@yahoo.com",
    password: "admin2password",
    empRole: "Web Developer",
    isAdmin: true,
  };

  test("should register user", async () => {
    const user = await User.register(newUser);
    expect(user).toEqual({
      empNumber: 102,
      firstName: "u2first",
      lastName: "u2last",
      email: "u2@yahoo.com",
      empRole: "Quality Assurance",
      isAdmin: false,
    });
    const found = await db.query(
      "SELECT * FROM users WHERE email = 'u2@yahoo.com'"
    );
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(false);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("should register admin user", async () => {
    const user = await User.register(newAdmin);
    expect(user).toEqual({
      empNumber: 103,
      firstName: "admin2first",
      lastName: "admin2last",
      email: "admin2@yahoo.com",
      empRole: "Web Developer",
      isAdmin: true,
    });
    const found = await db.query(
      "SELECT * FROM users WHERE email = 'admin2@yahoo.com'"
    );
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(true);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("should throw bad request with duplicate data", async function () {
    try {
      await User.register(newUser);
      await User.register(newUser);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/********** findAll ***********/

describe("findAll", () => {
  test("should get all users", async () => {
    const users = await User.findAll();
    expect(users.length).toBe(2);
    expect(users).toEqual([
      {
        empNumber: 100,
        firstName: "adminFirst",
        lastName: "adminLast",
        email: "admin@yahoo.com",
        empRole: "Web Developer",
        isAdmin: true,
      },
      {
        empNumber: 101,
        firstName: "u1first",
        lastName: "u1last",
        email: "u1@yahoo.com",
        empRole: "UI/UX Developer",
        isAdmin: false,
      },
    ]);
  });
});

/********** get ***********/
describe("get", () => {
  test("should find a user", async () => {
    const user = await User.get(100);

    expect(user).toEqual({
      firstName: "adminFirst",
      lastName: "adminLast",
      email: "admin@yahoo.com",
      empRole: "Web Developer",
      isAdmin: true,
    });
  });

  test("should throw not found", async () => {
    try {
      await User.get(2);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/********** update ***********/
describe("update", () => {
  test("should update one user field", async () => {
    const user = await User.update(101, { email: "u1new@yahoo.com" });
    expect(user).toEqual({
      empNumber: 101,
      firstName: "u1first",
      lastName: "u1last",
      email: "u1new@yahoo.com",
      empRole: "UI/UX Developer",
      isAdmin: false,
    });
  });
  test("should update multiple user fields", async () => {
    const user = await User.update(101, {
      firstName: "u1newfirst",
      lastName: "u1newlast",
      email: "u1new@yahoo.com",
      empRole: "UI/UX Developer",
      isAdmin: true,
    });
    expect(user).toEqual({
      empNumber: 101,
      firstName: "u1newfirst",
      lastName: "u1newlast",
      email: "u1new@yahoo.com",
      empRole: "UI/UX Developer",
      isAdmin: true,
    });
  });

  test("should throw not found", async () => {
    try {
      await User.update(2, { email: "u1new@yahoo.com" });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/********** delete ***********/

describe("remove", () => {
  test("should remove user", async () => {
    await User.remove(101);
    const res = await db.query("SELECT * FROM users WHERE emp_number=101");
    expect(res.rows.length).toEqual(0);
  });

  test("should throw not found", async () => {
    try {
      await User.remove(5);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/********** save refresh token ***********/

describe("saveRefreshToken", () => {
  test("should save user refresh token", async () => {
    const { refreshToken } = await User.saveRefreshToken(100, u1refreshToken);
    const res = await db.query("SELECT token FROM users WHERE emp_number=100");
    expect(res.rows.length).toEqual(1);
    expect(res.rows[0].token).toEqual(refreshToken);
  });

  test("should throw not found", async () => {
    try {
      await User.saveRefreshToken(104, u1refreshToken);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/********** find token ***********/

describe("findToken", () => {
  test("should find and return user given a refresh token", async () => {
    await User.saveRefreshToken(100, u1refreshToken);
    const foundUser = await User.findToken(u1refreshToken);
    expect(foundUser).toEqual({
      empNumber: 100,
      empRole: "Web Developer",
      firstName: "adminFirst",
      isAdmin: true,
      lastName: "adminLast",
      email: "admin@yahoo.com",
    });
  });

  test("should throw not found", async () => {
    try {
      await User.findToken(u1refreshToken);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/********** remove refresh token ***********/

describe("removeRefreshToken", () => {
  test("should remove refresh token", async () => {
    await User.saveRefreshToken(100, u1refreshToken);
    await User.removeRefreshToken(100);
    const res = await db.query(
      `SELECT token FROM users WHERE emp_number = 100`
    );
    expect(res.rows[0]).toEqual({ token: null });
  });

  test("should throw not found", async () => {
    try {
      await User.removeRefreshToken(102);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
