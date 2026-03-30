const express = require("express");
const router = express.Router();
const { getBuyingPatterns } =
  require("../controllers/buyingPatternController");

router.get("/", getBuyingPatterns);

module.exports = router;