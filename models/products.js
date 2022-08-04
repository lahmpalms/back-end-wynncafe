const mongoose = require("mongoose")
const products = new mongoose.Schema({
  product_name: {
    type: String,
    unique : true,
    required : true
  },
  product_types: [
    {
      type: mongoose.Types.ObjectId, 
      ref: 'product_types'}
  ],
  product_price: {
    type: Number,
    require: true,
    default: 0
  },
  product_detail: {
    type: String
  },
  product_amount: {
    type: Number,
    require: true,
    default: 0
  },
  product_img: {
    type: String
  }
})

module.exports = mongoose.model('products', products)