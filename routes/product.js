const express = require("express");
const router = express.Router();

const {
  addProduct,
  getAllProduct,
} = require("../controllers/productController");
const { customRoles, isLoggedIn } = require("../middlewares/user");

router
  .route("/product")
  .post(isLoggedIn, customRoles("admin"), addProduct)
  .get(isLoggedIn, customRoles("admin"), getAllProduct);

module.exports = router;
