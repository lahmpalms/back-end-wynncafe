var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
//connect DB
require("dotenv").config();
// console.log('172.20.1.11');
const mongoose = require("mongoose");
const { DB_HOST, DB_NAME, DB_PORT, DB_USER, DB_PASS } = process.env;

console.log(DB_HOST);
mongoose
  .connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
    user: DB_USER,
    pass: DB_PASS,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connect");
  })
  .catch((err) => {
    console.log("connect fail!");
  });
// mongoose
//   .connect(`mongodb+srv://${DB_HOST}`, {
//     user: DB_USER,
//     pass: DB_PASS,
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//   })
//   .then(() => {
//     console.log("connect");
//   })
//   .catch((err) => {
//     console.log("connect fail!");
//   });

var indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
// project
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");

var app = express();
var cors = require("cors");
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
