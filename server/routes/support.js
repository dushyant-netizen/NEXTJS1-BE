// routes/support.js
const express = require("express");
const router = express.Router();
const { handleAgentMessage } = require("../controllers/supportAgent");

// POST endpoint for the AI agent conversation stream
router.post("/agent", handleAgentMessage);

module.exports = router;