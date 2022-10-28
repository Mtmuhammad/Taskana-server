"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { NotFoundError, BadRequestError } = require("../expressError");

/** Related functions for projects */

class Project {
  /** Create a project with "data"
   *
   * Data can include:
   * {name, description, deadline, manager, project}
   *
   * Returns => {name, description, date, deadline, status}
   *
   * Throws BadRequestError on duplicate entries
   */

  static async create({ name, description, deadline, manager }) {
    //check for duplicate
    const duplicateCheck = await db.query(
      `SELECT name FROM projects WHERE name = $1`,
      [name]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate project: ${name}`);
    }

    const result = await db.query(
      `
      INSERT INTO projects (name, description, deadline, manager) 
    VALUES ($1,$2,$3::date,$4)
    RETURNING
      name,
      description,
      to_char(date, 'MM-DD-YYYY') AS "date",
      to_char(deadline, 'MM-DD-YYYY') AS "deadline",
      status`,
      [name, description, deadline, manager]
    );

    const project = result.rows[0];

    return project;
  }

  /** Finds all projects
   *
   * Returns => [{id, name, date, deadline, status}, {...}]
   */

  static async findAll() {
    const result = await db.query(`
      SELECT
         id,
         name,
         to_char(date, 'MM-DD-YYYY') AS "date",
         to_char(deadline, 'MM-DD-YYYY') AS "deadline",
         status
      FROM projects
      ORDER BY deadline DESC`);

    return result.rows;
  }

  /** Given a project id, returns data about the project
   *
   * Returns => {id, name, description, date, deadline, status, manager}
   *
   * Throws NotFoundError if no project found
   */

  static async get(id) {
    const result = await db.query(
      `
   SELECT
      id,
      name,
      description,
      to_char(date, 'MM-DD-YYYY') AS "date",
      to_char(deadline, 'MM-DD-YYYY') AS "deadline",
      status,
      manager
   FROM projects
   WHERE id = $1`,
      [id]
    );

    const project = result.rows[0];
    if (!project) throw new NotFoundError("No project found!");

    return project;
  }

  /** Update project data with given "data" and id
   *
   * This is a partial update, all fields do not have to be included.
   *
   * However, only admin users can update project fields.
   *
   * Data can include:
   *  {name, description, deadline, status, description}
   *
   * Returns => {name, description, date, deadline, status, description}
   *
   * Throws NotFoundError if no found
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {});

    const numberVarIdx = "$" + (values.length + 1);
    const querySql = `UPDATE projects
                     SET ${setCols}
                     WHERE id = ${numberVarIdx}
                     RETURNING
                     name,
                     description,
                     to_char(date, 'MM-DD-YYYY') AS "date",
                     to_char(deadline, 'MM-DD-YYYY') AS "deadline",
                     status`;

    const result = await db.query(querySql, [...values, id]);
    const project = result.rows[0];

    if (!project) throw new NotFoundError(`No project found!`);

    return project;
  }

  /** Given a project id, deletes the project
   *
   * Returns => undefined
   *
   * Throws NotFoundError if no project found
   */

  static async remove(id) {
    let result = await db.query(
      `DELETE FROM projects WHERE id = $1 RETURNING id, name`,
      [id]
    );

    const project = result.rows[0];
    if (!project) throw new NotFoundError(`No project found!`);
  }
}

module.exports = Project;
