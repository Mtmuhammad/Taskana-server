"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY;
const PORT = +process.env.PORT || 3001;

// Use dev database, testing database, or via env var, production database.
const getDatabaseUri = () => {
  return process.env.NODE_ENV === "test"
    ? "taskana_test"
    : process.env.DATABASE_URL || "taskana";
};

/** Speed up bcrypt during tests, since the algorithm safety isn't being tested.*/
const BCRYPT_WORK_FACTOR =
  process.env.NODE_ENV === "test" ? 1 : +process.env.BCRYPT_WORK_FACTOR;

console.log("Taskana Config:".green);
console.log("SECRET KEY".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
