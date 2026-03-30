const express = require("express");
const router = express.Router();
const { getAlerts, generateAlerts, markRead, markAllRead } = require("../controllers/alertController");

router.get("/", getAlerts);
router.post("/generate", generateAlerts);
router.patch("/:id/read", markRead);
router.patch("/read-all", markAllRead);

module.exports = router;
