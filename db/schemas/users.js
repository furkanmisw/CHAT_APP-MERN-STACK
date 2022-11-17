const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const users = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 6,
      maxlength: 36,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      unique: true,
      validation: {
        validator: (v) => {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 100,
      select: false,
    },
    pp: String,
    socketId: String,
  },
  {
    versionKey: false,
  }
);

users.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

module.exports = mongoose.model("users", users);
