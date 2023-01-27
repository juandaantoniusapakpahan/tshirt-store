const express = require("express");
const routes = express.Router();

const {
  signup,
  login,
  logout,
  forgotpassword,
  passwordReset,
} = require("../controllers/userController");

routes.route("/signup").post(signup);
routes.route("/login").post(login);
routes.route("/logout").get(logout);
routes.route("/forgotpassword").post(forgotpassword);
routes.route("/password/reset/:token").post(passwordReset);
module.exports = routes;
