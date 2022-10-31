"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");
const User = require("../models/user");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  u3Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/***** POST /users  ********/

describe("POST /users", () => {
  test("should work for admin user to create non admin", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        firstName: "Marcellus",
        lastName: "Muhammad",
        email: "marcellustm@yahoo.com",
        password: "Anaksat1!",
        empRole: "Software Developer",
        isAdmin: false,
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      role: 2022,
      user: {
        empNumber: 103,
        firstName: "Marcellus",
        lastName: "Muhammad",
        email: "marcellustm@yahoo.com",
        empRole: "Software Developer",
        isAdmin: false,
      },
      token: expect.any(String),
    });
  });

  test("should work for admin user to create admin", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        firstName: "Marcellus",
        lastName: "Muhammad",
        email: "marcellustm@yahoo.com",
        password: "Anaksat1!",
        empRole: "Web Designer",
        isAdmin: true,
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      role: 1990,
      user: {
        empNumber: 104,
        firstName: "Marcellus",
        lastName: "Muhammad",
        email: "marcellustm@yahoo.com",
        empRole: "Web Designer",
        isAdmin: true,
      },
      token: expect.any(String),
    });
  });

  test("should throw ForbiddenError for user not admin", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        firstName: "Marcellus",
        lastName: "Muhammad",
        email: "marcellustm@yahoo.com",
        password: "Anaksat1!",
        empRole: "Web Designer",
        isAdmin: true,
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toBe(403);
  });

  test("should throw UnauthorizedError for anon user", async () => {
    const res = await request(app).post("/users").send({
      firstName: "Marcellus",
      lastName: "Muhammad",
      email: "marcellustm@yahoo.com",
      password: "Anaksat1!",
      empRole: "Web Designer",
      isAdmin: true,
    });
    expect(res.statusCode).toBe(401);
  });

  test("should throw BadRequestError if data missing", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        firstName: "Marcellus",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toBe(400);
  });

  test("should throw BadRequestError for invalid data", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        firstName: "Marce-llus",
        lastName: "Muha-mmad",
        email: "marcellustcom",
        password: "Anaksat1!",
        empRole: "Web Designer",
        isAdmin: true,
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toBe(400);
  });
});

/***** GET /users  ********/
describe("GET /users", () => {
  test("should return all users", async () => {
    const res = await request(app)
      .get("/users")
      .set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      users: [
        {
          empNumber: 100,
          firstName: "adminFirst",
          lastName: "adminLast",
          email: "admintest@email.com",
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
        {
          empNumber: 102,
          firstName: "u2first",
          lastName: "u2last",
          email: "u2@yahoo.com",
          empRole: "Backend Developer",
          isAdmin: false,
        },
      ],
    });
  });

  test("should throw UnauthorizedError for anon user", async () => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(401);
  });

  test("should throw NotFoundError for invalid url", async () => {
    const res = await request(app)
      .get("/user")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(404);
  });

  test("should fail: test next() handler", async () => {
    await db.query("DROP TABLE users CASCADE");
    const res = await request(app)
      .get("/users")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toBe(500);
  });
});

/***** GET /users/:empNumber  ********/

describe("GET /users/:empNumber", () => {
  test("should work for admin user", async () => {
    const res = await request(app)
      .get("/users/101")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      user: {
        firstName: "u1first",
        lastName: "u1last",
        email: "u1@yahoo.com",
        empRole: "UI/UX Developer",
        isAdmin: false,
      },
    });
  });
  test("should work for non-admin user", async () => {
    const res = await request(app)
      .get("/users/101")
      .set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      user: {
        firstName: "u1first",
        lastName: "u1last",
        email: "u1@yahoo.com",
        empRole: "UI/UX Developer",
        isAdmin: false,
      },
    });
  });
  test("should throw UnauthorizedError for anon user", async () => {
    const res = await request(app).get("/users/101");
    expect(res.statusCode).toEqual(401);
  });
  test("should throw NotFoundError if user not found", async () => {
    const res = await request(app)
      .get("/users/108")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(404);
  });
});

/***** PATCH /users/:empNumber  ********/

describe("PATCH /users/:empNumber", () => {
  test("should update user if admin user", async () => {
    const res = await request(app)
      .patch("/users/101")
      .send({
        firstName: "u1newfirst",
        lastName: "u1newlast",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual({
      user: {
        empNumber: 101,
        firstName: "u1newfirst",
        lastName: "u1newlast",
        email: "u1@yahoo.com",
        empRole: "UI/UX Developer",
        isAdmin: false,
      },
    });
    expect(res.statusCode).toBe(200);
  });
  test("should update user if correct user", async () => {
    const res = await request(app)
      .patch("/users/101")
      .send({
        firstName: "u1newfirst",
        lastName: "u1newlast",
      })
      .set("authorization", `Bearer ${u3Token}`);
    expect(res.body).toEqual({
      user: {
        empNumber: 101,
        firstName: "u1newfirst",
        lastName: "u1newlast",
        email: "u1@yahoo.com",
        empRole: "UI/UX Developer",
        isAdmin: false,
      },
    });
    expect(res.statusCode).toBe(200);
  });
  test("should throw UnauthorizedError for anon user", async () => {
    const res = await request(app).patch("/users/101").send({
      firstName: "u1newfirst",
      lastName: "u1newlast",
    });
    expect(res.statusCode).toEqual(401);
  });
  test("should throw UnauthorizedError if not admin or correct user", async () => {
    const res = await request(app)
      .patch("/users/101")
      .send({
        firstName: "u1newfirst",
        lastName: "u1newlast",
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toEqual(401);
  });
  test("should throw NotFoundError if user not found", async () => {
    const res = await request(app)
      .patch("/users/108")
      .send({
        firstName: "u1newfirst",
        lastName: "u1newlast",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(404);
  });
  test("should throw BadRequestError if invalid data", async () => {
    const res = await request(app)
      .patch("/users/101")
      .send({
        firstName: 21,
        lastName: 48,
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(400);
  });
  test("should set new password if admin user", async () => {
    const res = await request(app)
      .patch("/users/101")
      .send({
        firstName: "u1newfirst",
        lastName: "u1newlast",
        password: "newpassword",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual({
      user: {
        empNumber: 101,
        firstName: "u1newfirst",
        lastName: "u1newlast",
        email: "u1@yahoo.com",
        empRole: "UI/UX Developer",
        isAdmin: false,
      },
    });
    const isSuccessful = await User.authenticate("u1@yahoo.com", "newpassword");
    expect(isSuccessful).toBeTruthy();
  });
  test("should set new password if correct user", async () => {
    const res = await request(app)
      .patch("/users/101")
      .send({
        firstName: "u1newfirst",
        lastName: "u1newlast",
        password: "newpassword",
      })
      .set("authorization", `Bearer ${u3Token}`);
    expect(res.body).toEqual({
      user: {
        empNumber: 101,
        firstName: "u1newfirst",
        lastName: "u1newlast",
        email: "u1@yahoo.com",
        empRole: "UI/UX Developer",
        isAdmin: false,
      },
    });
    const isSuccessful = await User.authenticate("u1@yahoo.com", "newpassword");
    expect(isSuccessful).toBeTruthy();
  });
  test("should throw UnauthorizedError if not admin or correct user attempting to update password", async () => {
    const res = await request(app)
      .patch("/users/101")
      .send({
        firstName: "u1newfirst",
        lastName: "u1newlast",
        password: "newpassword",
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toEqual(401);
  });
});

/***** DELETE /users/:empNumber  ********/

describe("DELETE /users/:empNumber", () => {
  test("should remove user if admin", async () => {
    const res = await request(app)
      .delete("/users/101")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual({ deleted: "User number 101" });
  });
  test("should remove user if correct user", async () => {
    const res = await request(app)
      .delete("/users/101")
      .set("authorization", `Bearer ${u3Token}`);
    expect(res.body).toEqual({ deleted: "User number 101" });
  });
  test("should throw UnauthorizedError if anon user", async () => {
    const res = await request(app).delete("/users/101");
    expect(res.statusCode).toBe(401);
  });
  test("should throw UnauthorizedError if user not admin or correct user", async () => {
    const res = await request(app)
      .delete("/users/101")
      .set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toBe(401);
  });
  test("should throw NotFoundError if user not found", async () => {
    const res = await request(app)
      .delete("/users/105")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toBe(404);
  });
});
