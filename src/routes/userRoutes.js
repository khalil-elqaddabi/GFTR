const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List users without password fields
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User list retrieved
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 */
router.get("/", authMiddleware, roleMiddleware("ADMIN"), userController.getAllUsers);

/**
 * @swagger
 * /api/users/chauffeurs:
 *   post:
 *     summary: Create a Chauffeur account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, password]
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *     responses:
 *       201:
 *         description: Chauffeur created
 *       400:
 *         description: Required data is missing
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *       409:
 *         description: Email already exists
 */
router.post("/chauffeurs", authMiddleware, roleMiddleware("ADMIN"), userController.createChauffeur);

/**
 * @swagger
 * /api/users/{id}/status:
 *   patch:
 *     summary: Suspend or reactivate a Chauffeur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [isActive]
 *             properties:
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: Chauffeur status updated
 *       400:
 *         description: Invalid isActive value
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Chauffeur not found
 */
router.patch("/:id/status", authMiddleware, roleMiddleware("ADMIN"), userController.updateChauffeurStatus);

/**
 * @swagger
 * /api/users/chauffeurs/count:
 *   get:
 *     summary: Count Chauffeur accounts
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chauffeur count returned
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 */
router.get("/chauffeurs/count", authMiddleware, roleMiddleware("ADMIN"), userController.getChauffeursCount);

module.exports = router;
