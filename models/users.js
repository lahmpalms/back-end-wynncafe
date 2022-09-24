const mongoose = require("mongoose");
const users = new mongoose.Schema(
  {
    f_name: {
      type: String,
      require: true,
    },
    l_name: {
      type: String,
      require: true,
    },
    tel: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    gender: {
      type: String,
      require: true,
    },
    userStatus: {
      type: String,
      default: "1",
    },
  },
  { collection: "users" },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", users);
