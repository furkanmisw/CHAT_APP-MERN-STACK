const rooms = require("../db/schemas/rooms");
const { asyncErrorWrapper } = require("../mw/error");
const router = require("express").Router();

const getRooms = asyncErrorWrapper(async (req, res) => {
  const { id } = req;
  let { skip } = req.query;
  skip = parseInt(skip) || 0;
  const _rooms = await rooms
    .find({ users: { $in: [id] } })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(15);
  res.json(_rooms);
});

router.route("/").get(getRooms);

module.exports = router;
