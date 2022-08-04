var express = require("express");
const { default: mongoose } = require("mongoose");
var router = express.Router();

const product_types_model = require("../models/product_types");

router.post("/", async function (req, res, next) {
  try {
    const { product_types_name } = req.body;
    let new_product_types_name = new product_types_model({
      product_types_name: product_types_name
    });
    let product_types = await new_product_types_name.save();
    return res.status(200).send({
      data: product_types,
      message: "Create success",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Create fail.",
      success: false,
    });
  }
})

router.get("/", async function (req, res, next) {
  try {
    let product_types = await product_types_model.find();
    return res.status(200).send({
      data: product_types,
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