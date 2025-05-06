const VaccinationDrive = require("../models/VaccinationDrive")
const Student = require("../models/Student")

// Get all vaccination drives with optional filtering
exports.getAllDrives = async (req, res) => {
  try {
    const { status, upcoming, vaccineName } = req.query
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Build query based on filters
    const query = {}
    if (status) query.status = status
    if (vaccineName) query.vaccineName = { $regex: vaccineName, $options: "i" }

    // Handle upcoming filter (next 30 days)
    if (upcoming === "true") {
      const today = new Date()
      const thirtyDaysLater = new Date()
      thirtyDaysLater.setDate(today.getDate() + 30)

      query.driveDate = {
        $gte: today,
        $lte: thirtyDaysLater,
      }
      query.status = "Scheduled"
    }

    // Execute query with pagination
    const drives = await VaccinationDrive.find(query).sort({ driveDate: 1 }).skip(skip).limit(limit)

    const total = await VaccinationDrive.countDocuments(query)

    res.json({
      success: true,
      data: drives,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching vaccination drives:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch vaccination drives",
      error: error.message,
    })
  }
}

// Get a single vaccination drive by ID
exports.getDriveById = async (req, res) => {
  try {
    const drive = await VaccinationDrive.findById(req.params.id)

    if (!drive) {
      return res.status(404).json({ success: false, message: "Vaccination drive not found" })
    }

    res.json({ success: true, data: drive })
  } catch (error) {
    console.error("Error fetching vaccination drive:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch vaccination drive",
      error: error.message,
    })
  }
}

// Create a new vaccination drive
exports.createDrive = async (req, res) => {
  try {
    const { driveDate, vaccineName } = req.body

    // Check if the drive date is at least 15 days in the future
    const today = new Date()
    const driveDateObj = new Date(driveDate)
    const diffTime = Math.abs(driveDateObj - today)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 15) {
      return res.status(400).json({
        success: false,
        message: "Vaccination drives must be scheduled at least 15 days in advance",
      })
    }

    // Check for overlapping drives with the same vaccine on the same day
    const existingDrive = await VaccinationDrive.findOne({
      vaccineName,
      driveDate: {
        $gte: new Date(driveDateObj.setHours(0, 0, 0, 0)),
        $lt: new Date(driveDateObj.setHours(23, 59, 59, 999)),
      },
    })

    if (existingDrive) {
      return res.status(400).json({
        success: false,
        message: `A drive for ${vaccineName} is already scheduled on this date`,
      })
    }

    const newDrive = new VaccinationDrive(req.body)
    await newDrive.save()

    res.status(201).json({
      success: true,
      data: newDrive,
      message: "Vaccination drive created successfully",
    })
  } catch (error) {
    console.error("Error creating vaccination drive:", error)
    res.status(400).json({
      success: false,
      message: "Failed to create vaccination drive",
      error: error.message,
    })
  }
}

// Update a vaccination drive
exports.updateDrive = async (req, res) => {
  try {
    const drive = await VaccinationDrive.findById(req.params.id)

    if (!drive) {
      return res.status(404).json({ success: false, message: "Vaccination drive not found" })
    }

    // Check if the drive is in the past
    const today = new Date()
    const driveDate = new Date(drive.driveDate)

    if (driveDate < today) {
      return res.status(400).json({
        success: false,
        message: "Cannot update past vaccination drives",
      })
    }

    // If changing the date, ensure it's at least 15 days in the future
    if (req.body.driveDate) {
      const newDriveDate = new Date(req.body.driveDate)
      const diffTime = Math.abs(newDriveDate - today)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays < 15) {
        return res.status(400).json({
          success: false,
          message: "Vaccination drives must be scheduled at least 15 days in advance",
        })
      }
    }

    const updatedDrive = await VaccinationDrive.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.json({
      success: true,
      data: updatedDrive,
      message: "Vaccination drive updated successfully",
    })
  } catch (error) {
    console.error("Error updating vaccination drive:", error)
    res.status(400).json({
      success: false,
      message: "Failed to update vaccination drive",
      error: error.message,
    })
  }
}

// Delete a vaccination drive
exports.deleteDrive = async (req, res) => {
  try {
    const drive = await VaccinationDrive.findById(req.params.id)

    if (!drive) {
      return res.status(404).json({ success: false, message: "Vaccination drive not found" })
    }

    // Check if the drive is in the past
    const today = new Date()
    const driveDate = new Date(drive.driveDate)

    if (driveDate < today) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete past vaccination drives",
      })
    }

    // Check if any students are already vaccinated in this drive
    const studentsVaccinated = await Student.countDocuments({
      "vaccinations.vaccineId": drive._id,
    })

    if (studentsVaccinated > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete drive as ${studentsVaccinated} students are already vaccinated`,
      })
    }

    await VaccinationDrive.findByIdAndDelete(req.params.id)

    res.json({ success: true, message: "Vaccination drive deleted successfully" })
  } catch (error) {
    console.error("Error deleting vaccination drive:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete vaccination drive",
      error: error.message,
    })
  }
}

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get total number of students
    const totalStudents = await Student.countDocuments()

    // Get number of vaccinated students (at least one completed vaccination)
    const vaccinatedStudents = await Student.countDocuments({
      "vaccinations.status": "Completed",
    })

    // Calculate vaccination percentage
    const vaccinationPercentage = totalStudents > 0 ? Math.round((vaccinatedStudents / totalStudents) * 100) : 0

    // Get upcoming vaccination drives (next 30 days)
    const today = new Date()
    const thirtyDaysLater = new Date()
    thirtyDaysLater.setDate(today.getDate() + 30)

    const upcomingDrives = await VaccinationDrive.find({
      driveDate: {
        $gte: today,
        $lte: thirtyDaysLater,
      },
      status: "Scheduled",
    }).sort({ driveDate: 1 })

    res.json({
      success: true,
      data: {
        totalStudents,
        vaccinatedStudents,
        vaccinationPercentage,
        upcomingDrives,
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    })
  }
}

// Generate vaccination report
exports.generateReport = async (req, res) => {
  try {
    const { vaccineName, fromDate, toDate, status } = req.query
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Build the query for students with vaccinations
    const query = { "vaccinations.0": { $exists: true } }

    // Add filters
    if (vaccineName) {
      query["vaccinations.vaccineName"] = vaccineName
    }

    if (status) {
      query["vaccinations.status"] = status
    }

    if (fromDate && toDate) {
      query["vaccinations.dateAdministered"] = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      }
    }

    // Execute query with pagination
    const students = await Student.find(query).sort({ name: 1 }).skip(skip).limit(limit)

    const total = await Student.countDocuments(query)

    // Format the data for the report
    const reportData = students.map((student) => {
      const filteredVaccinations = student.vaccinations.filter((v) => {
        let match = true
        if (vaccineName) match = match && v.vaccineName === vaccineName
        if (status) match = match && v.status === status
        if (fromDate && toDate) {
          const vDate = new Date(v.dateAdministered)
          match = match && vDate >= new Date(fromDate) && vDate <= new Date(toDate)
        }
        return match
      })

      return {
        _id: student._id,
        name: student.name,
        studentId: student.studentId,
        class: student.class,
        grade: student.grade,
        vaccinations: filteredVaccinations,
      }
    })

    res.json({
      success: true,
      data: reportData,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error generating vaccination report:", error)
    res.status(500).json({
      success: false,
      message: "Failed to generate vaccination report",
      error: error.message,
    })
  }
}
