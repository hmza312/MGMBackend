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
router.post(
  "/withdrawMoney",
  authMiddle,
  isDeleted,
  transactionCtrl.withdrawMoney
);

router.get(
  "/allTransactions",
  authMiddle,
  isDeleted,
  transactionCtrl.getAllTransactions
);

router.get(
  "/allWithdrawTransactions",
  authMiddle,
  isDeleted,
  transactionCtrl.getWithdrawTransactions
);

router.post(
  "/exchangeMoney",
  authMiddle,
  isDeleted,
  transactionCtrl.exchangeMoney
);
module.exports = router;
