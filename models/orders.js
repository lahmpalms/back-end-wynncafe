const mongoose = require("mongoose");
const orders = new mongoose.Schema({
  product_id: {
    type: String,
    required: true,
  },
  product_price: {
    type: Number,
    require: true,
    default: 0,
  },
  product_amount: {
    type: Number,
    require: true,
    default: 0,
  }
})

module.exports = mongoose.model('orders', orders)
