const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const errorHandler = require("./../api/middleware/error.middleware");

const authRoutes = require("./../api/routes/auth.routes");
const userRoutes = require("./../api/routes/user.routes");

module.exports = function (app) {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(
    "/uploads",
    express.static(path.join(__dirname, "./../public/uploads"))
  );

  /* Logging every request  */
  app.use(function (req, res, next) {
    console.log(req.method, req.url);
    next();
  });

  /* For Cors Issue */

  const allowedOrigins = [
    "http://localhost:3001",
    "http://localhost:3003",
    "http://localhost:3000",
    "https://the-oportunist-frontend.vercel.app",
    "https://the-oportunist-frontend-340vwopl6-sulesuleman.vercel.app",
  ];

  app.use(
    cors({
      credentials: true,
      origin: function (origin, callback) {
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg =
            "The CORS policy for this site does not " +
            "allow access from the specified Origin.";
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
    })
  );

  app.use(express.json());
  app.get("/", (req, res) => res.send("Hello World!"));
  app.get("/api", (req, res) => res.send("Hello API World!"));

  app.use("/api/auth", authRoutes);
  app.use("/api/user", userRoutes);

  app.use(errorHandler.errorMiddleware);
};
