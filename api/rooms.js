const { asyncErrorWrapper } = require("../mw/error");
const router = require("express").Router();

const getRooms = asyncErrorWrapper(async (req, res) => {
  const { id } = req;
  let { skip } = req.query;
  skip = parseInt(skip) || 0;
  res.json([]);
});

router.route("/").get(getRooms);

module.exports = router;
