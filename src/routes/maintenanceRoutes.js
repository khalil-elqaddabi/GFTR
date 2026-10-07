const express = require("express");

const maintenanceController = require("../controllers/maintenanceController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Create Maintenance
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    maintenanceController.createMaintenance
);

// Get all Maintenances
router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    maintenanceController.getAllMaintenances
);

// Get Maintenance by ID
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    maintenanceController.getMaintenanceById
);

// Update Maintenance
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    maintenanceController.updateMaintenance
);

// Delete Maintenance
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    maintenanceController.deleteMaintenance
);

module.exports = router;