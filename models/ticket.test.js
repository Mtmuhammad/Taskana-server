"use strict";
const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db");
const Ticket = require("./ticket");
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
  const newTicket = {
    title: "Internet Not Working",
    description: "The Internet is not working for one a few of the pages.",
    projectId: 1,
    createdBy: 100,
    assignedTo: 101,
  };
  test("should create a new ticket", async () => {
    const ticket = await Ticket.create(newTicket);
    expect(ticket).toEqual({
      id: 2,
      title: "Internet Not Working",
      description: "The Internet is not working for one a few of the pages.",
      date: getCurrentDate(),
      projectId: 1,
      assignedTo: 101,
    });

    const res = await db.query(`SELECT * FROM tickets WHERE id=$1`, [
      ticket.id,
    ]);
    expect(res.rows.length).toEqual(1);
  });

  test("should throw duplicate error", async () => {
    try {
      await Ticket.create(newTicket);
      await Ticket.create(newTicket);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/********** findAll ***********/

describe("findAll", () => {
  const newTicket = {
    title: "Internet Not Working",
    description: "The Internet is not working for one a few of the pages.",
    projectId: 1,
    createdBy: 100,
    assignedTo: 101,
  };

  test("should find all tickets", async () => {
    await Ticket.create(newTicket);
    const tickets = await Ticket.findAll();
    expect(tickets).toEqual([
      {
        id: 1,
        title: "Search Page Not Working",
        description: "Users unable to use search without crashing.",
        date: getCurrentDate(),
        status: "Open",
        projectId: 1,
        assignedTo: 101,
        createdBy: 100,
      },
      {
        id: 4,
        title: "Internet Not Working",
        description: "The Internet is not working for one a few of the pages.",
        date: getCurrentDate(),
        status: "Open",
        projectId: 1,
        assignedTo: 101,
        createdBy: 100,
      },
    ]);
    expect(tickets.length).toBe(2);
  });
});

/********** get ***********/
describe("get", () => {
  test("should get data on a single ticket", async () => {
    const ticket = await Ticket.get(1);
    expect(ticket).toEqual({
      id: 1,
      title: "Search Page Not Working",
      description: "Users unable to use search without crashing.",
      status: "Open",
      date: getCurrentDate(),
      projectId: 1,
      createdBy: 100,
      assignedTo: 101,
    });
  });

  test("should throw not found", async () => {
    try {
      await Ticket.get(2);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/********** update ***********/
describe("update", () => {
  test("should update one ticket field", async () => {
    const ticket = await Ticket.update(1, { title: "Search Page Down!" });
    expect(ticket).toEqual({
      id: 1,
      title: "Search Page Down!",
      description: "Users unable to use search without crashing.",
      status: "Open",
      date: getCurrentDate(),
      projectId: 1,
      assignedTo: 101,
      createdBy: 100,
    });
  });
  test("should update multiple ticket fields", async () => {
    const ticket = await Ticket.update(1, {
      title: "Search Page Down!",
      description: "Search Page not functioning properly for all pages.",
      status: "Review",
    });
    expect(ticket).toEqual({
      id: 1,
      title: "Search Page Down!",
      description: "Search Page not functioning properly for all pages.",
      status: "Review",
      date: getCurrentDate(),
      projectId: 1,
      assignedTo: 101,
      createdBy: 100,
    });
  });

  test("should throw not found", async () => {
    try {
      await Ticket.update(2, { title: "nope" });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/********** delete ***********/

describe("remove", () => {
  test("should remove ticket", async () => {
    await Ticket.remove(1);
    const res = await db.query("SELECT * FROM tickets WHERE id=1");
    expect(res.rows.length).toEqual(0);
  });

  test("should throw not found", async () => {
    try {
      await Ticket.remove(3);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
