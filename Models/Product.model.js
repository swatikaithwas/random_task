const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  usd_price: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    // required: true,
    default: Date.now,
  },
  status: {
    type: Boolean,
    // required: true,
    default: true,
  },
});

module.exports = mongoose.model("ProductSchema:", ProductSchema);
