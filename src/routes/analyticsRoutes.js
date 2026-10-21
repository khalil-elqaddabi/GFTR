
const express = require("express");

const analyticsController = require("../controllers/analyticsController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// All analytics endpoints require authentication and ADMIN role
router.use(authMiddleware, roleMiddleware("ADMIN"));

router.get(
    "/drivers/eco-performance",
    analyticsController.getDriversEcoPerformance
);
router.get(
  "/tires/health-matrix",
  analyticsController.getTiresHealthMatrix
);
router.get(
  "/trips/financial-esg",
  analyticsController.getTripsFinancialESG
);
router.get(
  "/fleet/utilization-trends",
  analyticsController.getFleetUtilizationTrends
);


module.exports = router;
