
const express = require("express");
const analyticsRoutes = require("./analyticsRoutes");

const router = express.Router();

router.use("/analytics", analyticsRoutes);

router.get("/", (req, res) => {
  res.json({
    success: true,
    version: "2.0.0",
    message: "API v2 is working",
  });
});

module.exports = router;
