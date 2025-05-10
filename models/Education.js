const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree: String,
  school: String,
  university: String,
  major: String,
  batch: String,
});

module.exports = mongoose.model('Education', educationSchema);
