const { asyncErrorWrapper } = require("../mw/error");
const router = require("express").Router();
const users = require("../db/schemas/users");

const getProfile = asyncErrorWrapper(async (req, res) => {
  const { id } = req;
  const user = await users.findById(id);
  res.json(user);
});

router.route("/").get(getProfile);

module.exports = router;
