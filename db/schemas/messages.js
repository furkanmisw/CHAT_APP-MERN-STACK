const mongoose = require("mongoose");

const messages = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rooms",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 250,
    },
    date: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model("messages", messages);
