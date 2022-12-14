"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");
const express = require("express");
const {
  authenticateJWT,
  ensureLoggedIn,
  ensureIsAdmin,
  ensureCorrectUserOrAdmin,
} = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken, createRefreshToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

/** POST "/" {user} => {user, token} 
 * 
 * Adds a new user. This is not the registration endpoint --- instead, this is 
 * only for admin users to add new users. The new user being added can be an 
 * admin.
 * 
 * This returns the newly created user and an auth token:
 * {user: {firstName, lastName, email, empRole, isAdmin}}
 * 
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
      const validator = jsonschema.validate(req.body, userNewSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }

      const user = await User.register(req.body);
      const accessToken = createToken(user);
      const refreshToken = createRefreshToken(user);
      await User.saveRefreshToken(user.empNumber, refreshToken);
      const role = user.isAdmin ? 1990 : 2022;


      return res
        .status(201)
        .json({ role, user, token: accessToken });
    } catch (err) {
      return next(err);
    }
  }
);

/** Get / => {users: [{empNumber, firstName, lastName, email, isAdmin }, {...}]}
 *
 * Returns list of all users.
 *
 * Authorization required: login
 */

router.get("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

/** GET /[empNumber] => {user}
 *
 * Returns {firstName, lastName, email, empRole, isAdmin}
 *
 * Authorization required: login
 */

router.get("/:empNumber", ensureLoggedIn, async (req, res, next) => {
  try {
    const user = await User.get(req.params.empNumber);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[empNumber] {user} => {user}
 *
 * Data can include:
 *    { firstName, lastName, password, email, empRole, isAdmin }
 *
 * Returns => { empNumber, firstName, lastName, email, empRole, isAdmin }
 *
 * Authorization required: login correct user or Admin
 */

router.patch(
  "/:empNumber",
  ensureLoggedIn,
  ensureCorrectUserOrAdmin,
  async (req, res, next) => {
    try {
      const validator = jsonschema.validate(req.body, userUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }

      const user = await User.update(req.params.empNumber, req.body);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[username] => {deleted: User number "empNumber"}
 *
 * Authorization required: login correct user or Admin
 */

router.delete(
  "/:empNumber",
  ensureLoggedIn,
  ensureCorrectUserOrAdmin,
  async (req, res, next) => {
    try {
      await User.remove(req.params.empNumber);
      return res.json({ deleted: `User number ${req.params.empNumber}` });
    } catch (err) {
      return next(err);
    }
  }
);
module.exports = router;
