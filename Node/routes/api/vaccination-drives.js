const express = require("express")
const router = express.Router()
const VaccinationDriveController = require("../../controllers/VaccinationDriveController")

// @route   GET /api/vaccination-drives
// @desc    Get all vaccination drives with optional filtering
// @access  Private
router.get("/", VaccinationDriveController.getAllDrives)

// @route   GET /api/vaccination-drives/:id
// @desc    Get a single vaccination drive by ID
// @access  Private
router.get("/:id", VaccinationDriveController.getDriveById)

// @route   POST /api/vaccination-drives
// @desc    Create a new vaccination drive
// @access  Private
router.post("/", VaccinationDriveController.createDrive)

// @route   PUT /api/vaccination-drives/:id
// @desc    Update a vaccination drive
// @access  Private
router.put("/:id", VaccinationDriveController.updateDrive)

// @route   DELETE /api/vaccination-drives/:id
// @desc    Delete a vaccination drive
// @access  Private
router.delete("/:id", VaccinationDriveController.deleteDrive)

// @route   GET /api/vaccination-drives/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get("/dashboard/stats", VaccinationDriveController.getDashboardStats)

// @route   GET /api/vaccination-drives/reports/generate
// @desc    Generate vaccination report
// @access  Private
router.get("/reports/generate", VaccinationDriveController.generateReport)

module.exports = router
