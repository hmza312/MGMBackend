const mongoose = require("mongoose");

const Joi = require("joi");

const jwt = require("jsonwebtoken");

const string = require("joi/lib/types/string");

const boolean = require("joi/lib/types/boolean");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },

  password: {
    type: String,
  },

  email: {
    type: String,
  },

  dateOfBirth: {
    type: Date,
  },

  phone: {
    type: String,
  },

  accountNumber: {
    type: String,
  },

  role: {
    type: Boolean,

    default: false,
  },

  accountBalance: {
    type: Number,

    default: 0,
  },

  isDeleted: {
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
    },

    process.env.JWT_PRIVATE_KEY
  );

  return token;
};

exports.User = mongoose.model("User", userSchema);
function validateLoginUser(req) {
  const schema = {
    email: Joi.string().required(),
    password: Joi.string().required(),
  };
  return Joi.validate(req, schema);
}
