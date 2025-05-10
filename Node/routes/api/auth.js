const express = require("express");
const router = express.Router();
const LoginController = require("../../controllers/LoginController");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user login
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user and return a token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User authenticated
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", LoginController.login);

/**
 * @swagger
 * /auth/dashboard:
 *   get:
 *     summary: Get dashboard data for authenticated user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Dashboard data
 */
router.get("/dashboard", LoginController.dashboard);

module.exports = router;
