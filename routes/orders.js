var express = require("express");
const { default: mongoose } = require("mongoose");
var router = express.Router();
const dayjs = require("dayjs");

const ordersModel = require("../models/orders");
const productsModel = require("../models/products");

//  CREATE ORDERS
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
          message: "can not buy",
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
        productOrder.push({ product, qty: item.product_amount });
        totalSum = totalSum + price;
      }
    }

    let newOrders = new ordersModel({
      productOrders: productOrder,
      total: totalSum,
      statusCode: "pending",
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

//get by id
router.get("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Invalid ID",
        success: false,
      });
    }
    let orders = await ordersModel.findById(id);
    return res.status(200).send({
      data: orders,
      message: "success",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "server error",
    });
  }
});

//update orders
router.put("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Invalid ID",
        success: false,
      });
    }
    await ordersModel.updateOne(
      {
        _id: mongoose.Types.ObjectId(id),
      },
      {
        $set: { statusCode: req.body.statusCode },
      }
    );
    let orders = await ordersModel.findById(id);
    return res.status(200).send({
      data: orders,
      message: "Update success",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "server error",
    });
  }
});

// GET ORDERS
router.get("/", async function (req, res, next) {
  try {
    let orders = await ordersModel.find();
    return res.status(200).send({
      data: orders,
      message: "OK",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "server error",
      success: false,
    });
  }
});

//dashboard ยอดรวมทั้งหมด และ จำนวน order ทั้งหมด
router.get("/dashboard/total", async function (req, res, next) {
  try {
    let orders = await ordersModel.find();
    let totalSumOrder = 0;
    let totalCountOrder = 0;
    let totalCountOrderSuccess = 0;
    let totalCountOrderFail = 0;
    let totalCountOrderPending = 0;
    for (const item of orders) {
      if (item.statusCode == "success") {
        totalSumOrder = totalSumOrder + item.total;
        totalCountOrderSuccess += 1;
      } else if (item.statusCode == "fail") {
        totalCountOrderFail += 1;
      } else {
        totalCountOrderPending += 1;
      }
      totalCountOrder += 1;
    }
    return res.status(200).send({
      data: {
        totalSumOrder,
        totalCountOrderSuccess,
        totalCountOrderFail,
        totalCountOrderPending,
        totalCountOrder,
      },
      message: "OK",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "server error",
      success: false,
    });
  }
});

// get dashboard by date totalSumOrder,totalCountOrder
router.get("/dashboard/date", async function (req, res, next) {
  try {
    const { startDate, endDate } = req.query;

    let convertStart = dayjs(startDate).startOf("day");
    let convertEnd = dayjs(endDate).endOf("day");

    let start = convertStart.$d;
    let end = convertEnd.$d;

    let totalSumOrder = 0;
    let totalCountOrder = 0;

    // let orders = []
    let orders = await ordersModel.find({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });
    for (const item of orders) {
      if (item.statusCode == "success") {
        totalSumOrder = totalSumOrder + item.total;
        totalCountOrder += 1;
      }
    }
    return res.status(200).send({
      data: { totalSumOrder, totalCountOrder },
      message: "OK",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "server error",
      success: false,
    });
  }
});
module.exports = router;
