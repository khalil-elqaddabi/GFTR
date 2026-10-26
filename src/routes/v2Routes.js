
const express = require("express");
const analyticsRoutes = require("./analyticsRoutes");
const authMiddleware = require("../middlewares/authMiddleware");
const trajetController = require("../controllers/trajetController");

const router = express.Router();

router.use("/analytics", analyticsRoutes);

// Generate a temporary URL for a stored mission-order PDF
router.get(
  "/trips/:id/mission-order-url",
  authMiddleware,
  trajetController.getMissionOrderUrl
);

router.get("/", (req, res) => {
  res.json({
    success: true,
    version: "2.0.0",
    message: "API v2 is working",
  });
});

module.exports = router;
