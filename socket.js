const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

const c = (server) => {
  let sockets = {}; // production code would use a database
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("New user connected");
    try {
      const { token } = cookie.parse(socket.handshake.headers.cookie);
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return next(new Error("Authentication error"));
        socket.userid = decoded.id;
        sockets[decoded.id] = socket.id;
      });
    } catch (error) {
      console.log(error);
    }
    if (!socket.userid) return;
    console.log("passed: 1");

    socket.on("message", (socketdata) => {
      const { message, to } = socketdata;
      console.log({ socketdata, status: "passed" });
      io.to(sockets[to]).emit("message",  message );
      console.log("message sent");
    });

    socket.on("disconnect", () => {
      delete sockets[socket.userid];
    });
  });
};

module.exports = c;
