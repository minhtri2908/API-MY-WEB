const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  title: String,
  url: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Image", ImageSchema);
