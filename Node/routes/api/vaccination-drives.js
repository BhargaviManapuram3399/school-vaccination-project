const express = require("express");
const router = express.Router();
const VaccinationDriveController = require("../../controllers/VaccinationDriveController");

/**
 * @swagger
 * tags:
 *   name: VaccinationDrives
 *   description: Vaccination drive management
 */

/**
 * @swagger
 * /vaccination-drives:
 *   get:
 *     summary: Get all vaccination drives
 *     tags: [VaccinationDrives]
 *     responses:
 *       200:
 *         description: A list of vaccination drives
 */
router.get("/", VaccinationDriveController.getAllDrives);

/**
 * @swagger
 * /vaccination-drives/{id}:
 *   get:
 *     summary: Get a vaccination drive by ID
 *     tags: [VaccinationDrives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vaccination drive details
 */
router.get("/:id", VaccinationDriveController.getDriveById);

/**
 * @swagger
 * /vaccination-drives:
 *   post:
 *     summary: Create a new vaccination drive
 *     tags: [VaccinationDrives]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vaccination drive created
 */
router.post("/", VaccinationDriveController.createDrive);

/**
 * @swagger
 * /vaccination-drives/{id}:
 *   put:
 *     summary: Update a vaccination drive
 *     tags: [VaccinationDrives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vaccination drive updated
 */
router.put("/:id", VaccinationDriveController.updateDrive);

/**
 * @swagger
 * /vaccination-drives/{id}:
 *   delete:
 *     summary: Delete a vaccination drive
 *     tags: [VaccinationDrives]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vaccination drive deleted
 */
router.delete("/:id", VaccinationDriveController.deleteDrive);

/**
 * @swagger
 * /vaccination-drives/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics for vaccination drives
 *     tags: [VaccinationDrives]
 *     responses:
 *       200:
 *         description: Dashboard stats for drives
 */
router.get("/dashboard/stats", VaccinationDriveController.getDashboardStats);

/**
 * @swagger
 * /vaccination-drives/reports/generate:
 *   get:
 *     summary: Generate a vaccination report
 *     tags: [VaccinationDrives]
 *     responses:
 *       200:
 *         description: Vaccination report generated
 */
router.get("/reports/generate", VaccinationDriveController.generateReport);

module.exports = router;
