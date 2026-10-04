const express = require("express");

const camionController = require("../controllers/camionController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Create Camion
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    camionController.createCamion
);

// Get all Camions
router.get(
    "/",
    authMiddleware,
    camionController.getAllCamions
);

// Get Camion by ID
router.get(
    "/:id",
    authMiddleware,
    camionController.getCamionById
);

// Update Camion
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    camionController.updateCamion
);

// Delete Camion
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    camionController.deleteCamion
);

module.exports = router;