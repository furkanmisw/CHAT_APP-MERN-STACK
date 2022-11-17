const { asyncErrorWrapper, createError } = require("../mw/error");
const router = require("express").Router();
const users = require("../db/schemas/users");
const rooms = require("../db/schemas/rooms");

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

router.route("/").get(getProfile);
router.route("/:username").get(search);

module.exports = router;
