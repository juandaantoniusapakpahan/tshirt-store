const CustomError = require("../utils/customError");
const BigPromise = require("./bigPromise");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.isLoggedIn = BigPromise(async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];

  if (!token) {
    return next(new CustomError("Login first to access this page!"));
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decode.id);

  next();
});
