const rooms = require("../db/schemas/rooms");
const users = require("../db/schemas/users");
const { asyncErrorWrapper } = require("../mw/error");
const router = require("express").Router();

const getRooms = asyncErrorWrapper(async (req, res) => {
  const { id } = req;
  let { skip } = req.query;
  skip = parseInt(skip) || 0;
  let _rooms = await rooms
    .find({ users: { $in: [id] } })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(15);

  _rooms = await Promise.all(
    _rooms.map(async (room) => {
      const userId = room.users.find((u) => u.toString() !== id);
      const user = await users.findById(userId);
      return { user, room };
    })
  );

  res.json(_rooms);
});

router.route("/").get(getRooms);

module.exports = router;
