const express = require("express");
const router = express.Router();

const { showProductTest } = require("../controllers/productController");

router.route("/test/product").get(showProductTest);

module.exports = router;
