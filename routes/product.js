const express = require("express");
const router = express.Router();

// controller
const {
  addProduct,
  getAllProduct,
  getProductById,
  adminGetAllProduct,
  updateProduct,
  deleteProduct,
  addReview,
} = require("../controllers/productController");

// role and isloggedIn middleware
const { customRoles, isLoggedIn } = require("../middlewares/user");

// admin route
router
  .route("/admin/product")
  .post(isLoggedIn, customRoles("admin"), addProduct)
  .get(isLoggedIn, customRoles("admin"), adminGetAllProduct);

router
  .route("/admin/product/:id")
  .put(isLoggedIn, customRoles("admin"), updateProduct);

router
  .route("/product/:id")
  .get(isLoggedIn, customRoles("admin", "manager", "user"), getProductById)
  .delete(isLoggedIn, customRoles("admin"), deleteProduct);

// user route
router.route("/product").get(getAllProduct);
router
  .route("/product/review")
  .post(isLoggedIn, customRoles("user"), addReview);

module.exports = router;
