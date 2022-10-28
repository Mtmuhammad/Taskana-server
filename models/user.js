"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config");

/** Related functions for users */

class User {
  /** authenticate user with email and password
   *
   * Returns => {empNumber, firstName, lastName, email, empRole, isAdmin}
   *
   * Throws UnauthorizedError if email is not found or wrong password
   */

  static async authenticate(email, password) {
    //try to find the user email first
    const result = await db.query(
      `
   SELECT
      emp_number AS "empNumber",
      first_name AS "firstName", 
      last_name AS "lastName",
      email,
      password,
      emp_role AS "empRole",
      is_admin AS "isAdmin"
   FROM users
   WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];

    if (user) {
      //compare hashed password to user provided password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data
   *
   * Returns => {empNumber, firstName, lastName, email, empRole, isAdmin}
   *
   * Throws BadRequestError on duplicate entries
   */

  static async register({
    firstName,
    lastName,
    email,
    password,
    empRole,
    isAdmin,
  }) {
    //check for duplicate
    const duplicateCheck = await db.query(
      `SELECT email FROM users WHERE email=$1`,
      [email]
    );

    // if duplicate throw error
    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate email: ${email}`);

    //hash user password
    const hashedPwd = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users (first_name, last_name, email, password, emp_role, is_admin)
                     VALUES ($1, $2, $3, $4, $5, $6)
                     RETURNING 
                        emp_number AS "empNumber",
                        first_name AS "firstName",
                        last_name AS "lastName",
                        email,
                        emp_role AS "empRole",
                        is_admin AS "isAdmin"
    `,
      [firstName, lastName, email, hashedPwd, empRole, isAdmin]
    );

    const user = result.rows[0];

    return user;
  }

  /** FInds all users
   *
   * Returns => [{empNumber, firstName, lastName, email, isAdmin}, {...}]
   */

  static async findAll() {
    const result = await db.query(`
   SELECT
      emp_number AS "empNumber",
      first_name AS "firstName",
      last_name AS "lastName",
      email,
      emp_role AS "empRole",
      is_admin AS "isAdmin"
   FROM users
   ORDER BY email`);

    return result.rows;
  }

  /** Given an employee number, returns data about the user
   *
   * Returns => {firstName, lastName, email, empRole, isAdmin}
   *
   * Throws NotFoundError if no user found
   */

  static async get(empNumber) {
    const result = await db.query(
      `
   SELECT
      first_name AS "firstName",
      last_name AS "lastName",
      email,
      emp_role AS "empRole",
      is_admin AS "isAdmin"
   FROM users
   WHERE emp_number = $1`,
      [empNumber]
    );

    const user = result.rows[0];
    if (!user) throw new NotFoundError(`No user found!`);

    return user;
  }

  /** Update user data with given "data"
   *
   * This is a partial update, all fields do not have to be included.
   *
   * However, only admin users or logged in user can update the given
   * user fields. Admin can update any user.
   *
   *Data can include:
   *   { firstName, lastName, password, email, empRole, isAdmin }
   *
   * Returns => { empNumber, firstName, lastName, email, empRole, isAdmin }
   *
   * Throws NotFoundError if not found.
   */

   static async update(empNumber, data) {
      if (data.password) {
        data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
      }
  
      const { setCols, values } = sqlForPartialUpdate(data, {
        firstName: "first_name",
        lastName: "last_name",
        empRole: "emp_role",
        isAdmin: "is_admin",
      });
  
      const numberVarIdx = "$" + (values.length + 1);
      const querySql = `UPDATE users 
                        SET ${setCols} 
                        WHERE emp_number = ${numberVarIdx} 
                        RETURNING emp_number AS "empNumber",
                                  first_name AS "firstName",
                                  last_name AS "lastName",
                                  email,
                                  emp_role AS "empRole",
                                  is_admin AS "isAdmin"`;
      const result = await db.query(querySql, [...values, empNumber]);
      const user = result.rows[0];
  
      if (!user) throw new NotFoundError(`No user found!`);
  
      delete user.password;
      return user;
    }
  
    /** Given an employee number, deletes the user
     *
     * Returns => undefined
     *
     * Throws NotFoundError if no user found
     */
  
    static async remove(empNumber) {
      let result = await db.query(
        `DELETE
               FROM users
               WHERE emp_number = $1
               RETURNING emp_number AS empNumber`,
        [empNumber]
      );
      const user = result.rows[0];
      if (!user) throw new NotFoundError(`No user found!`);
    }
  
    /** Given an employee number and refresh token, saves token to database
     *
     * Returns => user
     *
     * Throws NotFoundError if no user found
     */
  
    static async saveRefreshToken(empNumber, token) {
      let result = await db.query(
        `UPDATE users 
        SET token = $1 
        WHERE emp_number = $2 
        RETURNING emp_number AS "empNumber",
                  token AS "refreshToken"`,
        [token, empNumber]
      );
      const user = result.rows[0];
      if (!user) throw new NotFoundError(`No user found!`);
      return user;
    }
  
    /** Given a refresh token, finds user data. User data is used to sign
     * a new access token.
     *
     * Returns => {empNumber, email, isAdmin}
     *
     * Throws NotFoundError if no user found
     */
  
    static async findToken(refreshToken) {
      let result = await db.query(
        `SELECT emp_number AS "empNumber", email, is_admin AS "isAdmin" 
      FROM users 
      WHERE token = $1`,
        [refreshToken]
      );
  
      const user = result.rows[0];
      if (!user) throw new NotFoundError(`No user found!`);
      return user;
    }
  
    /** Given an empNumber, removes user refresh token from database on logout.
     *
     * Returns => {empNumber, token}
     *
     * Throws NotFoundError if no user found
     */
    static async removeRefreshToken(empNumber) {
      let result = await db.query(
        `UPDATE users 
        SET token = null 
        WHERE emp_number = $1
        RETURNING emp_number AS "empNumber",
        token`,
        [empNumber]
      );
  
      const user = result.rows[0];
      if (!user) throw new NotFoundError(`No user found!`);
      return user;
    }
}

module.exports = User;
