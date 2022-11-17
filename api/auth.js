const { asyncErrorWrapper, createError } = require("../mw/error");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const users = require("../db/schemas/users");
const bcrypt = require("bcrypt");

const _generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "365d" });

const login = asyncErrorWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await users
    .findOne({ $or: [{ email }, { username: email }] })
    .select("+password");

  if (!user) createError("User not found", 404);

  const isMath = bcrypt.compareSync(password, user.password);
  if (!isMath) createError("Password is wrong");

  const token = _generateToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    secure: true,
  });
  res.cookie("isloggedin", true, {
    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  });
  res.status(200).json({ message: "Login successfull" });
});

const signup = asyncErrorWrapper(async (req, res) => {

  const user = await users.create(req.body);
  const token = _generateToken(user._id);
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    secure: true,
  });
  res.cookie("isloggedin", true, {
    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  });
  res.status(201).json({ message: "User created" });
});


router.route("/login").post(login);
router.route("/signup").post(signup);

module.exports = router;
