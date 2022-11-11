"use strict";

/** Routes for tickets. */

const jsonschema = require("jsonschema");
const express = require("express");
const {
  authenticateJWT,
  ensureLoggedIn,
  ensureIsAdmin,
  ensureCorrectUserOrAdmin
} = require("../middleware/auth");
const { BadRequestError, UnauthorizedError } = require("../expressError");
const Ticket = require("../models/ticket");
const ticketNewSchema = require("../schemas/ticketNew.json");
const ticketUpdateSchema = require("../schemas/ticketUpdate.json");

const router = express.Router();

/** POST "/" {ticket} => {ticket} 
 * 
 * Adds a ticket. Any user can create a ticket for a given project. 
 * 
 * Data can include:
 * {title, description, projectId, createdBy, assignedTo  }
 *  
 * This returns the newly created ticket:
 * {ticket: {id, title, description, date, projectId, assignedTo }}
 * 
 Auth required: login and Admin
*/

router.post(
  "/",
  authenticateJWT,
  ensureLoggedIn,
  ensureIsAdmin,
  async (req, res, next) => {
    try {
      const currentUser = res.locals.user;
      const validator = jsonschema.validate(
        { ...req.body, createdBy: currentUser.empNumber },
        ticketNewSchema
      );
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }

      const ticket = await Ticket.create({
        ...req.body,
        createdBy: currentUser.empNumber,
      });

      return res.status(201).json({ ticket });
    } catch (err) {
      return next(err);
    }
  }
);

/** Get / => {tickets: [{id, title, description, date, status, projectId, assignedTo }, {...}]}
 *
 * Returns list of all tickets.
 *
 * Authorization required: login
 */

router.get("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const tickets = await Ticket.findAll();
    return res.json({ tickets });
  } catch (err) {
    return next(err);
  }
});

/** Get /assigned/:empNumber => {tickets: [{id, title, description, date, status, projectId, assignedTo }, {...}]}
 *
 * Returns list of all tickets assigned to given user.
 *
 * Authorization required: login
 */

router.get("/assigned/:empNumber", ensureLoggedIn, ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const tickets = await Ticket.findAssigned(req.params.empNumber);
    return res.json({ tickets });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id] => {ticket}
 *
 * Returns {id, title, description, status, priority, date, projectId, createdBy, assignedTo}
 *
 * Authorization required: login
 */

router.get("/:id", ensureLoggedIn, async (req, res, next) => {
  try {
    const ticket = await Ticket.get(req.params.id);
    return res.json({ ticket });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[id] {ticket} => {ticket}
 *
 * Only admin users, users who created the ticket, or users who were
 * assigned the ticket can update fields.
 *
 * Data can include:
 *    { title, description, status, priority, projectId, assignedTo
 *
 * Returns => {id, title, description, status, priority, date, projectId, assignedTo }
 *
 * Authorization required: login
 */

router.patch("/:id", ensureLoggedIn, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, ticketUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const currUser = res.locals.user;
    const found = await Ticket.get(req.params.id);
    if (found) {
      if (
        currUser.isAdmin !== true &&
        found.createdBy !== currUser.empNumber &&
        found.assignedTo !== currUser.empNumber
      ) {
        throw new UnauthorizedError();
      }
    }
    const ticket = await Ticket.update(req.params.id, req.body);
    return res.json({ ticket });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id] => {deleted: Ticket number "id"}
 *
 * Authorization required: login & isAdmin, or user who created ticket
 */

router.delete("/:id", ensureLoggedIn, ensureIsAdmin, async (req, res, next) => {
  try {
    const currUser = res.locals.user;
    const found = await Ticket.get(req.params.id);
    if (found) {
      if (currUser.isAdmin !== true && found.createdBy !== currUser.empNumber) {
        throw new UnauthorizedError();
      }
    }
    await Ticket.remove(req.params.id);
    return res.json({ deleted: `Ticket number ${req.params.id}` });
  } catch (err) {
    return next(err);
  }
});
module.exports = router;
