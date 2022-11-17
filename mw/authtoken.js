const jwt = require("jsonwebtoken");

const tokenauth = (req, res, next) => {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.clearCookie("token");
      res.clearCookie("isloggedin");
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    req.id = decoded.id;
    next();
  });
};
module.exports = tokenauth;
