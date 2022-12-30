const {
  User,
  validateUser,
  validateLoginUser,
  validateEmail,
} = require("../data/user.model");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");
const { pick, isEmpty } = require("lodash");

// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SEND_GRID_KEY);

module.exports.signUpUser = async (req, res) => {
  console.log("in signup api");
  const { error } = validateUser(req.body);
  if (error)
    return res
      .status(400)
      .send({ error: true, message: error.details[0].message });

  let user = await User.findOne({
    email: req.body.email.toLowerCase(),
    username: req.body.username,
    isDeleted: false,
  });
  if (user)
    return res.status(400).send({
      error: true,
      message: "Email or username is already registered",
    });

  user = new User({
    ...pick(req.body, [
      "username",
      "email",
      "dateOfBirth",
      "password",
      "phone",
      "role",
      "accountBalance"
    ]),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  user.email = user.email.toLowerCase();
  user.username = user.username.toLowerCase();
  // user.profileImg =
  //   "https://gulf-academy-profile-images.s3.amazonaws.com/default-profile-image.png";
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  res.header("token", token).send({
    data: {},
    error: false,
    message: "Your account is registered successfully",
  });
};

module.exports.loginUser = async (req, res) => {
  console.log("in user login api");
  const {
    body,
    body: { email, password },
  } = req;

  const { error: validateEmailError } = validateEmail({ email });

  const { error } = validateLoginUser(body);
  if (error)
    return res
      .status(406)
      .send({ error: true, message: error.details[0].message });

  const fieldToMatchforLogin = validateEmailError ? "username" : "email";

  if (fieldToMatchforLogin === "email") {
    const response = await User.findOne({ email }, { isDeleted: 1 });
    if (!isEmpty(response) && response.isDeleted === true) {
      return res.status(401).send({ error: true, message: "No User Found" });
    }
  } else if (fieldToMatchforLogin === "username") {
    const response = await User.findOne({ username: email }, { isDeleted: 1 });
    if (!isEmpty(response) && response.isDeleted === true) {
      return res.status(401).send({ error: true, message: "No User Found" });
    }
  }

  let user = await User.findOne(
    {
      [fieldToMatchforLogin]: email.toLowerCase(),
    },
    {
      email: 1,
      password: 1,
      username: 1,
      role: 1,
      phone: 1,
      dateOfBirth: 1,
      accountBalance: 1,
      _id: 1,
    }
  );
  if (user) {
    bcrypt.compare(password, user.password).then((result) => {
      if (result) {
        const token = user.generateAuthToken();
        return res.send({
          data: {
            token,
            user: pick(user, [
              "email",
              "username",
              "phone",
              "dateOfBirth",
              "role",
              "accountBalance",
              "_id",
            ]),
          },
          error: false,
          message: "Login successful",
    });
      }
      return res
        .status(400)
        .send({ error: true, message: "Invalid email or password" });
    });
  } else {
    return res.status(404).send({ error: true, message: "No User Found" });
  }
};
