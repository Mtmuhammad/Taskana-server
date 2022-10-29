"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");
const { getCurrentDate } = require("../helpers/getCurrentDate");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/***** POST /projects  ********/

describe("POST /projects", () => {
  const newProject = {
    name: "Homestew",
    description: "A Recipe App made with React.",
    deadline: "01-11-2023",
  };
  test("should work for admin user to create a new project", async () => {
    const res = await request(app)
      .post("/projects")
      .send(newProject)
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      project: {
        name: "Homestew",
        description: "A Recipe App made with React.",
        date: getCurrentDate(),
        deadline: "01-11-2023",
        status: "Open",
      },
    });
  });
  test("should throw ForbiddenError for user not admin", async () => {
    const res = await request(app)
      .post("/projects")
      .send(newProject)
      .set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toEqual(403);
  });
  test("should throw UnauthorizedError for anon user", async () => {
    const res = await request(app).post("/projects").send(newProject);
    expect(res.statusCode).toEqual(401);
  });
  test("should throw BadRequestError for missing data", async () => {
    const res = await request(app)
      .post("/projects")
      .send({ name: "Homestew" })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(400);
  });
  test("should throw BadRequestError for invalid data", async () => {
    const res = await request(app)
      .post("/projects")
      .send({ name: 42, description: "This-is-wrong-data" })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(400);
  });
});

/***** GET /projects  ********/

describe("GET /projects", () => {
  const newProject = {
    name: "Homestew",
    description: "A Recipe App made with React.",
    deadline: "01-11-2023",
  };
  test("should work for admin user to get all projects", async () => {
    await request(app)
      .post("/projects")
      .send(newProject)
      .set("authorization", `Bearer ${u1Token}`);

    const res = await request(app)
      .get("/projects")
      .set("authorization", `Bearer ${u1Token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      projects: [
        {
          id: 1,
          name: "test project 1",
          date: getCurrentDate(),
          deadline: "01-11-2023",
          status: "Open",
        },
        {
          id: 3,
          name: "Homestew",
          date: getCurrentDate(),
          deadline: "01-11-2023",
          status: "Open",
        },
      ],
    });
  });
  test("should work for non-admin user to get all projects", async () => {
    await request(app)
      .post("/projects")
      .send(newProject)
      .set("authorization", `Bearer ${u1Token}`);

    const res = await request(app)
      .get("/projects")
      .set("authorization", `Bearer ${u2Token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      projects: [
        {
          id: 1,
          name: "test project 1",
          date: getCurrentDate(),
          deadline: "01-11-2023",
          status: "Open",
        },
        {
          id: 4,
          name: "Homestew",
          date: getCurrentDate(),
          deadline: "01-11-2023",
          status: "Open",
        },
      ],
    });
  });
  test("should throw UnauthorizedError for anon user", async () => {
    await request(app)
      .post("/projects")
      .send(newProject)
      .set("authorization", `Bearer ${u1Token}`);

    const res = await request(app).get("/projects");
    expect(res.statusCode).toEqual(401);
  });

  test("should throw NotFoundError for invalid url", async () => {
    const res = await request(app)
      .get("/project")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(404);
  });

  test("should fail: test next() handler", async () => {
    await db.query("DROP TABLE projects CASCADE");
    const res = await request(app)
      .get("/projects")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toBe(500);
  });
});

/***** GET /projects/:id  ********/

describe("GET /projects/:id", () => {
  test("should work for admin user to get a single project", async () => {
    const res = await request(app)
      .get("/projects/1")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      project: {
        id: 1,
        name: "test project 1",
        description: "This is the first project for tests.",
        date: getCurrentDate(),
        deadline: "01-11-2023",
        status: "Open",
        manager: 100,
      },
    });
  });
  test("should work for non-admin user to get a project", async () => {
    const res = await request(app)
      .get("/projects/1")
      .set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      project: {
        id: 1,
        name: "test project 1",
        description: "This is the first project for tests.",
        date: getCurrentDate(),
        deadline: "01-11-2023",
        status: "Open",
        manager: 100,
      },
    });
  });
  test("should throw UnauthorizedError for anon user", async () => {
    const res = await request(app).get("/projects/1");
    expect(res.statusCode).toEqual(401);
  });
  test("should throw NotFoundError if project not found", async () => {
    const res = await request(app)
      .get("/projects/3")
      .set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toEqual(404);
  });
});

/***** PATCH /projects/:id  ********/
describe("PATCH /projects/:id", () => {
  test("should update one project field for admin user", async () => {
    const res = await request(app)
      .patch("/projects/1")
      .send({ name: "Homestew" })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      project: {
        name: "Homestew",
        description: "This is the first project for tests.",
        date: getCurrentDate(),
        deadline: "01-11-2023",
        status: "Open",
      },
    });
  });
  test("should update multiple project fields for admin user", async () => {
    const res = await request(app)
      .patch("/projects/1")
      .send({ name: "Homestew", description: "This is a React recipe app." })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      project: {
        name: "Homestew",
        description: "This is a React recipe app.",
        date: getCurrentDate(),
        deadline: "01-11-2023",
        status: "Open",
      },
    });
  });
  test("should throw BadRequestError for invalid data", async () => {
    const res = await request(app)
      .patch("/projects/1")
      .send({ name: 21, description: "This is-wrong data." })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(400);
  });
  test("should throw UnauthorizedError for anon user", async () => {
    const res = await request(app)
      .patch("/projects/1")
      .send({ name: "Homestew", description: "This is a React recipe app." });
    expect(res.statusCode).toEqual(401);
  });
  test("should throw ForbiddenError for non-admin user", async () => {
    const res = await request(app)
      .patch("/projects/1")
      .send({ name: "Homestew", description: "This is a React recipe app." })
      .set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toEqual(403);
  });
  test("should throw NotFoundError if project not found", async () => {
    const res = await request(app)
      .patch("/projects/4")
      .send({ name: "Homestew", description: "This is a React recipe app." })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(404);
  });
});

/***** DELETE /projects/:id  ********/

describe("DELETE /projects/:id", () => {
  test("should remove project if admin user", async () => {
    const res = await request(app)
      .delete("/projects/1")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual({ deleted: "Project number 1" });
  });
  test("should throw UnauthorizedError if anon user", async () => {
    const res = await request(app).delete("/projects/1");
    expect(res.statusCode).toBe(401);
  });
  test("should throw ForbiddenError if user not admin", async () => {
    const res = await request(app)
      .delete("/projects/1")
      .set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toBe(403);
  });
  test("should throw NotFoundError if project not found", async () => {
    const res = await request(app)
      .delete("/projects/5")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toBe(404);
  });
});
