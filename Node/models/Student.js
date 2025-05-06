const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  class: {
    type: String,
    required: true,
    trim: true,
  },
  grade: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  parentName: {
    type: String,
    required: true,
    trim: true,
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
  },
  vaccinations: [
    {
      vaccineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VaccinationDrive",
      },
      vaccineName: String,
      dateAdministered: Date,
      status: {
        type: String,
        enum: ["Pending", "Completed", "Missed"],
        default: "Pending",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Index for faster searching
studentSchema.index({ name: "text", studentId: "text", class: "text" })

// Pre-save middleware to update the updatedAt field
studentSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

const Student = mongoose.model("Student", studentSchema)

module.exports = Student
