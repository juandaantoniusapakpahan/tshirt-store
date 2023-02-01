const express = require("express");
const router = express.Router();

const { addProduct } = require("../controllers/productController");
const { customRoles, isLoggedIn } = require("../middlewares/user");

router.route("/product").post(isLoggedIn, customRoles("admin"), addProduct);

module.exports = router;
