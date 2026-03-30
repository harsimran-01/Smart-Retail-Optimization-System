const express = require("express");
const router = express.Router();
const { generateForecast, getForecasts } = require("../controllers/forecastController");

router.get("/generate", generateForecast);
router.get("/", getForecasts);

module.exports = router;
