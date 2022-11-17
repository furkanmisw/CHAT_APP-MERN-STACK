const rooms = require("../db/schemas/rooms");
const users = require("../db/schemas/users");
const messages = require("../db/schemas/messages");
const { asyncErrorWrapper } = require("../mw/error");
const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use(require("../mw/authtoken"));
router.use("/profile", require("./profile"));
router.use("/rooms", require("./rooms"));
router.use("/messages", require("./messages"));

module.exports = router;
