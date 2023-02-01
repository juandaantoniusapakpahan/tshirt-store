const CustomError = require("../utils/customError");
const BigPromise = require("../middlewares/bigPromise");
const Product = require("../models/product");
const cloudinary = require("cloudinary");
const WhereClause = require("../utils/whereClause");

exports.addProduct = BigPromise(async (req, res, next) => {
  const imageArray = [];

  if (!req.files) {
    return next(new CustomError("Please provide photo", 400));
  }

  if (req.files) {
    for (let i = 0; i < req.files.photos.length; i++) {
      let result = await cloudinary.v2.uploader.upload(
        req.files.photos[i].tempFilePath,
        {
          folder: "products",
        }
      );

      imageArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }
  req.body.photos = imageArray;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

exports.getAllProduct = BigPromise(async (req, res, next) => {
  const resultPerPage = 5;
  const totalcountProduct = await Product.countDocuments();

  const productsResunt = new WhereClause(Product.find(), req.query)
    .search()
    .filter();

  if (!productsResunt) {
    return next(new CustomError("NonFound Data", 400));
  }
  const filteredProductNumber = productsResunt.length;

  productsResunt.pager(resultPerPage);
  const products = await productsResunt.base.clone();

  res.status(200).json({
    success: true,
    products,
    filteredProductNumber,
    totalcountProduct,
  });
});

exports.getProductById = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new CustomError("Not Found Product!", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

exports.adminGetAllProduct = BigPromise(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

exports.updateProduct = BigPromise(async (req, res, next) => {
  const productCheck = await Product.findById(req.params.id);

  if (!productCheck) {
    return next(new CustomError("No product found with this id", 404));
  }

  if (req.files) {
    // destroy image
    for (let index = 0; index < productCheck.photos.length; index++) {
      await cloudinary.v2.uploader.destroy(productCheck.photos[index].id);
    }

    let imageArray = [];
    // upload image
    for (let index = 0; index < req.files.photos.length; index++) {
      const resultUpload = await cloudinary.v2.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: "products",
        }
      );

      imageArray.push({
        id: resultUpload.public_id,
        secure_url: resultUpload.secure_url,
      });
    }
    req.body.photos = imageArray;
  }

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

exports.deleteProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new CustomError("No product found with this id"), 404);
  }

  // delete image from cloudinary
  for (let index = 0; index < product.photos.length; index++) {
    await cloudinary.v2.uploader.destroy(product.photos[index].id);
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Success delete product",
  });
});
