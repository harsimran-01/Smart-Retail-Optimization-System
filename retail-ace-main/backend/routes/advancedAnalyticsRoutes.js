const express = require("express");
const router = express.Router();
const { getAdvancedAnalytics } = require("../controllers/advancedAnalyticsController");

router.get("/", getAdvancedAnalytics);

module.exports = router;
