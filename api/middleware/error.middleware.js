module.exports.errorMiddleware = function (err, req, res, next) {
  console.log("Something failed: ", err);
  console.error(err.message, err);

  res.status(500).json({ "Something failed at: ": err });
};
