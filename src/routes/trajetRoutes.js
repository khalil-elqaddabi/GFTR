const express = require("express");

const trajetController = require("../controllers/trajetController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// ================================
// ADMIN
// ================================

// Create trajet
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  trajetController.createTrajet,
);

// Get all trajets
router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  trajetController.getAllTrajets,
);

// Update trajet / assignment
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  trajetController.updateTrajet,
);

// Delete trajet
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  trajetController.deleteTrajet,
);

// ================================
// CHAUFFEUR
// ================================

// Chauffeur's own trajets
router.get(
  "/mes-trajets",
  authMiddleware,
  roleMiddleware("CHAUFFEUR"),
  trajetController.getMyTrajets,
);

// Get one trajet
router.get("/:id", authMiddleware, trajetController.getTrajetById);

module.exports = router;
