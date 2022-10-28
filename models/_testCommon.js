const bcrypt = require("bcrypt");
const db = require("../db");
const { BCRYPT_WORK_FACTOR } = require("../config");
const {createRefreshToken} = require("../helpers/tokens")

async function commonBeforeAll() {
  //noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  //noinspection SqlWithoutWhere
  await db.query("DELETE FROM projects");
  //noinspection SqlWithoutWhere
  await db.query("DELETE FROM tasks");
  //noinspection SqlWithoutWhere
  await db.query("DELETE FROM tickets");
  
  await db.query(`ALTER SEQUENCE users_emp_number_seq restart with 100;`);
  await db.query(`ALTER SEQUENCE projects_id_seq restart with 1;`);
  await db.query(`ALTER SEQUENCE tasks_id_seq restart with 1;`);
  await db.query(`ALTER SEQUENCE tickets_id_seq restart with 1;`);
  await db.query(
    `INSERT INTO users (first_name, last_name, email, password, emp_role, is_admin)
   VALUES ('adminFirst','adminLast', 'admin@yahoo.com', $1, 'Web Developer', TRUE),
   ('u1first','u1last', 'u1@yahoo.com', $2, 'UI/UX Developer', FALSE)`,
    [
      await bcrypt.hash("adminpassword", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("u1password", BCRYPT_WORK_FACTOR),
    ]
  );
  

  await db.query(`INSERT INTO projects (name, description, deadline, manager) 
  VALUES ('test project 1', 'This is the first project for tests.', '01-11-2023', 100)`);

  await db.query(`INSERT INTO tasks (title, description, important, created_by) 
  VALUES ('Code routes for API', 'Sample Text', true, 100)`);

  await db.query(`INSERT INTO tickets (title, description, project_id, created_by, assigned_to) 
  VALUES ('Search Page Not Working', 'Users unable to use search without crashing.', 1, 100, 101)`);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

const u1refreshToken = createRefreshToken({empNumber: 100, email: 'admin@yahoo.com', isAdmin: true})



module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1refreshToken,
};
