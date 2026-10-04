const express = require("express");

const remorqueController = require("../controllers/remorqueController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Create Remorque
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    remorqueController.createRemorque
);

// Get all Remorques
router.get(
    "/",
    authMiddleware,
    remorqueController.getAllRemorques
);

// Get Remorque by ID
router.get(
    "/:id",
    authMiddleware,
    remorqueController.getRemorqueById
);

// Update Remorque
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    remorqueController.updateRemorque
);

// Delete Remorque
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    remorqueController.deleteRemorque
);

module.exports = router;