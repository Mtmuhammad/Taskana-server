# Taskana Project Management API

## Table of contents

- [Overview](#overview)
  - [Installation](#installation)
  - [Screenshot](#screenshot)
  - [Built with](#built-with)
  - [Continued development](#continued-development)

### Overview

Taskana is a project management API built general CRUD functions for users, tasks, tickets, and projects. Only admin users
may create new users or projects, while all other users can edit tickets they are assigned, or tasks they have created.

### Installation

To clone down this repository, you will need `node` and `npm` installed globally on your machine.  

Installation:

`npm install`  

Create and Seed Database:

`npm run database`

To Run Test Suite:  

`npm test`  

To Start Server:

`npm start`

To Start Dev Server:

`npm run dev`  

To Visit App:

`localhost:3001`  

### Built with

- [ExpressJS](https://expressjs.com/) - NodeJS framework
- [Bcrypt](https://www.npmjs.com/package/bcrypt) - NodeJS library for password hashing
- [PostgreSQL](https://www.postgresql.org/) - Object-Relational Database
- [JSONWebTokens](https://www.npmjs.com/package/jsonwebtoken) - JWT signing and authentication
- [JSONSchema](https://json-schema.org/) - JSON testing and validation

### Continued development

In the future, changed password functionality will be added to admin user capabilities.
