const express = require("express");

const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/camions", require("./camionRoutes"));
router.use("/remorques", require("./remorqueRoutes"));
router.use("/pneus", require("./pneuRoutes"));
router.use("/trajets", require("./trajetRoutes"));
router.use("/maintenances", require("./maintenanceRoutes"));
router.use("/maintenance-rules", require("./maintenanceRuleRoutes"));

module.exports = router;