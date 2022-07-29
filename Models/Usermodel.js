const mongoose = require("mongoose");
// user model schema

const user = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  images: {
    type: String,
    required: true,
  },

  type: {
    type: Number,
    required: true,
  },
  token: {
    type: String,
    default: "",
  },
});
module.exports = mongoose.model("user:", user);
