"use strict";

/** Routes for tasks. */

const jsonschema = require("jsonschema");
const express = require("express");
const {
  authenticateJWT,
  ensureLoggedIn,
  ensureIsAdmin,
  ensureCorrectUserOrAdmin,
} = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Task = require("../models/task");
const taskNewSchema = require("../schemas/taskNew.json");
const taskUpdateSchema = require("../schemas/taskUpdate.json");

const router = express.Router();

/** POST "/" {task} => {task} 
 * 
 * Adds a task. Any user can add a task. 
 * 
 * Data can include:
 * {title, description, important, createdBy}
 *  
 * This returns the newly created task:
 * {task: {id, title, description, status, important, date, createdBy}}
 * 
 Auth required: login 
*/

router.post("/", authenticateJWT, ensureLoggedIn, async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const validator = jsonschema.validate(
      { ...req.body, createdBy: currentUser.empNumber },
      taskNewSchema
    );
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const task = await Task.create({
      ...req.body,
      createdBy: currentUser.empNumber,
    });

    return res.status(201).json({ task });
  } catch (err) {
    return next(err);
  }
});

/** Get /:empNumber => {tasks: [{id, title, description, status, important, date, createdBy}, {...}]}
 *
 * Returns list of all tasks for a given user. Must be current user
 *
 * Authorization required: login and correct user
 */

router.get(
  "/:empNumber",
  ensureLoggedIn,
  ensureCorrectUserOrAdmin,
  async (req, res, next) => {
    try {
      const tasks = await Task.findAll(req.params.empNumber);
      return res.json({ tasks });
    } catch (err) {
      return next(err);
    }
  }
);

/** GET /:empNumber/:id => {task}
 *
 * Returns {{id, title, description, status, important, date, createdBy}}
 *
 * Authorization required: login and correct user
 */

router.get(
  "/:empNumber/:id",
  ensureLoggedIn,
  ensureCorrectUserOrAdmin,
  async (req, res, next) => {
    try {
      const task = await Task.get(req.params.id);
      return res.json({ task });
    } catch (err) {
      return next(err);
    }
  }
);

/** PATCH /[id] {task} => {task}
 *
 * Data can include:
 *    { title, description, important, status}
 *
 * Returns => {id, title, description, status, important, date, createdBy }
 *
 * Authorization required: login and correct user
 */

router.patch(
  "/:id",
  ensureLoggedIn,
  ensureCorrectUserOrAdmin,
  async (req, res, next) => {
    try {
      const validator = jsonschema.validate(req.body, taskUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }

      const task = await Task.update(req.params.id, req.body);
      return res.json({ task });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[id] => {deleted: Task number "id"}
 *
 * Authorization required: login and correct user
 */

router.delete(
  "/:id",
  ensureLoggedIn,
  ensureCorrectUserOrAdmin,
  async (req, res, next) => {
    try {
      await Task.remove(req.params.id);
      return res.json({ deleted: `Task number ${req.params.id}` });
    } catch (err) {
      return next(err);
    }
  }
);
module.exports = router;
