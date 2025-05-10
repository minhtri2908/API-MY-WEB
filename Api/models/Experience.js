const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  company: String,
  positions: [{
    title: String,
    start: String, // có thể để dạng "MM/YYYY"
    end: String
  }],
  description: String,
  link: String,
  detail: String
});

module.exports = mongoose.model('Experience', experienceSchema);
