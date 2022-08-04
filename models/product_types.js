const mongoose = require('mongoose')
const product_types = new mongoose.Schema({
  product_types_name: {
    type: String,
    unique: true,
    require: true,
  }
})

module.exports = mongoose.model('product_types', product_types)