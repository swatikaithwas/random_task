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
    type: "array",
    items: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        photo: {
          type: "string",
        },
      },
      required: ["id"],
    },
  },

  field: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("blogSchema:", blogSchema);
