const express = require("express");
const router = express.Router();

const {
  home,
  homeDashboard,
  homeBill,
  greenHome,
} = require("../controllers/homeController");

router.route("/").get(home);
router.route("/home-dashboard").get(homeDashboard);
router.route("/home-bill").get(homeBill);
router.route("/green-home").get(greenHome);

module.exports = router;
