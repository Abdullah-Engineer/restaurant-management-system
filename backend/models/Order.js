const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  menuId: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'preparing', 'ready', 'delivered']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('Order', OrderSchema);