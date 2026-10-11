
const express = require("express");

const maintenanceController = require("../controllers/maintenanceController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Maintenances
 *   description: Maintenance operations for trucks and trailers
 */

/**
 * @swagger
 * /api/maintenances:
 *   post:
 *     summary: Create a maintenance record
 *     tags: [Maintenances]
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
 *         description: Maintenance created successfully
 *       400:
 *         description: Invalid maintenance data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    maintenanceController.createMaintenance
);

/**
 * @swagger
 * /api/maintenances:
 *   get:
 *     summary: Get all maintenance records
 *     tags: [Maintenances]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Maintenance records retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 */
router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    maintenanceController.getAllMaintenances
);

/**
 * @swagger
 * /api/maintenances/{id}:
 *   get:
 *     summary: Get a maintenance record by ID
 *     tags: [Maintenances]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB maintenance ID
 *     responses:
 *       200:
 *         description: Maintenance record found
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Maintenance not found
 */
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    maintenanceController.getMaintenanceById
);

/**
 * @swagger
 * /api/maintenances/{id}:
 *   put:
 *     summary: Update a maintenance record
 *     tags: [Maintenances]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB maintenance ID
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
 *         description: Maintenance updated successfully
 *       400:
 *         description: Invalid maintenance data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Maintenance not found
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    maintenanceController.updateMaintenance
);

/**
 * @swagger
 * /api/maintenances/{id}:
 *   delete:
 *     summary: Delete a maintenance record
 *     tags: [Maintenances]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB maintenance ID
 *     responses:
 *       200:
 *         description: Maintenance deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Maintenance not found
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    maintenanceController.deleteMaintenance
);

module.exports = router;
