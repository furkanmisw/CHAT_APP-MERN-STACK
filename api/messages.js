const messages = require("../db/schemas/messages");
const rooms = require("../db/schemas/rooms");
const { asyncErrorWrapper, createError } = require("../mw/error");
const router = require("express").Router();

const sendMessage = asyncErrorWrapper(async (req, res) => {
  const { message, room, receiver } = req.body;
  const { id: sender } = req;
  if (room) {
    const _room = await rooms.findById(room);
    if (!_room.users.includes(sender)) createError("Forbidden", 403);
    await messages.create({ message, sender, room });
    await rooms.findByIdAndUpdate(room, { $set: { lastmessage: message } });
    res.json({ status: "ok" });
  } else {
    if (!receiver) createError("Bad Request");
    const _room = await rooms.findOne({ users: { $all: [sender, receiver] } });
    if (_room) {
      await messages.create({ message, sender, room: _room._id });
      await rooms.findByIdAndUpdate(_room._id, {
        $set: { lastmessage: message },
      });
      res.json({ status: "ok" });
    } else {
      const newRoom = await rooms.create({ users: [sender, receiver] });
      await messages.create({ message, sender, room: newRoom._id });
      await rooms.findByIdAndUpdate(newRoom._id, {
        $set: { lastmessage: message },
      });
      res.status(201).json({ roomid: newRoom._id });
    }
  }
});

const getMessages = asyncErrorWrapper(async (req, res) => {
  const { room } = req.params;
  let { skip } = req.query;
  skip = parseInt(skip) || 0;
  const _room = await rooms.findById(room);
  if (!_room) createError("Room not found", 404);
  if (!_room.users.includes(req.id)) createError("Forbidden", 403);

  let _messages = await messages
    .find({ room })
    .sort({ date: -1 })
    .skip(skip)
    .limit(20);
  _messages = _messages.reverse();
  res.json(_messages);
});

router.route("/").post(sendMessage);
router.route("/:room").get(getMessages);

module.exports = router;
