const express = require("express")
const router = express.Router()
const LoginController = require("../../controllers/LoginController")

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", LoginController.login)

// @route   GET /api/auth/user
// @desc    Get current user
// @access  Private
// router.get("/user", LoginController.getCurrentUser)

// @route   GET /api/auth/dashboard
// @desc    Get dashboard data
// @access  Private
router.get("/dashboard", LoginController.dashboard)

module.exports = router
