const User = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const cloudinary = require("cloudinary");
const sendNodemail = require("../utils/emailHelper");
const crypto = require("crypto");

exports.signup = BigPromise(async (req, res, next) => {
  let result;
  if (!req.files) {
    return next(new CustomError("Photo is required for signup", 400));
  }

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new CustomError("name, email and password are required", 400));
  }

  let file = req.files.photo;
  result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
    folder: "users",
    width: 150,
    crop: "scale",
  });

  const user = await User.create({
    name,
    email,
    password,
    photo: {
      id: result.public_id,
      secure_url: result.secure_url,
    },
  });

  cookieToken(user, res);
});

exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  // check payload
  if (!email || !password) {
    return next(new CustomError("Please provide email and password!", 400));
  }

  // check datatype payload
  if (typeof email !== "string" || typeof password !== "string") {
    return next(
      new CustomError("Please provide email and password correctly", 400)
    );
  }

  // check email in database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new CustomError("Email does not exist", 400));
  }

  // compare password
  const isCorrectPassword = await user.isValidatedPassword(password);

  if (!isCorrectPassword) {
    return next(new CustomError("Email or password does not match or exist"));
  }

  // if all goes goood and we send the token
  cookieToken(user, res);
});

exports.logout = BigPromise(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    message: "Logout Success",
  });
});

exports.forgotpassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new CustomError("Email not found as registered", 400));
  }

  const forgotToken = user.getForgotPasswordToken();

  await user.save({ validateBeforeSave: false });

  const urlResetPassword = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${forgotToken}`;

  const message = `Click this link to rest your password: \n\n ${urlResetPassword}`;

  try {
    await sendNodemail({
      email: user.email,
      subject: "JJS - Password reset email",
      message,
    });

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    user.save({ validateBeforeSave: false });

    return next(new CustomError(error.message, 500));
  }
});

exports.passwordReset = BigPromise(async (req, res, next) => {
  const token = req.params.token;

  const forgotPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new CustomError("Token is invalid or expired!"));
  }

  if (req.body.password !== req.body.passwordConfirm) {
    return next(new CustomError("Password and confirm password do not match"));
  }

  user.password = req.body.password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();

  cookieToken(user, res);
});

exports.userDashBoard = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  user.password = undefined;
  res.status(200).json({
    success: true,
    user,
  });
});

exports.passwordUpdate = BigPromise(async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findById(userId).select("+password");

  const checkOldPassword = await user.isValidatedPassword(req.body.oldPassword);

  if (!checkOldPassword) {
    return next(new CustomError("Old Password is incorrect!"));
  }

  user.password = req.body.newPassword;

  await user.save();

  cookieToken(user, res);
});

exports.updateUser = BigPromise(async (req, res, next) => {
  const newPayload = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.files) {
    const userId = await User.findById(req.user.id);
    const photoId = userId.photo.id;

    await cloudinary.v2.uploader.destroy(photoId);

    const uploadPhoto = await cloudinary.v2.uploader.upload(
      req.files.photo.tempFilePath,
      {
        folder: "users",
        width: 150,
        crop: "scale",
      }
    );

    newPayload.photo = {
      id: uploadPhoto.public_id,
      secure_url: uploadPhoto.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newPayload, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });

  res.status(200).json({
    success: true,
    message: "Profil berhasil diubah",
    user,
  });
});

exports.adminUser = BigPromise(async (req, res, next) => {
  const users = await User.find({ role: "user" });

  res.status(200).json({
    success: true,
    users,
  });
});

exports.getUserById = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

exports.adminUpdateUserDetails = BigPromise(async (req, res, next) => {
  const payload = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

exports.adminDeleteUser = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new CustomError("not found User!!", 404));
  }

  await cloudinary.v2.uploader.destroy(user.photo.id);

  await user.remove();

  res.status(200).json({
    success: true,
    message: "Success delete user!!",
  });
});
