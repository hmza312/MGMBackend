const express = require("express");

const router = express.Router();

const { authMiddle, isDeleted } = require("../middleware/auth.middleware");

const transactionCtrl = require("./../controllers/transaction.controller");

router.post(
  "/transferMoney",
  authMiddle,
  isDeleted,
  transactionCtrl.transferMoney
);

router.get(
  "/allTransactions",
  authMiddle,
  isDeleted,
  transactionCtrl.getAllTransactions
);
module.exports = router;
