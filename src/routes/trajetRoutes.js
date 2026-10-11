
const express = require("express");

const trajetController = require("../controllers/trajetController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Trajets
 *   description: Trip management, assignments, progress tracking and mission PDFs
 */

/**
 * @swagger
 * /api/trajets:
 *   post:
 *     summary: Create a trip
 *     tags: [Trajets]
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
 *         description: Trip created successfully
 *       400:
 *         description: Invalid trip data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  trajetController.createTrajet,
);

/**
 * @swagger
 * /api/trajets:
 *   get:
 *     summary: Get all trips
 *     tags: [Trajets]
 *     description: ADMIN only.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of trips
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 */
router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  trajetController.getAllTrajets,
);

/**
 * @swagger
 * /api/trajets/{id}:
 *   put:
 *     summary: Update a trip or its assignment
 *     tags: [Trajets]
 *     description: ADMIN only. Use the dedicated status endpoint to change trip status.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB trip ID
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
 *         description: Trip updated successfully
 *       400:
 *         description: Invalid trip data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Trip not found
 *       409:
 *         description: Assignment conflict or maintenance restriction
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  trajetController.updateTrajet,
);

/**
 * @swagger
 * /api/trajets/{id}:
 *   delete:
 *     summary: Delete a trip
 *     tags: [Trajets]
 *     description: ADMIN only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB trip ID
 *     responses:
 *       200:
 *         description: Trip deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Trip not found
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  trajetController.deleteTrajet,
);

/**
 * @swagger
 * /api/trajets/mes-trajets:
 *   get:
 *     summary: Get the authenticated driver's trips
 *     tags: [Trajets]
 *     description: CHAUFFEUR only. Returns the trips belonging to the authenticated driver.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Driver's trips retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Chauffeur role required
 */
router.get(
  "/mes-trajets",
  authMiddleware,
  roleMiddleware("CHAUFFEUR"),
  trajetController.getMyTrajets,
);

/**
 * @swagger
 * /api/trajets/{id}/status:
 *   patch:
 *     summary: Update trip status
 *     tags: [Trajets]
 *     description: Allows authorized users to update trip status according to the application's role and transition rules.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB trip ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["à faire", "en cours", "terminé"]
 *                 example: "en cours"
 *     responses:
 *       200:
 *         description: Trip status updated successfully
 *       400:
 *         description: Invalid status or forbidden status transition
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User is not authorized to update this trip
 *       404:
 *         description: Trip not found
 */
router.patch(
  "/:id/status",
  authMiddleware,
  trajetController.updateTrajetStatus
);

/**
 * @swagger
 * /api/trajets/{id}/mileage-fuel:
 *   put:
 *     summary: Update trip mileage and fuel consumption
 *     tags: [Trajets]
 *     description: CHAUFFEUR only. Updates trip mileage and fuel-related information.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB trip ID
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
 *         description: Mileage and fuel information updated successfully
 *       400:
 *         description: Invalid mileage or fuel data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Chauffeur role required or trip access denied
 *       404:
 *         description: Trip not found
 *       409:
 *         description: Mileage or trip state conflict
 */
router.put(
  "/:id/mileage-fuel",
  authMiddleware,
  roleMiddleware("CHAUFFEUR"),
  trajetController.updateMileageAndFuel
);

/**
 * @swagger
 * /api/trajets/{id}/pdf:
 *   get:
 *     summary: Download the trip mission order as PDF
 *     tags: [Trajets]
 *     description: Downloads the mission order PDF for an authorized user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB trip ID
 *     responses:
 *       200:
 *         description: Mission order PDF generated successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User is not authorized to download this trip's PDF
 *       404:
 *         description: Trip not found
 *       409:
 *         description: Required trip assignment data is missing
 */
router.get(
  "/:id/pdf",
  authMiddleware,
  trajetController.downloadTrajetPdf
);

/**
 * @swagger
 * /api/trajets/{id}:
 *   get:
 *     summary: Get a trip by ID
 *     tags: [Trajets]
 *     description: Available to authenticated users, subject to application access rules.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB trip ID
 *     responses:
 *       200:
 *         description: Trip details retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User is not authorized to access this trip
 *       404:
 *         description: Trip not found
 */
router.get("/:id", authMiddleware, trajetController.getTrajetById);

module.exports = router;
