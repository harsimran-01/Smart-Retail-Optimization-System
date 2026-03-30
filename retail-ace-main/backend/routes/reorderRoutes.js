const express = require("express");
const router = express.Router();
const {
  getReorderRecommendations,
  placeReorder,
} = require("../controllers/reorderController");

router.get("/", getReorderRecommendations);
router.post("/place", placeReorder); 

module.exports = router;