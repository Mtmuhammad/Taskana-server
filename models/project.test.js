"use strict";
const {
  NotFoundError,
  BadRequestError,
} = require("../expressError");
const db = require("../db");
const Project = require("./project");
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
  const newProject = {
    name: "Second Project",
    description: "This is the second test project created.",
    deadline: "02-09-2023",
    manager: 100,
  };
  test("should create a new project", async () => {
    const project = await Project.create(newProject);
    expect(project).toEqual({
      name: "Second Project",
      description: "This is the second test project created.",
      date: getCurrentDate(),
      deadline: "02-09-2023",
      status: "Open",
    });

    const res = await db.query(`SELECT * FROM projects WHERE name=$1`, [
      newProject.name,
    ]);
    expect(res.rows.length).toEqual(1);
  });

  test("should throw duplicate error", async () => {
    try {
      await Project.create({
        name: "test project 1",
        description: "This is the first project for tests.",
        deadline: "01-11-2023",
        manager: 100,
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/********** findAll ***********/

describe("findAll", () => {
  const newProject = {
    name: "Second Project",
    description: "This is the second test project created.",
    deadline: "02-09-2023",
    manager: 100,
  };
  test("should find all projects", async () => {
    await Project.create(newProject);
    const projects = await Project.findAll();
    expect(projects).toEqual([
      {
        id: 3,
        name: "Second Project",
        date: getCurrentDate(),
        deadline: "02-09-2023",
        status: "Open",
      },
      {
        id: 1,
        name: "test project 1",
        date: getCurrentDate(),
        deadline: "01-11-2023",
        status: "Open",
      },
    ]);
    expect(projects.length).toBe(2);
  });
});

/********** get ***********/
describe("get", () => {
  test("should get data on a single project", async () => {
    const project = await Project.get(1);
    expect(project).toEqual({
      id: 1,
      name: "test project 1",
      description: "This is the first project for tests.",
      date: getCurrentDate(),
      deadline: "01-11-2023",
      status: "Open",
      manager: 100,
    });
  });

  test("should throw not found", async () => {
    try {
      await Project.get(2);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/********** update ***********/
describe("update", () => {
  test("should update one project field", async () => {
    const project = await Project.update(1, { name: "new test project 1" });
    expect(project).toEqual({
      name: "new test project 1",
      description: "This is the first project for tests.",
      date: getCurrentDate(),
      deadline: "01-11-2023",
      status: "Open",
    });
  });
  test("should update multiple project fields", async () => {
    const project = await Project.update(1, {
      name: "new test project 1",
      description: "This is the new first project for tests.",
      deadline: "12-30-2023",
      status: "Open",
    });
    expect(project).toEqual({
      name: "new test project 1",
      description: "This is the new first project for tests.",
      date: getCurrentDate(),
      deadline: "12-30-2023",
      status: "Open",
    });
  });

  test("should throw not found", async () => {
    try {
      await Project.update(2, { name: "nope" });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/********** delete ***********/

describe("remove", () => {
  test("should remove project", async () => {
    await Project.remove(1);
    const res = await db.query("SELECT * FROM projects WHERE id=1");
    expect(res.rows.length).toEqual(0);
  });

  test("should throw not found", async () => {
    try {
      await Project.remove(3);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
