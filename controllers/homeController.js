const BigPromise = require("../middlewares/bigPromise");

exports.home = (req, res) => {
  res.status(200).json({
    status: true,
    greeting: "this is hello from API",
  });
};

exports.homeDashboard = BigPromise(async (req, res) => {
  res.status(200).json({
    status: true,
    greeting: "Welcome to Dashboard Page",
  });
});

exports.homeBill = async (req, res) => {
  res.status(200).json({
    status: true,
    greeting: "Welcome to home Bill Page",
  });
};

exports.greenHome = BigPromise(async (req, res) => {
  try {
    res.status(200).json({
      status: true,
      greeting: "Welcom to Green Home",
    });
  } catch (error) {
    console.log(error);
  }
});
