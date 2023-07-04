const express = require("express");
const router = express.Router();
const activityLog = require("../models/activityLogModel");

router.get("/", async (req, res) => {
  try {
    const activityLogs = await activityLog.find();
    res.status(200).json({
      success: true,
      data: activityLogs,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error,
    });
  }
});

module.exports = router;
