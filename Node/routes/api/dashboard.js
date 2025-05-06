const express = require("express")
const router = express.Router()
const DashboardController = require("../../controllers/DashboardController")

// @route   GET /api/dashboard/overview
// @desc    Get dashboard overview data
// @access  Private
router.get("/overview", DashboardController.getDashboardOverview)

// @route   GET /api/dashboard/stats/class
// @desc    Get vaccination statistics by class
// @access  Private
router.get("/stats/class", DashboardController.getVaccinationStatsByClass)

// @route   GET /api/dashboard/trends/monthly
// @desc    Get monthly vaccination trends
// @access  Private
router.get("/trends/monthly", DashboardController.getMonthlyVaccinationTrends)

module.exports = router
