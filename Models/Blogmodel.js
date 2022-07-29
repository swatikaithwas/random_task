const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  descrition: {
    type: String,
    required: true,
  },
  images: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ImageSchema",
    required: true,
  },

  field: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("blogSchema:", blogSchema);
