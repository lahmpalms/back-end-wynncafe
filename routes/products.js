var express = require("express");
const { default: mongoose } = require("mongoose");
var router = express.Router();

const productsModel = require("../models/products");

//Get all product
router.get("/", async function (req, res, next) {
  try {
    let products = await productsModel.find();
    return res.status(200).send({
      data: products,
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

// Get product by ID
router.get("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Invalid ID",
        success: false,
      });
    }
    let products = await productsModel.findById(id);
    return res.status(200).send({
      data: products,
      message: "success",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Server error",
      success: false,
    });
  }
});

// Create Product
router.post("/", async function (req, res, next) {
  try {
    const { product_name, product_price, product_amount, product_detail, product_types } =
      req.body;
    let newProduct = new productsModel({
      product_name: product_name,
      product_types: product_types,
      product_price: product_price,
      product_detail: product_detail,
      product_amount: product_amount,
    });
    let product = await newProduct.save();
    return res.status(200).send({
      data: product,
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

// Update product
router.put("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Invalid ID",
        success: false,
      });
    }
    await productsModel.updateOne(
      {
        _id: mongoose.Types.ObjectId(id),
      },
      {
        $set: req.body,
      }
    );
    let product = await productsModel.findById(id);
    return res.status(200).send({
      data: product,
      message: "Update success",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "server error",
    });
  }
});
// Delete product
router.delete("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Invalid ID",
        success: false,
      });
    }
    await productsModel.deleteOne(
      {
        _id: mongoose.Types.ObjectId(id),
      }
    );
    let product = await productsModel.findById(id);
    return res.status(200).send({
      message: "Delete success",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "server error",
    });
  }
});

module.exports = router;
