const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const string = require("joi/lib/types/string");
const boolean = require("joi/lib/types/boolean");

const transactionSchema = new mongoose.Schema({
  amountToBeProcessed: {
    type: Number,
  },
  transactionBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  transactionTo: {
    type: String,
  },
  transactionType: {
    type: String,
  },
  countOfTen: {
    type: Number,
  },
  countOfTwenty: {
    type: Number,
  },
  countOfFifty: {
    type: Number,
  },
  countOfHundrend: {
    type: Number,
  },
  countOfFiveHundrend: {
    type: Number,
  },
  countOfThousand: {
    type: Number,
  },
  countOfFiveThousand: {
    type: Number,
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


exports.Transaction = mongoose.model("Transaction", transactionSchema);

