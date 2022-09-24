var express = require("express");
const { default: mongoose } = require("mongoose");
var router = express.Router();

const ordersModel = require("../models/orders");
const productsModel = require("../models/products");


router.post("/", async function (req, res, next) {
  try {
    let totalSum = 0;
    let productOrder = [];
    for (const item of req.body) {
      const product = await productsModel.findById(item.product_id);
      if (
        product.product_amount < item.product_amount ||
        product.product_amount == 0
      ) {
        return res.status(400).send({
          data: [],
          message: "Can not Buy",
          success: false,
        });
      } else {
        const totalAmount = product.product_amount - item.product_amount;
        const price = product.product_price * item.product_amount;
        await productsModel.updateOne(
          {
            _id: mongoose.Types.ObjectId(product._id),
          },
          {
            $set: { product_amount: totalAmount },
          }
        );
        productOrder.push(product);
        totalSum = totalSum + price;
      }
    }

    let newOrders = new ordersModel({
      productOrders: productOrder,
      total: totalSum,
      statusCode: 'pending'
    });
    let orders = await newOrders.save();
    return res.status(200).send({
      data: orders,
      message: "Create success",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Create fail.",
      success: false,
    });
  }
});

module.exports = router;
