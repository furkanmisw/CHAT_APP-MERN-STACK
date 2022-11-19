require("dotenv").config();
require("./db/connect");

const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require("morgan");
const app = express();
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT);
require('./socket')(server)

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.static("./client/build"));

app.use("/api", require("./api/routes"));

app.use(require("./mw/error").errorHandler);
app.use(require("./mw/error").routeNotFound);


