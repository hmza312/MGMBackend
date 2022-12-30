const jwt = require("jsonwebtoken");
const { User } = require("../data/user.model");
const { isEmpty } = require("lodash");

const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;

module.exports.authMiddle = function (req, res, next) {
  const {
    headers: { authorization },
  } = req;
  const token = authorization;

  if (!token)
    return res
      .status(401)
      .send("Access Denied. You are not authorized to access this route.");

  try {
    const decoded = jwt.verify(
      token.split(" ")[1],
      process.env.JWT_PRIVATE_KEY
    );
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};

module.exports.bindUser = function (req, res, next) {
  const token = req.header("token");

  if (token && token.includes("ey")) {
    try {
      const decoded = jwt.verify(token, jwtPrivateKey);
      req.user = decoded;
      next();
    } catch (ex) {
      res.status(400).send("Invalid token.");
    }
  } else {
    next();
  }
};

module.exports.isDeleted = async function (req, res, next) {
  const {
    user: { _id },
  } = req;
  const response = await User.findOne({ _id }, { isDeleted: 1 });
  if (!isEmpty(response) && response.isDeleted === true) {
    return res.status(400).send("Invalid User");
  }
  next();
};

module.exports.isVerified = function (req, res, next) {
  if (!req.user.isVerified) return res.status(401).send("Access Denied");
  next();
};

module.exports.isAdmin = function (req, res, next) {
  if (!req.user.isAdmin)
    return res.status(401).send("Admin scope - Access Denied");
  next();
};

module.exports.adminNotAllowed = function (req, res, next) {
  if (req.user.isAdmin)
    return res.status(401).send("Student scope - Access Denied");
  next();
};

module.exports.isTutor = function (req, res, next) {
  if (!req.user.isTutor)
    return res.status(401).send("Tutor scope - Access Denied");
  next();
};

module.exports.withAnswers = function (req, res, next) {
  req.withAnswers = true;
  next();
};
