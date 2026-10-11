
const express = require("express");

const remorqueController = require("../controllers/remorqueController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Remorques
 *   description: Trailer management
 */

/**
 * @swagger
 * /api/remorques:
 *   post:
 *     summary: Create a new trailer
 *     tags: [Remorques]
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
 *         description: Trailer created successfully
 *       400:
 *         description: Invalid trailer data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    remorqueController.createRemorque
);

/**
 * @swagger
 * /api/remorques:
 *   get:
 *     summary: Get all trailers
 *     tags: [Remorques]
 *     description: Available to authenticated users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of trailers
 *       401:
 *         description: Authentication required
 */
router.get(
    "/",
    authMiddleware,
    remorqueController.getAllRemorques
);

/**
 * @swagger
 * /api/remorques/{id}:
 *   get:
 *     summary: Get a trailer by ID
 *     tags: [Remorques]
 *     description: Available to authenticated users.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB trailer ID
 *     responses:
 *       200:
 *         description: Trailer details
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Trailer not found
 */
router.get(
    "/:id",
    authMiddleware,
    remorqueController.getRemorqueById
);

/**
 * @swagger
 * /api/remorques/{id}:
 *   put:
 *     summary: Update a trailer
 *     tags: [Remorques]
 *     description: ADMIN only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB trailer ID
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
 *         description: Trailer updated successfully
 *       400:
 *         description: Invalid trailer data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Trailer not found
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    remorqueController.updateRemorque
);

/**
 * @swagger
 * /api/remorques/{id}:
 *   delete:
 *     summary: Delete a trailer
 *     tags: [Remorques]
 *     description: ADMIN only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB trailer ID
 *     responses:
 *       200:
 *         description: Trailer deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Trailer not found
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    remorqueController.deleteRemorque
);

module.exports = router;
