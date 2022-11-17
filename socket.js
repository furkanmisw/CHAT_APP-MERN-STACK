const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const users = require("./db/schemas/users");

const c = (server) => {
  const io = new Server(server);

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        socket.disconnect();
        return;
      }
      socket.id = decoded.id;
      next();
    });
  });

  io.use(async (socket, next) => {
    const { id } = socket;
    await users.findByIdAndUpdate(id, { socketId: socket.id });
    next();
  });

  io.on("connection", (socket) => {
    const { id } = socket;
    console.log(`User ${id} connected`);

    // -----------------

    // -----------------

    socket.on("disconnect", async () => {
      await users.findByIdAndUpdate(id, { $unset: { socketId: 1 } });
    });
  });
};

module.exports = c;
