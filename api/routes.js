const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use(require("../mw/authtoken"));
router.use('/profile',require('./profile'))
router.use('/rooms',require('./rooms'))

module.exports = router;
 