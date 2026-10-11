
const express = require("express");

const camionController = require("../controllers/camionController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Camions
 *   description: Truck management
 */

/**
 * @swagger
 * /api/camions:
 *   post:
 *     summary: Create a truck
 *     tags: [Camions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             example: {}
 *     responses:
 *       201:
 *         description: Truck created successfully
 *       400:
 *         description: Invalid truck data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    camionController.createCamion
);

/**
 * @swagger
 * /api/camions:
 *   get:
 *     summary: Get all trucks
 *     tags: [Camions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of trucks
 *       401:
 *         description: Authentication required
 */
router.get(
    "/",
    authMiddleware,
    camionController.getAllCamions
);

/**
 * @swagger
 * /api/camions/{id}:
 *   get:
 *     summary: Get a truck by ID
 *     tags: [Camions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB truck ID
 *     responses:
 *       200:
 *         description: Truck details
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Truck not found
 */
router.get(
    "/:id",
    authMiddleware,
    camionController.getCamionById
);

/**
 * @swagger
 * /api/camions/{id}:
 *   put:
 *     summary: Update a truck
 *     tags: [Camions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB truck ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             example: {}
 *     responses:
 *       200:
 *         description: Truck updated successfully
 *       400:
 *         description: Invalid truck data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Truck not found
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    camionController.updateCamion
);

/**
 * @swagger
 * /api/camions/{id}:
 *   delete:
 *     summary: Delete a truck
 *     tags: [Camions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB truck ID
 *     responses:
 *       200:
 *         description: Truck deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Truck not found
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    camionController.deleteCamion
);

module.exports = router;
