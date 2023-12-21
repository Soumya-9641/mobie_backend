const mongoose = require('mongoose');

const mobileSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  type: { type: String, required: true },
  processor: { type: String, required: true },
  memory: { type: String, required: true },
  os: { type: String, required: true },
  createdBy: { type: String, required: true },
  imageUrl: { type: String }
});

const Mobile = mongoose.model('Mobile', mobileSchema);

module.exports = Mobile;