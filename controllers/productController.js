const CustomError = require("../utils/customError");
const BigPromise = require("../middlewares/bigPromise");

exports.showProductTest = BigPromise((req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Test Product Controller",
  });
});
