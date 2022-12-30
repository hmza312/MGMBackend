const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

module.exports = function () {
  const db = process.env.db;
  console.info("DB is: ", db);
  mongoose.connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: false,
    useUnifiedTopology: true,
  });

  // CONNECTION EVENTS
  mongoose.connection.on("connected", function () {
    console.log("Mongoose connected to " + db);
  });

  mongoose.connection.on("error", function (err) {
    console.error("Mongoose connection error: " + err);
  });

  mongoose.connection.on("disconnected", function () {
    console.info("Mongoose disconnected");
  });
};
