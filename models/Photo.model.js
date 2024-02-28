const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  title: { type: String, maxLength: 25, required: true },
  author: { type: String, maxLength: 50, required: true },
  email: { type: String, required: true },
  src: { type: String, required: true },
  votes: { type: Number, required: true },
});

module.exports = mongoose.model('Photo', photoSchema);
