const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const string = require("joi/lib/types/string");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  username: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  phone: {
    type: String,
  },
  profileImg: {
    type: String,
  },
  role: {
    type: String,
    default: "Buyer",
  },
  appliedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  gig: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
    },
  ],
  resume: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  resetPassToken: {
    type: String,
  },
  totalUserReviews: {
    type: Number,
    default: 0,
  },
  userAverageRating: {
    type: Number,
    default: 0,
  },
  bankDetails: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      role: this.role,
      name: `${this.firstName} ${this.lastName}`,
    },
    process.env.JWT_PRIVATE_KEY
  );

  return token;
};

function validateUser(user) {
  const schema = {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    dateOfBirth: Joi.date().required(),
    password: Joi.string().required(),
    phone: Joi.string().required(),
    role: Joi.string().required(),
  };
  return Joi.validate(user, schema);
}

function validateLoginUser(req) {
  const schema = {
    email: Joi.string().required(),
    password: Joi.string().required(),
  };
  return Joi.validate(req, schema);
}

function validateEmail(req) {
  const schema = {
    email: Joi.string().required().email(),
  };
  return Joi.validate(req, schema);
}

function validateUpdateProfile(req) {
  const schema = {
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    username: Joi.string().optional(),
    email: Joi.string().optional().email(),
    dateOfBirth: Joi.date().optional(),
    phone: Joi.string().optional(),
    profileImg: Joi.any(),
    resume: Joi.any(),
  };
  return Joi.validate(req, schema);
}

function validateUpdatePassword(req) {
  const schema = {
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
    confirmPassword: Joi.string().required(),
  };
  return Joi.validate(req, schema);
}

function validateResetPassword(req) {
  const schema = {
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
  };
  return Joi.validate(req, schema);
}

exports.User = mongoose.model("User", userSchema);
exports.validateUser = validateUser;
exports.validateLoginUser = validateLoginUser;
exports.validateEmail = validateEmail;
exports.validateUpdateProfile = validateUpdateProfile;
exports.validateUpdatePassword = validateUpdatePassword;
exports.validateResetPassword = validateResetPassword;
