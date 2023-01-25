const express = require("express");
const routes = express.Router();

const { signup } = require("../controllers/userController");

routes.route("/signup").post(signup);

module.exports = routes;
