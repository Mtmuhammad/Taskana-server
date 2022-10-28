"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { NotFoundError, BadRequestError } = require("../expressError");

/** Related functions for tasks. */

class Task {
  /** Create a task for a user
   *
   * Data can include:
   * {title, description, important, createdBy}
   *
   * Returns => {id, title, description, status, important, date, createdBy}
   *
   * Throws BadRequestError on duplicate entries
   */

  static async create({ title, description, important, createdBy }) {
    //check for duplicate
    const duplicateCheck = await db.query(
      `SELECT title FROM tasks WHERE title =$1`,
      [title]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate task: ${title}`);

    const result = await db.query(
      `INSERT INTO tasks (title, description, important, created_by)
    VALUES ($1, $2, $3, $4)
    RETURNING 
      id,
      title,
      description,
      status,
      important,
      to_char(date, 'MM-DD-YYYY') AS "date",
      created_by AS "createdBy"`,
      [title, description, important, createdBy]
    );

    const task = result.rows[0];

    return task;
  }

  /** Finds all tasks for given user.
   *
   * Returns => [{id, title, description, status, important, date, createdBy}, {...}]
   */

  static async findAll(empNumber) {
    const result = await db.query(`SELECT
                                    id,
                                    title,
                                    description,
                                    status,
                                    important,
                                    to_char(date, 'MM-DD-YYYY') AS "date",
                                    created_by AS "createdBy"
                                 FROM tasks
                                 WHERE created_by = $1
                                 ORDER BY date DESC`, [empNumber]);

      if (!result.rows) throw new NotFoundError(`Invalid user!`)
    return result.rows;
  }

  /** Given a task id, returns data about the task.
   *
   * Returns => {id, title, description, status, important, date, createdBy}
   *
   * Throws NotFoundError if no task found
   */

  static async get(id) {
    const result = await db.query(
      `
                                 SELECT
                                    id,
                                    title, 
                                    description,
                                    status,
                                    important,
                                    to_char(date, 'MM-DD-YYYY') AS "date",
                                    created_by AS "createdBy"
                                 FROM tasks
                                 WHERE id = $1`,
      [id]
    );

    const task = result.rows[0];
    if (!task) throw new NotFoundError(`No task found!`);

    return task;
  }

  /** Update task data with given "data" and id
   *
   * This is a partial update, all fields do not have to be included.
   *
   * However, only admin users or users who have been assigned to the task
   * can update task fields.
   *
   * Data can include:
   *  {title, description, status, important}
   *
   * Returns => {id, title, description, status, important, date, createdBy}
   *
   * Throws NotFoundError of not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      createdBy: "created_by",
    });

    const numberVarIdx = "$" + (values.length + 1);
    const querySql = `UPDATE tasks 
                     SET ${setCols}
                     WHERE id = ${numberVarIdx}
                     RETURNING
                     id,
                     title,
                     description,
                     status,
                     important,
                     to_char(date, 'MM-DD-YYYY') AS "date",
                    created_by AS "createdBy"`;

    const result = await db.query(querySql, [...values, id]);
    const task = result.rows[0];

    if (!task) throw new NotFoundError(`No task found!`);

    return task;
  }

  /** Given a task id, deletes the task
   *
   * Returns => undefined
   *
   * Throws NotFoundError if no task found
   */

  static async remove(id) {
    let result = await db.query(
      `DELETE FROM tasks WHERE id = $1 RETURNING id`,
      [id]
    );

    const task = result.rows[0];
    if (!task) throw new NotFoundError(`No task found!`);
  }
}

module.exports = Task;
