"use strict";

/** Routes for projects. */

const jsonschema = require("jsonschema");
const express = require("express");
const {
  authenticateJWT,
  ensureLoggedIn,
  ensureIsAdmin,
} = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Project = require("../models/project");
const projectNewSchema = require("../schemas/projectNew.json");
const projectUpdateSchema = require("../schemas/projectUpdate.json");

const router = express.Router();

/** POST "/" {project} => {project} 
 * 
 * Adds a project. Only admin users can add a new project 
 * 
 * Data can include:
 * {name, description, deadline}
 *  
 * This returns the newly created project:
 * {project: {name, description, date, deadline, status}}
 * 
 Auth required: login and isAdmin: true (must be an administrator)
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
        { ...req.body, manager: currentUser.empNumber },
        projectNewSchema
      );
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }

      const project = await Project.create({
        ...req.body,
        manager: currentUser.empNumber,
      });

      return res.status(201).json({ project });
    } catch (err) {
      return next(err);
    }
  }
);

/** Get / => {projects: [{id, name, date, deadline, status}, {...}]}
 *
 * Returns list of all projects.
 *
 * Authorization required: login
 */

router.get("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const projects = await Project.findAll();
    return res.json({ projects });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id] => {project}
 *
 * Returns {id, name, description, date, deadline, status, manager}
 *
 * Authorization required: login
 */

router.get("/:id", ensureLoggedIn, async (req, res, next) => {
  try {
    const project = await Project.get(req.params.id);
    return res.json({ project });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[id] {project} => {project}
 *
 * Data can include:
 *    { name, description, deadline, status }
 *
 * Returns => { name, description, date, deadline, status}
 *
 * Authorization required: login and isAdmin
 */

router.patch("/:id", ensureLoggedIn, ensureIsAdmin, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, projectUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const project = await Project.update(req.params.id, req.body);
    return res.json({ project });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id] => {deleted: Project number "id"}
 *
 * Authorization required: login and Admin
 */

router.delete("/:id", ensureLoggedIn, ensureIsAdmin, async (req, res, next) => {
  try {
    await Project.remove(req.params.id);
    return res.json({ deleted: `Project number ${req.params.id}` });
  } catch (err) {
    return next(err);
  }
});
module.exports = router;
