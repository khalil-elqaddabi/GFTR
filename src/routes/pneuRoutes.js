const express = require("express");

const pneuController = require("../controllers/pneuController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Create Pneu
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    pneuController.createPneu
);

// Get all Pneus
router.get(
    "/",
    authMiddleware,
    pneuController.getAllPneus
);

// Get Pneu by ID
router.get(
    "/:id",
    authMiddleware,
    pneuController.getPneuById
);

// Update Pneu
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    pneuController.updatePneu
);

// Delete Pneu
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    pneuController.deletePneu
);

module.exports = router;