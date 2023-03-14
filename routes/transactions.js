var express = require("express");
const { default: mongoose } = require("mongoose");
var router = express.Router();
const dayjs = require("dayjs");

const ordersModel = require("../models/orders");
const transactionsModel = require("../models/transactions");

router.post("/", async function (req, res, next) {
  try {
    console.log(req.body);
    let ordersId = req.body.ordersId;
    let orders = await ordersModel.findById(ordersId);
    if (!!orders) {
      await ordersModel
        .updateOne(
          {
            _id: mongoose.Types.ObjectId(ordersId),
          },
          {
            $set: { statusCode: req.body.status },
          }
        )
        .then(async () => {
          let transaction = new transactionsModel({
            ordersId: req.body.ordersId,
            total: orders.total,
            statusTransactions: req.body.status,
          });
          let transactionData = await transaction.save();
          console.log(transactionData);
          return res.status(200).send({
            data: transactionData,
            message: "success",
            success: true,
          });
        });
    } else {
      return res.status(400).send({
        message: "not found orders id",
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: "server error",
      success: false,
    });
  }
});

module.exports = router;
