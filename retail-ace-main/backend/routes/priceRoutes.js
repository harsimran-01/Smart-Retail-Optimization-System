const express = require("express");
const router = express.Router();
const {
  getPriceSuggestions,
  applyPriceSuggestion
} = require("../controllers/priceController");

router.get("/", getPriceSuggestions);
router.put("/apply", applyPriceSuggestion);

module.exports = router;