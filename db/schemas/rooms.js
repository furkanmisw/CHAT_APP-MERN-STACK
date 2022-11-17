const mongoose = require("mongoose");

const rooms = new mongoose.Schema(
  {
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      required: true,
    },
    lastmessage: String,
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("rooms", rooms);
