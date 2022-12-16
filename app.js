"use strict";

/**Express app for Taskana */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const {authenticateJWT} = require("./middleware/auth")
const morgan = require("morgan");
const cookieParser = require("cookie-parser")
const usersRoutes = require("./routes/users")
const authRoutes = require("./routes/auth")
const projectRoutes = require("./routes/projects")
const taskRoutes = require("./routes/tasks")
const ticketRoutes = require("./routes/tickets")

const app = express();
//middleware logger
app.use(morgan("tiny"));

// Cross Origin Resource Sharing
app.use(cors({credentials: true, origin: ['http://localhost:3000','https://taskana-management.netlify.app/' ]}));

// built in middleware for json
app.use(express.json());

// built in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false}));

//middleware for cookies
app.use(cookieParser())

app.use("/auth", authRoutes)

// custom middleware to authenticate JSON Web Tokens
app.use(authenticateJWT)

app.use("/users", usersRoutes)
app.use("/projects", projectRoutes)
app.use("/tasks", taskRoutes)
app.use("/tickets", ticketRoutes)

/** Handle 404 errors -- this matches everything */
app.use((req, res, next) => {
  return next(new NotFoundError());
});

/**Generic error handling; anything unhandled goes here */
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
