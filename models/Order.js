const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  currency:{type:String},
  receipt:{type:String},
  payment_capture:{type:String},
  createdBy: { type: String, required: true },
  imageUrl: { type: String }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;