"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { NotFoundError, BadRequestError } = require("../expressError");

/** Related functions for tickets. */

class Ticket {
  /** Create a ticket for a project
   *
   * Data can include:
   * {title, description, projectId, createdBy, assignedTo }
   *
   * Returns => {id, title, description, date, projectId, assignedTo }
   *
   * Throws BadRequestError on duplicate entries
   */

  static async create({
    title,
    description,
    projectId,
    createdBy,
    assignedTo,
  }) {
    // check for duplicate
    const duplicateCheck = await db.query(
      `SELECT title FROM tickets WHERE title=$1`,
      [title]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate ticket: ${title}`);

    const result = await db.query(
      `INSERT INTO tickets (title, description, project_id, created_by, assigned_to)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING 
      id, 
      title, 
      description, 
      to_char(date, 'MM-DD-YYYY') AS "date", 
      project_id AS "projectId", 
      assigned_to AS "assignedTo"`,
      [title, description, projectId, createdBy, assignedTo]
    );

    const ticket = result.rows[0];

    return ticket;
  }

  /** Finds all tickets
   *
   * Returns => [{id, title, description, status, date, projectId, createdBy, assignedTo, assignedName, projectName }, {...}]
   */

  static async findAll() {
    const result = await db.query(
      `SELECT 
        t.id,
        t.title,
        t.description,
        t.status,
        to_char(t.date, 'MM-DD-YYYY') AS "date",
        t.project_id AS "projectId",
        p.name AS "projectName",
        t.created_by AS "createdBy",
        t.assigned_to AS "assignedTo",
        concat(u.first_name, ' ', u.last_name) AS "assignedName"
        FROM tickets t
        JOIN projects p
        ON t.project_id = p.id
        JOIN users u
        ON t.assigned_to = u.emp_number
        ORDER BY t.id DESC`
    );

    return result.rows;
  }

  /** Finds all assigned tickets for given user
   *
   * Returns => [{id, title, description, status, date, projectId, createdBy}, {...}]
   */

  static async findAssigned(empNumber) {
    const result = await db.query(
      `SELECT 
        t.id,
        t.title,
        t.description,
        t.status,
        to_char(t.date, 'MM-DD-YYYY') AS "date",
        t.project_id AS "projectId",
        p.name AS "projectName",
        t.created_by AS "createdBy",
        concat(u.first_name, ' ', u.last_name) AS "assignedName"
        FROM tickets t
        JOIN projects p
        ON t.project_id = p.id
        JOIN users u
        ON t.assigned_to = u.emp_number
        WHERE t.assigned_to = $1
        ORDER BY t.id DESC`,
      [empNumber]
    );

    return result.rows;
  }

  /** Given a ticket id, returns data about the ticket
   *
   * Returns => {id, title, description, status, date, projectId, createdBy, assignedTo}
   *
   * Throws NotFoundError if no ticket found
   */

  static async get(id) {
    const result = await db.query(
      `SELECT 
      t.id,
      t.title,
      t.description,
      t.status,
      to_char(t.date, 'MM-DD-YYYY') AS "date",
      t.project_id AS "projectId",
      p.name AS "projectName",
      t.created_by AS "createdBy",
      t.assigned_to AS "assignedTo",
      concat(u.first_name, ' ', u.last_name) AS "assignedName"
      FROM tickets t
      JOIN projects p
      ON t.project_id = p.id
      JOIN users u
      ON t.assigned_to = u.emp_number
      WHERE t.id = $1
      ORDER BY t.id DESC`,
      [id]
    );

    const ticket = result.rows[0];
    if (!ticket) throw new NotFoundError(`No ticket found!`);

    return ticket;
  }

  /** Update ticket data with given "data" and id
   *
   * This is a partial update, all fields do not have to be included.
   *
   * However, only admin users, users who have been assigned to the ticket,
   * or users who created the ticket can update ticket fields.
   *
   *Data can include:
   *   { title, description, status, projectId, assignedTo}
   *
   * Returns => {id, title, description, status, date, projectId, createdBy, assignedTo}
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      projectId: "project_id",
      assignedTo: "assigned_to",
    });

    const numberVarIdx = "$" + (values.length + 1);
    const querySql = `UPDATE tickets
                      SET ${setCols}
                      WHERE id = ${numberVarIdx}
                      RETURNING 
                      id,
                      title, 
                      description,
                      status,
                      to_char(date, 'MM-DD-YYYY') AS "date",
                      project_id AS "projectId",
                      created_by AS "createdBy",
                      assigned_to AS "assignedTo"`;
    const result = await db.query(querySql, [...values, id]);
    const ticket = result.rows[0];

    if (!ticket) throw new NotFoundError(`No ticket found!`);

    return ticket;
  }

  /** Given a ticket id, deletes the ticket
   *
   * Returns => undefined
   *
   * Throws NotFoundError if no ticket found
   */

  static async remove(id) {
    let result = await db.query(
      `DELETE
             FROM tickets
             WHERE id = $1
             RETURNING id`,
      [id]
    );
    const ticket = result.rows[0];
    if (!ticket) throw new NotFoundError(`No ticket found!`);
  }
}

module.exports = Ticket;
