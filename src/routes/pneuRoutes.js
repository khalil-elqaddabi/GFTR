
const express = require("express");

const pneuController = require("../controllers/pneuController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pneus
 *   description: Tire management and mileage tracking
 */

/**
 * @swagger
 * /api/pneus:
 *   post:
 *     summary: Create a new tire
 *     tags: [Pneus]
 *     description: ADMIN only.
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
 *         description: Tire created successfully
 *       400:
 *         description: Invalid tire data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    pneuController.createPneu
);

/**
 * @swagger
 * /api/pneus:
 *   get:
 *     summary: Get all tires
 *     tags: [Pneus]
 *     description: Available to authenticated users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tires
 *       401:
 *         description: Authentication required
 */
router.get(
    "/",
    authMiddleware,
    pneuController.getAllPneus
);

/**
 * @swagger
 * /api/pneus/{id}/mileage:
 *   put:
 *     summary: Update tire mileage
 *     tags: [Pneus]
 *     description: ADMIN only. Updates tire mileage and may trigger wear alerts.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB tire ID
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
 *         description: Tire mileage updated
 *       400:
 *         description: Invalid mileage
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Tire not found
 */
router.put(
    "/:id/mileage",
    authMiddleware,
    roleMiddleware("ADMIN"),
    pneuController.updatePneuMileage
);

/**
 * @swagger
 * /api/pneus/{id}:
 *   get:
 *     summary: Get tire by ID
 *     tags: [Pneus]
 *     description: Available to authenticated users.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB tire ID
 *     responses:
 *       200:
 *         description: Tire details
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Tire not found
 */
router.get(
    "/:id",
    authMiddleware,
    pneuController.getPneuById
);

/**
 * @swagger
 * /api/pneus/{id}:
 *   put:
 *     summary: Update a tire
 *     tags: [Pneus]
 *     description: ADMIN only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB tire ID
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
 *         description: Tire updated successfully
 *       400:
 *         description: Invalid tire data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Tire not found
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    pneuController.updatePneu
);

/**
 * @swagger
 * /api/pneus/{id}:
 *   delete:
 *     summary: Delete a tire
 *     tags: [Pneus]
 *     description: ADMIN only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB tire ID
 *     responses:
 *       200:
 *         description: Tire deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Tire not found
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    pneuController.deletePneu
);

module.exports = router;
