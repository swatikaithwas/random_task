const { Schema, model } = require("mongoose");


//  Schema for  images
const ImageSchema = Schema({
  urls: [
    {
      type: String,
      required: true,
    },
  ],
  //   blogId: {
  //     type: Schema.Types.ObjectId,
  //     ref: "blogSchema",
  //   },
});
module.exports = model("ImageSchema", ImageSchema);
