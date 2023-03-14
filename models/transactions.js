const mongoose = require("mongoose");
const transactions = new mongoose.Schema(
  {
    ordersId: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      default: 0,
      require: false,
    },
    statusTransactions: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("transactions", transactions);
