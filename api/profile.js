const { asyncErrorWrapper, createError } = require("../mw/error");
const router = require("express").Router();
const users = require("../db/schemas/users");
const rooms = require("../db/schemas/rooms");
const cloudinary = require("../db/cloudinary");
const bcrpyt = require("bcrypt");

const getProfile = asyncErrorWrapper(async (req, res) => {
  const { id } = req;
  const user = await users.findById(id);
  res.json(user);
});

const search = asyncErrorWrapper(async (req, res) => {
  const { username } = req.params;
  const { id } = req;
  const user = await users.findOne({ username });
  if (!user) createError("User not found", 404);
  if (user._id == id) createError("You can't add yourself");
  const room = await rooms.findOne({ users: { $all: [id, user._id] } });
  res.json({ user, room });
});

const uploadPP = asyncErrorWrapper(async (req, res) => {
  const { pp } = req.body;
  const { id } = req;
  const url = await cloudinary.uploader.upload(pp, {
    folder: "pp",
    public_id: id,
    upload_preset: "ml_default",
  });
  await users.findByIdAndUpdate(id, { $set: { pp: url.url } });
  res.json({ status: "success" });
});

const deletePP = asyncErrorWrapper(async (req, res) => {
  const { id } = req;
  await cloudinary.uploader.destroy("pp/" + id);
  await users.findByIdAndUpdate(id, { $unset: { pp: 1 } });
  res.json({ status: "success" });
});

const changePassword = asyncErrorWrapper(async (req, res) => {
  const { id } = req;
  const { opassword, npassword } = req.body;
  const user = await users.findById(id).select("+password");
  if (bcrpyt.compareSync(opassword, user.password)) {
    await users.findByIdAndUpdate(id, {
      $set: { password: bcrpyt.hashSync(npassword, 10) },
    });
    res.json({ status: "success" });
  } else createError("Old password is incorrect");
});

const changeEmail = asyncErrorWrapper(async (req, res) => {
  const { id } = req;
  const { email } = req.body;
  await users.findByIdAndUpdate(id, { $set: { email } });
  res.json({ status: "success" });
});

const changeUsername = asyncErrorWrapper(async (req, res) => {
  const { id } = req;
  const { username } = req.body;
  await users.findByIdAndUpdate(id, { $set: { username } });
  res.json({ status: "success" });
});

router.route("/").get(getProfile);
router.route("/:username").get(search);
router.route("/pp").post(uploadPP).delete(deletePP);
router.route("/password").post(changePassword);
router.route("/email").post(changeEmail);
router.route("/username").post(changeUsername);

module.exports = router;
