const { omit } = require("lodash");
const { Transaction } = require("../data/transaction.model");
const { User, validateUpdateProfile } = require("../data/user.model");

module.exports.transferMoney = async (req, res) => {
  console.log("Inside Tranfer Money api");
  debugger;
  const {
    body: { amountToBeProcessed, transactionTo },
    user: { _id },
  } = req;
  console.log(_id);
  try {
    const transaction = await new Transaction({
      amountToBeProcessed,
      transactionBy: _id,
      transactionTo,
      transactionType: "Deposit",
    });

    const senderData = await User.findById({ _id: _id });
    console.log(senderData);
    const balanceUpdated = senderData.accountBalance - amountToBeProcessed;
    const updateTransferBy = await User.findByIdAndUpdate(
      { _id: _id },
      { accountBalance: balanceUpdated },
      { new: true, upsert: true }
    );
    transaction.save();
    const recieverData = await User.findOne({ username: transactionTo });
    const balanceNew = recieverData.accountBalance + amountToBeProcessed;
    const updateTransferTo = await User.findByIdAndUpdate(
      { _id: recieverData._id },
      { accountBalance: balanceNew },
      { new: true, upsert: true }
    );

    res.send({ error: false, message: "Transaction done successfully" });
  } catch (err) {
    console.log("Transfer money api failed: ", err.message);
    res.status(500).send({
      error: true,
      message: err.message,
    });
  }
};

module.exports.getAllTransactions = async (req, res) => {
  console.log("Inside Get All transaction API");
  const {
    user: { _id },
  } = req;
  try {
    const allTransactions = await Transaction.find({ isDeleted: false });
 
    res.send({ allTransactions, message: "Transactions Fetched successfully" });
  } catch (err) {
    console.log("get all transaction api failed: ", err);
    return res.status(500).send({ error: true, message: err.message });
  }
};


module.exports.profile = async (req, res) => {
  console.log("In profile api");
  try {
    const {
      user: { _id },
    } = req;
    const user = await User.findById(_id)
      .populate({
        path: "appliedJobs",
      })
      .populate({
        path: "gig",
      });
    if (!user)
      return res.status(404).send({
        error: true,
        message: "User not found",
        data: {},
      });
    res.status(200).send({
      error: false,
      message: "profile fetched successfully",
      data: {
        user: omit(user, ["password"]),
      },
    });
  } catch (err) {
    res.status(500).send({
      error: true,
      message: "Internal server error",
      data: {},
    });
  }
};

module.exports.profileById = async (req, res) => {
  console.log("In get profile by id");
  try {
    const {
      params: { id },
    } = req;
    const user = await User.findById({ _id: id })
      .populate({
        path: "appliedJobs",
      })
      .populate({
        path: "gig",
      });
    if (!user) {
      const error = new Error("No user found", 404);
      error.status = 404;
      throw error;
    }

    res.status(200).send({
      error: false,
      message: "User found",
      data: { user },
    });
  } catch (err) {
    console.log("Err", err);
    res.status(err?.status || 500).send({
      error: true,
      message: err?.message,
      data: {},
    });
  }
};

module.exports.updateProfile = async (req, res) => {
  console.log("In updateProfile api");
  const {
    user: { _id },
    body,
    body: { email, username },
  } = req;
  try {
    let profileImg = body?.profileImg;
    let resume = body?.resume;

    if (!profileImg) {
      const url = req.protocol + "://" + req.get("host");
      profileImg =
        url +
        req.files.profileImg[0].path
          .replace(/\\/g, "/")
          .substring("public".length);
    }

    if (!resume) {
      const url = req.protocol + "://" + req.get("host");
      resume =
        url +
        req.files.resume[0].path.replace(/\\/g, "/").substring("public".length);
    }

    const { error } = validateUpdateProfile(body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({
      _id: { $ne: _id },
      email: email.toLowerCase(),
    });
    if (user)
      return res
        .status(400)
        .send({ error: true, message: "Email already registered" });

    let usernameCheck = await User.findOne({
      _id: { $ne: _id },
      username: username.toLowerCase(),
    });

    if (usernameCheck)
      return res
        .status(400)
        .send({ error: true, message: "Username already registered" });

    const query = { ...body, profileImg, resume };

    const userData = await User.findByIdAndUpdate(
      { _id },
      {
        ...query,
      },
      { new: true }
    );
    res.send({
      error: false,
      message: "profile updated successfully",
      user: userData,
    });
  } catch (err) {
    console.log("profile not updated: ", err);
    res.send({
      error: true,
      message: err.message,
    });
  }
};

module.exports.getAll = async (req, res) => {
  console.log("In getAll api");
  try {
    const users = await User.find({});
    res.status(200).send({
      error: false,
      message: "Users found",
      data: users,
    });
  } catch (err) {
    res.status(500).send({
      error: true,
      message: "Internal server error",
      data: {},
    });
  }
};

module.exports.deleteUserById = async (req, res) => {
  console.log("In DELETE USER BY ID api");
  const {
    params: { id },
  } = req;
  try {
    await User.findByIdAndUpdate({ _id: id }, { isDeleted: true });
    res.status(200).send({
      error: false,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.log("Delete user by id api failed", err);
    res.status(500).send({
      error: true,
      message: "Internal server error",
      data: {},
    });
  }
};

module.exports.changeRole = async (req, res) => {
  console.log("In changeRole api", req.body);

  const {
    user: { _id },
    body,
  } = req;
  try {
    const roles = {};
    const user = await User.findByIdAndUpdate(_id, {
      role: body.role,
    });
    res.status(200).send({
      error: false,
      message: "Role changed successfully",
      data: user,
    });
  } catch (err) {}
};
