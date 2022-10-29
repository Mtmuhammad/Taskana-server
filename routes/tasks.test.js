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
  u3Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/***** POST /tasks  ********/

describe("POST /tasks", () => {
  const newTask = {
    title: "Home Page Design",
    description: "Design landing page for homestew react.",
    important: true,
  };
  test("should work for admin user to create a new task", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ ...newTask, createdBy: 100 })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      task: {
        id: 2,
        title: "Home Page Design",
        description: "Design landing page for homestew react.",
        date: getCurrentDate(),
        status: "Open",
        important: true,
        createdBy: 100,
      },
    });
  });
  test("should work for non-admin user to create a new task", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ ...newTask, createdBy: 101 })
      .set("authorization", `Bearer ${u3Token}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      task: {
        id: 3,
        title: "Home Page Design",
        description: "Design landing page for homestew react.",
        date: getCurrentDate(),
        status: "Open",
        important: true,
        createdBy: 101,
      },
    });
  });
  test("should throw UnauthorizedError for anon user", async () => {
    const res = await request(app).post("/tasks").send(newTask);
    expect(res.statusCode).toEqual(401);
  });
  test("should throw BadRequestError for missing data", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Database" })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(400);
  });
  test("should throw BadRequestError for invalid data", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: 42, description: "This-is-wrong-data", category: true })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(400);
  });
});

/***** GET /tasks/:empNumber  ********/

describe("GET /tasks/:empNumber", () => {
  const adminTask1 = {
    title: "Home Page Design",
    description: "Design landing page for homestew react.",
    important: false,
    createdBy: 100,
  };
  const userTask1 = {
    title: "User test 1",
    description: "User sample text 1.",
    important: false,
    createdBy: 101,
  };
  const userTask2 = {
    title: "User test 2",
    description: "User sample text 2.",
    important: true,
    createdBy: 101,
  };

  test("should work for admin user to get all tasks", async () => {
    await request(app)
      .post("/tasks")
      .send(adminTask1)
      .set("authorization", `Bearer ${u1Token}`);

    const res = await request(app)
      .get("/tasks/100")
      .set("authorization", `Bearer ${u1Token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      tasks: [
        {
          id: 1,
          title: "Code routes for API",
          description: "Sample Text",
          status: "Open",
          important: true,
          date: getCurrentDate(),
          createdBy: 100,
        },
        {
          id: 4,
          title: "Home Page Design",
          description: "Design landing page for homestew react.",
          status: "Open",
          important: false,
          date: getCurrentDate(),
          createdBy: 100,
        },
      ],
    });
  });
  test("should work for non-admin user to get all tasks", async () => {
    await request(app)
      .post("/tasks")
      .send(userTask1)
      .set("authorization", `Bearer ${u3Token}`);
    await request(app)
      .post("/tasks")
      .send(userTask2)
      .set("authorization", `Bearer ${u3Token}`);

    const res = await request(app)
      .get("/tasks/101")
      .set("authorization", `Bearer ${u3Token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      tasks: [
        {
          id: 5,
          title: "User test 1",
          description: "User sample text 1.",
          status: "Open",
          important: false,
          date: getCurrentDate(),
          createdBy: 101,
        },
        {
          id: 6,
          title: "User test 2",
          description: "User sample text 2.",
          status: "Open",
          important: true,
          date: getCurrentDate(),
          createdBy: 101,
        },
      ],
    });
  });
  test("should throw UnauthorizedError for anon user", async () => {
    const res = await request(app).get("/tasks/101");
    expect(res.statusCode).toEqual(401);
  });

  test("should throw NotFoundError for invalid url", async () => {
    const res = await request(app)
      .get("/task")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(404);
  });
  test("should fail: test next() handler", async () => {
    await db.query("DROP TABLE tasks CASCADE");
    const res = await request(app)
      .get("/tasks/100")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toBe(500);
  });
});

// /***** GET /tasks/:empNumber/:id  ********/

describe("GET /tasks/:empNumber/:id", () => {
  test("should work for admin user to get a single task", async () => {
    const res = await request(app)
      .get("/tasks/100/1")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      task: {
        id: 1,
        title: "Code routes for API",
        description: "Sample Text",
        status: "Open",
        important: true,
        date: getCurrentDate(),
        createdBy: 100,
      },
    });
  });
  test("should throw UnauthorizedError for anon user", async () => {
    const res = await request(app).get("/tasks/104/3");
    expect(res.statusCode).toEqual(401);
  });
  test("should throw NotFoundError if task not found", async () => {
    const res = await request(app)
      .get("/tasks/100/3")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(404);
  });
});

/***** PATCH /tasks/:id  ********/
describe("PATCH /tasks/:id", () => {
  test("should update one task field for admin user", async () => {
    const res = await request(app)
      .patch("/tasks/1")
      .send({ title: "Taskana" })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      task: {
        id: 1,
        title: "Taskana",
        description: "Sample Text",
        status: "Open",
        important: true,
        date: getCurrentDate(),
        createdBy: 100,
      },
    });
  });
  test("should update multiple task fields for admin user", async () => {
    const res = await request(app)
      .patch("/tasks/1")
      .send({ title: "Homestew", description: "This is a React recipe app." })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      task: {
        id: 1,
        title: "Homestew",
        description: "This is a React recipe app.",
        status: "Open",
        important: true,
        date: getCurrentDate(),
        createdBy: 100,
      },
    });
  });
  test("should throw BadRequestError for invalid data", async () => {
    const res = await request(app)
      .patch("/tasks/1")
      .send({ title: 21, description: "This is-wrong data." })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(400);
  });
  test("should throw UnauthorizedError for anon user", async () => {
    const res = await request(app)
      .patch("/tasks/1")
      .send({ name: "Homestew", description: "This is a React recipe app." });
    expect(res.statusCode).toEqual(401);
  });

  test("should throw NotFoundError if task not found", async () => {
    const res = await request(app)
      .patch("/tasks/4")
      .send({ title: "Homestew", description: "This is a React recipe app." })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(404);
  });
});

/***** DELETE /tasks/:id  ********/

describe("DELETE /tasks/:id", () => {
  test("should remove task if admin user", async () => {
    const res = await request(app)
      .delete("/tasks/1")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual({ deleted: "Task number 1" });
  });
  test("should throw UnauthorizedError if anon user", async () => {
    const res = await request(app).delete("/tasks/1");
    expect(res.statusCode).toBe(401);
  });
  test("should throw UnauthorizedError if user not admin", async () => {
    const res = await request(app)
      .delete("/tasks/1")
      .set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toBe(401);
  });
  test("should throw NotFoundError if task not found", async () => {
    const res = await request(app)
      .delete("/tasks/5")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toBe(404);
  });
});
