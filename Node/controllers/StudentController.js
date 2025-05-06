const Student = require("../models/Student")
const VaccinationDrive = require("../models/VaccinationDrive")
const csv = require("csv-parser")
const fs = require("fs")
const { Readable } = require("stream")
const XLSX = require("xlsx")

// Get all students with optional filtering
exports.getAllStudents = async (req, res) => {
  try {
    const { name, studentId, class: studentClass, vaccinationStatus } = req.query
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Build query based on filters
    const query = {}
    if (name) query.name = { $regex: name, $options: "i" }
    if (studentId) query.studentId = { $regex: studentId, $options: "i" }
    if (studentClass) query.class = studentClass

    // Handle vaccination status filtering
    if (vaccinationStatus) {
      if (vaccinationStatus === "vaccinated") {
        query["vaccinations.status"] = "Completed"
      } else if (vaccinationStatus === "not-vaccinated") {
        query.$or = [{ vaccinations: { $size: 0 } }, { "vaccinations.status": { $ne: "Completed" } }]
      }
    }

    // Execute query with pagination
    const students = await Student.find(query).sort({ studentId: 1 }).skip(skip).limit(limit)

    const total = await Student.countDocuments(query)

    res.json({
      success: true,
      data: students,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching students:", error)
    res.status(500).json({ success: false, message: "Failed to fetch students", error: error.message })
  }
}

// Get a single student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" })
    }

    res.json({ success: true, data: student })
  } catch (error) {
    console.error("Error fetching student:", error)
    res.status(500).json({ success: false, message: "Failed to fetch student", error: error.message })
  }
}

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const newStudent = new Student(req.body)
    await newStudent.save()

    res.status(201).json({ success: true, data: newStudent, message: "Student created successfully" })
  } catch (error) {
    console.error("Error creating student:", error)
    res.status(400).json({ success: false, message: "Failed to create student", error: error.message })
  }
}

// Update a student
exports.updateStudent = async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!updatedStudent) {
      return res.status(404).json({ success: false, message: "Student not found" })
    }

    res.json({ success: true, data: updatedStudent, message: "Student updated successfully" })
  } catch (error) {
    console.error("Error updating student:", error)
    res.status(400).json({ success: false, message: "Failed to update student", error: error.message })
  }
}

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id)

    if (!deletedStudent) {
      return res.status(404).json({ success: false, message: "Student not found" })
    }

    res.json({ success: true, message: "Student deleted successfully" })
  } catch (error) {
    console.error("Error deleting student:", error)
    res.status(500).json({ success: false, message: "Failed to delete student", error: error.message })
  }
}

// Bulk import students from CSV

exports.bulkImportStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" })
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json(worksheet)

    const errors = []
    let importedCount = 0

    for (const row of rows) {
      try {
        // Check if student already exists
        // console.log("Parsed row:", row);
        const existingStudent = await Student.findOne({ studentId: row.studentId })
        if (existingStudent) {
          errors.push(`Student with ID ${row.studentId} already exists`)
          continue
        }

        // Parse vaccinations if provided (stringified JSON format)
        let vaccinations = []
        if (row.vaccinations) {
          try {
            vaccinations = JSON.parse(row.vaccinations)
          } catch (err) {
            errors.push(`Invalid vaccination format for ${row.studentId}`)
          }
        }

        const newStudent = new Student({
          name: row.name,
          studentId: row.studentId,
          class: row.class,
          grade: row.grade,
          age: parseInt(row.age),
          gender: row.gender,
          parentName: row.parentName,
          contactNumber: row.contactNumber,
          vaccinations: vaccinations,
        })
        
        // console.log("Saving student:", newStudent);
        await newStudent.save()
        importedCount++
      } catch (error) {
        errors.push(`Error processing student ${row.studentId}: ${error.message}`)
      }
    }

    res.json({
      success: true,
      message: `Imported ${importedCount} students successfully`,
      errors: errors.length > 0 ? errors : null,
    })
  } catch (error) {
    console.error("Error importing students:", error)
    res.status(500).json({ success: false, message: "Failed to import students", error: error.message })
  }
}

// Mark student as vaccinated
exports.markVaccinated = async (req, res) => {
  try {
    const { studentId, driveId } = req.params

    // Find the student
    const student = await Student.findById(studentId)
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" })
    }

    // Find the vaccination drive
    const drive = await VaccinationDrive.findById(driveId)
    if (!drive) {
      return res.status(404).json({ success: false, message: "Vaccination drive not found" })
    }

    // Check if student is already vaccinated for this vaccine
    const alreadyVaccinated = student.vaccinations.some(
      (v) => v.vaccineName === drive.vaccineName && v.status === "Completed",
    )

    if (alreadyVaccinated) {
      return res.status(400).json({
        success: false,
        message: `Student is already vaccinated for ${drive.vaccineName}`,
      })
    }

    // Check if drive has available doses
    if (drive.availableDoses <= 0) {
      return res.status(400).json({
        success: false,
        message: "No doses available for this vaccination drive",
      })
    }

    // Add vaccination record to student
    student.vaccinations.push({
      vaccineId: drive._id,
      vaccineName: drive.vaccineName,
      dateAdministered: new Date(),
      status: "Completed",
    })

    await student.save()

    // Decrease available doses in the drive
    drive.availableDoses -= 1
    await drive.save()

    res.json({
      success: true,
      message: `Student marked as vaccinated for ${drive.vaccineName}`,
      data: student,
    })
  } catch (error) {
    console.error("Error marking student as vaccinated:", error)
    res.status(500).json({
      success: false,
      message: "Failed to mark student as vaccinated",
      error: error.message,
    })
  }
}
