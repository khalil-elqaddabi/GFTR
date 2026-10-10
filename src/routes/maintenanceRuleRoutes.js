const express = require("express");

const maintenanceRuleController = require("../controllers/maintenanceRuleController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Create rule
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    maintenanceRuleController.createRule
);

// Get all rules
router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    maintenanceRuleController.getAllRules
);

// Check maintenance requirement
router.get(
    "/check/:resourceType/:resourceId",
    authMiddleware,
    roleMiddleware("ADMIN"),
    maintenanceRuleController.checkMaintenanceRequired
);

// Get rule by ID
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    maintenanceRuleController.getRuleById
);

// Update rule
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    maintenanceRuleController.updateRule
);

// Delete rule
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    maintenanceRuleController.deleteRule
);

module.exports = router;