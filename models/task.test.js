"use strict";
const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db");
const Task = require("./task");
const { getCurrentDate } = require("../helpers/getCurrentDate");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/********** create ***********/
describe("create", () => {
  const newTask = {
    title: "Test Task title",
    description: "This is the sample text for first task in test project.",
    important: false,
    createdBy: 100,
  };
  test("should create a new task", async () => {
    const task = await Task.create(newTask);
    expect(task).toEqual({
      id: 2,
      title: "Test Task title",
      status: "Open",
      important: false,
      description: "This is the sample text for first task in test project.",
      date: getCurrentDate(),
      createdBy: 100,
    });

    const res = await db.query(`SELECT * FROM tasks WHERE id=$1`, [task.id]);
    expect(res.rows.length).toEqual(1);
  });

  test("should throw duplicate error", async () => {
    try {
      await Task.create(newTask);
      await Task.create(newTask);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/********** findAll ***********/

describe("findAll", () => {
  const newTask = {
    title: "Test Task title",
    description: "This is the sample text for first task in test project.",
    important: true,
    createdBy: 100,
  };

  test("should find all tasks", async () => {
    await Task.create(newTask);
    const tasks = await Task.findAll(100);
    expect(tasks).toEqual([
      {
        createdBy: 100,
        date: getCurrentDate(),
        description: "This is the sample text for first task in test project.",
        id: 4,
        important: true,
        status: "Open",
        title: "Test Task title",
      },
      {
        createdBy: 100,
        date: getCurrentDate(),
        description: "Sample Text",
        id: 1,
        important: true,
        status: "Open",
        title: "Code routes for API",
      },
      
    ]);
    expect(tasks.length).toBe(2);
  });
});

/********** get ***********/
describe("get", () => {
  test("should get data on a single task", async () => {
    const task = await Task.get(1);
    expect(task).toEqual({
      id: 1,
      title: "Code routes for API",
      description: "Sample Text",
      date: getCurrentDate(),
      important: true,
      status: "Open",
      createdBy: 100,
    });
  });

  test("should throw not found", async () => {
    try {
      await Task.get(2);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/********** update ***********/
describe("update", () => {
  test("should update one task field", async () => {
    const task = await Task.update(1, { title: "Routes and Models" });
    expect(task).toEqual({
      id: 1,
      title: "Routes and Models",
      description: "Sample Text",
      date: getCurrentDate(),
      important: true,
      status: "Open",
      createdBy: 100,
    });
  });
  test("should update multiple task fields", async () => {
    const task = await Task.update(1, {
      title: "Routes and Models",
      description: "Code backend routes and models for API.",
      important: false,
    });
    expect(task).toEqual({
      id: 1,
      title: "Routes and Models",
      description: "Code backend routes and models for API.",
      date: getCurrentDate(),
      important: false,
      status: "Open",
      createdBy: 100,
    });
  });

  test("should throw not found", async () => {
    try {
      await Task.update(2, { title: "nope" });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/********** delete ***********/

describe("remove", () => {
  test("should remove task", async () => {
    await Task.remove(1);
    const res = await db.query("SELECT * FROM tasks WHERE id=1");
    expect(res.rows.length).toEqual(0);
  });

  test("should throw not found", async () => {
    try {
      await Task.remove(3);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
