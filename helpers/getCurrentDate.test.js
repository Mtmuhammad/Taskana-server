"use strict";
const Project = require("../models/project");
const { getCurrentDate } = require("./getCurrentDate");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("../models/_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("getCurrentDate", () => {
  test("should return new project date", async () => {
    const project = await Project.get(1);
    expect(project.date).toEqual(getCurrentDate());
  });
});
