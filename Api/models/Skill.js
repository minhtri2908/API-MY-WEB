const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  category: { type: String, required: true },
  items: [{ type: String }], 
});

module.exports = mongoose.model('Skills', skillSchema);
