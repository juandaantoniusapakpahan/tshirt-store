const express = require("express");
const routes = express.Router();

/** User Controller */
const {
  signup,
  login,
  logout,
  forgotpassword,
  passwordReset,
  userDashBoard,
  passwordUpdate,
  updateUser,
  adminUser,
} = require("../controllers/userController");

/** Middleware LoggedIn */
const { isLoggedIn, customRoles } = require("../middlewares/user");

/** Without LoggedIn */
routes.route("/signup").post(signup);
routes.route("/login").post(login);
routes.route("/logout").get(logout);
routes.route("/forgotpassword").post(forgotpassword);
routes.route("/password/reset/:token").post(passwordReset);

/** User Middleware LoggedIn */
routes.route("/userdashboard").get(isLoggedIn, userDashBoard);
routes.route("/update/password").post(isLoggedIn, passwordUpdate);
routes.route("/userdashboard/update").put(isLoggedIn, updateUser);
routes
  .route("/admin/users")
  .get(isLoggedIn, customRoles("admin", "manager"), adminUser);

module.exports = routes;
