const express = require("express");

const router = express.Router();

const { authMiddle, isDeleted } = require("../middleware/auth.middleware");

const userCtrl = require("./../controllers/user.controller");
router.get("/all", authMiddle, isDeleted, userCtrl.getAll);
router.get("/", authMiddle, isDeleted, userCtrl.profile);
router.get("/:id", authMiddle, isDeleted, userCtrl.profileById);
router.post("/update", authMiddle, isDeleted, userCtrl.updateProfile);

router.put("/:id", authMiddle, userCtrl.deleteUserById);
module.exports = router;
