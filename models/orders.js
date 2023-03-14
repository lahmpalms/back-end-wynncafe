const mongoose = require("mongoose");
const orders = new mongoose.Schema(
  {
    productOrders: {
      type: Array,
      required: true,
    },
    total: {
      type: Number,
      default: 0,
      require: false,
    },
    statusCode: {
      type: String,
      default: "pending",
    },
    statusPayment: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("orders", orders);
