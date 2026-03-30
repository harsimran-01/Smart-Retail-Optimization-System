const express = require("express");
const router = express.Router();
const { getInsights } = require("../controllers/aiInsightsController");
const { askAssistant } = require("../controllers/aiAssistantController");

router.get("/insights", getInsights);
router.post("/assistant", askAssistant);

module.exports = router;
