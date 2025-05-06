const mongoose = require("mongoose")

const vaccinationDriveSchema = new mongoose.Schema({
  vaccineName: {
    type: String,
    required: true,
    trim: true,
  },
  driveDate: {
    type: Date,
    required: true,
  },
  availableDoses: {
    type: Number,
    required: true,
    min: 1,
  },
  applicableClasses: [
    {
      type: String,
      required: true,
    },
  ],
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Cancelled"],
    default: "Scheduled",
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Validation to ensure drives are scheduled at least 15 days in advance
vaccinationDriveSchema.pre("save", function (next) {
  const today = new Date()
  const driveDate = new Date(this.driveDate)

  // Calculate the difference in days
  const diffTime = Math.abs(driveDate - today)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // Only apply this validation for new drives (not updates to existing drives)
  if (this.isNew && diffDays < 15) {
    return next(new Error("Vaccination drives must be scheduled at least 15 days in advance"))
  }

  this.updatedAt = Date.now()
  next()
})

const VaccinationDrive = mongoose.model("VaccinationDrive", vaccinationDriveSchema)

module.exports = VaccinationDrive
