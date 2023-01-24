var express = require("express");
const { default: mongoose } = require("mongoose");
var router = express.Router();
const JsonWebToken = require("jsonwebtoken");
const BodyParser = require("body-parser");
const Bcrypt = require("bcryptjs");
const { JWT_SECREAT_KEY } = process.env

const usersModel = require("../models/users");

/* POST users . */
router.post("/signup", async function (req, res, next) {
  try {
    const { firstName, lastName, tel, email, gender, password } = req.body;
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({
        message: "please check email or password",
        success: false,
      });
      return;
    }
    let newUsers = new usersModel({
      f_name: firstName,
      l_name: lastName,
      tel: tel,
      email: email,
      password: Bcrypt.hashSync(password, 10),
      gender: gender,
    });

    let users = await newUsers.save();
    const token = JsonWebToken.sign({users} ,JWT_SECREAT_KEY )
    return res.status(200).send({
      token: token,
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

//login
router.post("/signin", async function (req, res, next) {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({
        statusCode: 400,
        message: "please check email or password",
        success: false,
      });
      return;
    }

    const users = await usersModel.findOne({ email: req.body.email });
    if (!users) {
      return res.status(400).send({
        message: "Incorrect email",
        success: false,
      });
    } else {
      if (!Bcrypt.compareSync(req.body.password, users.password)) {
        return res.status(400).send({
          message: "Incorrect password",
          success: false,
        });
      } else {
        const token = JsonWebToken.sign({users} ,JWT_SECREAT_KEY )
        return res.status(200).send({
          token: token,
          message: "success",
          success: true,
        });
      }
    }
  } catch (error) {
    return res.status(500).send({
      message: "Create fail.",
      success: false,
    });
  }
});

module.exports = router;
