const jwt = require("jsonwebtoken");
const jsonschema = require("jsonschema");
const tokenNewSchema = require("../schemas/tokenNew.json");
const { BadRequestError } = require("../expressError");
require("dotenv").config();

/** return signed JWT from user data */

function createToken(user) {
  console.assert(
    user.Admin !== undefined,
    "createToken passed without isAdmin property"
  );

  const validator = jsonschema.validate({ ...user }, tokenNewSchema);
  if (!validator.valid) {
    const errs = validator.errors.map((e) => e.stack);
    throw new BadRequestError(errs);
  }

  let payload = {
    empNumber: user.empNumber,
    email: user.email,
    isAdmin: user.isAdmin || false,
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "5m",
  });
}

/** return signed JWT from user data given refresh token */
function createRefreshToken(user) {
  console.assert(
    user.Admin !== undefined,
    "createToken passed without isAdmin property"
  );

  const validator = jsonschema.validate({ ...user }, tokenNewSchema);
  if (!validator.valid) {
    const errs = validator.errors.map((e) => e.stack);
    throw new BadRequestError(errs);
  }

  let payload = {
    empNumber: user.empNumber,
    email: user.email,
    isAdmin: user.isAdmin || false,
  };

  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });
}

module.exports = { createToken, createRefreshToken };
