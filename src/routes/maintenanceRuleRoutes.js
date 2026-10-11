
const express = require("express");

const maintenanceRuleController = require("../controllers/maintenanceRuleController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Maintenance Rules
 *   description: Maintenance rules and maintenance requirement checks
 */

/**
 * @swagger
 * /api/maintenance-rules:
 *   post:
 *     summary: Create a maintenance rule
 *     tags: [Maintenance Rules]
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
 *         description: Maintenance rule created successfully
 *       400:
 *         description: Invalid maintenance rule data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    maintenanceRuleController.createRule
);

/**
 * @swagger
 * /api/maintenance-rules:
 *   get:
 *     summary: Get all maintenance rules
 *     tags: [Maintenance Rules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Maintenance rules retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 */
router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    maintenanceRuleController.getAllRules
);

/**
 * @swagger
 * /api/maintenance-rules/check/{resourceType}/{resourceId}:
 *   get:
 *     summary: Check whether maintenance is required for a resource
 *     tags: [Maintenance Rules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resourceType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [camion, remorque]
 *         description: Type of resource to check
 *       - in: path
 *         name: resourceId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the resource
 *     responses:
 *       200:
 *         description: Maintenance requirement check completed
 *       400:
 *         description: Invalid resource type or ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Resource not found
 */
router.get(
    "/check/:resourceType/:resourceId",
    authMiddleware,
    roleMiddleware("ADMIN"),
    maintenanceRuleController.checkMaintenanceRequired
);

/**
 * @swagger
 * /api/maintenance-rules/{id}:
 *   get:
 *     summary: Get a maintenance rule by ID
 *     tags: [Maintenance Rules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB maintenance rule ID
 *     responses:
 *       200:
 *         description: Maintenance rule found
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Maintenance rule not found
 */
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    maintenanceRuleController.getRuleById
);

/**
 * @swagger
 * /api/maintenance-rules/{id}:
 *   put:
 *     summary: Update a maintenance rule
 *     tags: [Maintenance Rules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB maintenance rule ID
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
 *         description: Maintenance rule updated successfully
 *       400:
 *         description: Invalid maintenance rule data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Maintenance rule not found
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    maintenanceRuleController.updateRule
);

/**
 * @swagger
 * /api/maintenance-rules/{id}:
 *   delete:
 *     summary: Delete a maintenance rule
 *     tags: [Maintenance Rules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB maintenance rule ID
 *     responses:
 *       200:
 *         description: Maintenance rule deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Maintenance rule not found
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    maintenanceRuleController.deleteRule
);

module.exports = router;
