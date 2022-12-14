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
  u4Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/***** POST /tickets  ********/

describe("POST /tickets", () => {
  const newTicket = {
    title: "Navbar brand not working",
    description: "The logo in the navbar is not redirecting to the homepage.",
    projectId: 1,
    createdBt: 100,
  };
  test("should work for admin user to create a new ticket", async () => {
    const res = await request(app)
      .post("/tickets")
      .send(newTicket)
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      ticket: {
        id: 100001,
        title: "Navbar brand not working",
        description:
          "The logo in the navbar is not redirecting to the homepage.",
        date: getCurrentDate(),
        projectId: 1,
        assignedTo: null,
      },
    });
  });

  test("should throw UnauthorizedError for anon user", async () => {
    const res = await request(app).post("/tickets").send(newTicket);
    expect(res.statusCode).toEqual(401);
  });
  test("should throw BadRequestError for missing data", async () => {
    const res = await request(app)
      .post("/tickets")
      .send({ title: "Database" })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(400);
  });
  test("should throw BadRequestError for invalid data", async () => {
    const res = await request(app)
      .post("/tickets")
      .send({ title: 42, description: "This-is-wrong-data" })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(400);
  });
});

/***** GET /tickets  ********/

describe("GET /tickets", () => {
  const newTicket = {
    title: "Navbar brand not working",
    description: "The logo in the navbar is not redirecting to the homepage.",
    projectId: 1,
    createdBy: 100,
  };
  test("should work for admin user to get all tickets", async () => {
    await request(app)
      .post("/tickets")
      .send(newTicket)
      .set("authorization", `Bearer ${u1Token}`);

    const res = await request(app)
      .get("/tickets")
      .set("authorization", `Bearer ${u1Token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      tickets: [
        {
          id: 100002,
          title: "Navbar brand not working",
          description:
            "The logo in the navbar is not redirecting to the homepage.",
          date: getCurrentDate(),
          status: "Open",
          projectId: 1,
          assignedTo: null,
          createdBy: 100,
        },
        {
          id: 100000,
          title: "Search Page Not Working",
          description: "Users unable to use search without crashing.",
          date: getCurrentDate(),
          status: "Open",
          projectId: 1,
          assignedTo: 101,
          createdBy: 100,
        },
       
      ],
    });
  });
  test("should work for non-admin user to get all tickets", async () => {
    await request(app)
      .post("/tickets")
      .send(newTicket)
      .set("authorization", `Bearer ${u1Token}`);

    const res = await request(app)
      .get("/tickets")
      .set("authorization", `Bearer ${u2Token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      tickets: [
        {
          id: 100003,
          title: "Navbar brand not working",
          description:
            "The logo in the navbar is not redirecting to the homepage.",
          date: getCurrentDate(),
          status: "Open",
          projectId: 1,
          assignedTo: null,
          createdBy: 100,
        },
        {
          id: 100000,
          title: "Search Page Not Working",
          description: "Users unable to use search without crashing.",
          date: getCurrentDate(),
          status: "Open",
          projectId: 1,
          assignedTo: 101,
          createdBy: 100,
        },
        
      ],
    });
  });
  test("should throw UnauthorizedError for anon user", async () => {
    await request(app)
      .post("/tickets")
      .send(newTicket)
      .set("authorization", `Bearer ${u1Token}`);

    const res = await request(app).get("/tickets");
    expect(res.statusCode).toEqual(401);
  });

  test("should throw NotFoundError for invalid url", async () => {
    const res = await request(app)
      .get("/ticket")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(404);
  });

  test("should fail: test next() handler", async () => {
    await db.query("DROP TABLE tickets CASCADE");
    const res = await request(app)
      .get("/tickets")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toBe(500);
  });
});

// /***** GET /tickets/:id  ********/

describe("GET /tickets/:id", () => {
  test("should work for admin user to get a single ticket", async () => {
    const res = await request(app)
      .get("/tickets/100000")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      ticket: {
        id: 100000,
        title: "Search Page Not Working",
        description: "Users unable to use search without crashing.",
        status: "Open",
        date: getCurrentDate(),
        projectId: 1,
        createdBy: 100,
        assignedTo: 101,
      },
    });
  });
  test("should work for non-admin user to get a ticket", async () => {
    const res = await request(app)
      .get("/tickets/100000")
      .set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      ticket: {
        id: 100000,
        title: "Search Page Not Working",
        description: "Users unable to use search without crashing.",
        status: "Open",
        date: getCurrentDate(),
        projectId: 1,
        createdBy: 100,
        assignedTo: 101,
      },
    });
  });
  test("should throw UnauthorizedError for anon user", async () => {
    const res = await request(app).get("/tickets/1");
    expect(res.statusCode).toEqual(401);
  });
  test("should throw NotFoundError if ticket not found", async () => {
    const res = await request(app)
      .get("/tickets/3")
      .set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toEqual(404);
  });
});

/***** PATCH /tickets/:id  ********/
describe("PATCH /tickets/:id", () => {
  test("should update one ticket field for admin user", async () => {
    const res = await request(app)
      .patch("/tickets/100000")
      .send({ title: "Taskana" })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      ticket: {
        id: 100000,
        title: "Taskana",
        description: "Users unable to use search without crashing.",
        status: "Open",
        date: getCurrentDate(),
        projectId: 1,
        assignedTo: 101,
        createdBy: 100,
      },
    });
  });
  test("should update one ticket field for user who created the ticket", async () => {
    const res = await request(app)
      .patch("/tickets/100000")
      .send({ title: "Taskana" })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      ticket: {
        id: 100000,
        title: "Taskana",
        description: "Users unable to use search without crashing.",
        status: "Open",
        createdBy: 100,
        date: getCurrentDate(),
        projectId: 1,
        assignedTo: 101,
      },
    });
  });
  test("should update one ticket field for user who was assigned the ticket", async () => {
    const res = await request(app)
      .patch("/tickets/100000")
      .send({ title: "Taskana" })
      .set("authorization", `Bearer ${u3Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      ticket: {
        id: 100000,
        title: "Taskana",
        description: "Users unable to use search without crashing.",
        status: "Open",
        createdBy: 100,
        date: getCurrentDate(),
        projectId: 1,
        assignedTo: 101,
      },
    });
  });

  test("should update multiple ticket fields for admin user", async () => {
    const res = await request(app)
      .patch("/tickets/100000")
      .send({
        title: "Taskana",
        description: "This is new sample test text for tickets.",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      ticket: {
        id: 100000,
        title: "Taskana",
        description: "This is new sample test text for tickets.",
        status: "Open",
        createdBy: 100,
        date: getCurrentDate(),
        projectId: 1,
        assignedTo: 101,
      },
    });
  });
  test("should update multiple ticket fields for user who was assigned the ticket", async () => {
    const res = await request(app)
      .patch("/tickets/100000")
      .send({
        title: "Taskana",
        description: "This is new sample test text for tickets.",
      })
      .set("authorization", `Bearer ${u3Token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      ticket: {
        id: 100000,
        title: "Taskana",
        description: "This is new sample test text for tickets.",
        status: "Open",
        createdBy: 100,
        date: getCurrentDate(),
        projectId: 1,
        assignedTo: 101,
      },
    });
  });
  test("should throw BadRequestError for invalid data", async () => {
    const res = await request(app)
      .patch("/tickets/100000")
      .send({ title: 21, description: "This is-wrong data." })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(400);
  });
  test("should throw UnauthorizedError for user who did not create ticket, or wasn't assigned", async () => {
    const res = await request(app)
      .patch("/tickets/100000")
      .send({ title: "Taskana" })
      .set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toEqual(401);
  });
  test("should throw UnauthorizedError for anon user", async () => {
    const res = await request(app)
      .patch("/tickets/100000")
      .send({ name: "Homestew", description: "This is a React recipe app." });
    expect(res.statusCode).toEqual(401);
  });

  test("should throw NotFoundError if ticket not found", async () => {
    const res = await request(app)
      .patch("/tickets/4")
      .send({ title: "Homestew", description: "This is a React recipe app." })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(404);
  });
});

/***** DELETE /tickets/:id  ********/

describe("DELETE /tickets/:id", () => {
  test("should remove ticket if admin user", async () => {
    const res = await request(app)
      .delete("/tickets/100000")
      .set("authorization", `Bearer ${u4Token}`);
    expect(res.body).toEqual({ deleted: "Ticket number 100000" });
  });
  test("should remove ticket if user who created ticket user", async () => {
    const res = await request(app)
      .delete("/tickets/100000")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual({ deleted: "Ticket number 100000" });
  });
  test("should throw UnauthorizedError if anon user", async () => {
    const res = await request(app).delete("/tickets/100000");
    expect(res.statusCode).toBe(401);
  });
  test("should throw ForbiddenError if user not admin ", async () => {
    const res = await request(app)
      .delete("/tickets/100000")
      .set("authorization", `Bearer ${u2Token}`);
    expect(res.statusCode).toBe(403);
  });
  test("should throw NotFoundError if project not found", async () => {
    const res = await request(app)
      .delete("/tasks/5")
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toBe(404);
  });
});
