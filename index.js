const express = require("express");
const app = express();
const ip = require("ip");
require("dotenv").config();

require("./api/data/db.js")();
require("./startup/config")();
require("./startup/routes")(app);
require("./startup/prod")(app);

const port = process.env.PORT || 4000;

console.info("Current Environment: " + process.env.NODE_ENV);

const server = app.listen(port, () =>
  console.info(
    `The-Opportunist-API listening on port ${port}! & ip: ${ip.address()}`
  )
);
