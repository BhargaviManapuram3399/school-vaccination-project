const express = require("express")
const router = express.Router()
const StudentController = require("../../controllers/StudentController")
const multer = require("multer")

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({ storage })

// @route   GET /api/students
// @desc    Get all students with optional filtering
// @access  Private
router.get("/", StudentController.getAllStudents)

// @route   GET /api/students/:id
// @desc    Get a single student by ID
// @access  Private
router.get("/:id", StudentController.getStudentById)

// @route   POST /api/students
// @desc    Create a new student
// @access  Private
router.post("/", StudentController.createStudent)

// @route   PUT /api/students/:id
// @desc    Update a student
// @access  Private
router.put("/:id", StudentController.updateStudent)

// @route   DELETE /api/students/:id
// @desc    Delete a student
// @access  Private
router.delete("/:id", StudentController.deleteStudent)

// @route   POST /api/students/import
// @desc    Bulk import students from CSV
// @access  Private
router.post("/import", upload.single("file"), StudentController.bulkImportStudents)

// @route   PUT /api/students/:studentId/vaccinate/:driveId
// @desc    Mark student as vaccinated
// @access  Private
router.put("/:studentId/vaccinate/:driveId", StudentController.markVaccinated)

module.exports = router
