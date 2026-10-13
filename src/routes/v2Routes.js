const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    version: "2.0.0",
    message: "API v2 is working"
  });
});

module.exports = router;