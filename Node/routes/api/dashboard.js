const express = require("express");
const router = express.Router();
const DashboardController = require("../../controllers/DashboardController");

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard-related insights and statistics
 */

/**
 * @swagger
 * /dashboard/overview:
 *   get:
 *     summary: Get dashboard overview data
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard overview data
 */
router.get("/overview", DashboardController.getDashboardOverview);

/**
 * @swagger
 * /dashboard/stats/class:
 *   get:
 *     summary: Get vaccination statistics by class
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Vaccination statistics by class
 */
router.get("/stats/class", DashboardController.getVaccinationStatsByClass);

/**
 * @swagger
 * /dashboard/trends/monthly:
 *   get:
 *     summary: Get monthly vaccination trends
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Monthly vaccination trend data
 */
router.get("/trends/monthly", DashboardController.getMonthlyVaccinationTrends);

module.exports = router;
