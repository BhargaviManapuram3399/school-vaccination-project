"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import "./StudentForm.css"

const StudentForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    class: "",
    grade: "",
    age: "",
    gender: "",
    parentName: "",
    contactNumber: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isEditMode) {
      fetchStudent()
    }
  }, [id])

  const fetchStudent = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`/api/students/${id}`)
      const student = res.data.data

      setFormData({
        name: student.name,
        studentId: student.studentId,
        class: student.class,
        grade: student.grade,
        age: student.age,
        gender: student.gender,
        parentName: student.parentName,
        contactNumber: student.contactNumber,
      })

      setLoading(false)
    } catch (err) {
      console.error("Error fetching student:", err)
      setError("Failed to fetch student details")
      setLoading(false)
      toast.error("Failed to fetch student details")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      if (isEditMode) {
        await axios.put(`/api/students/${id}`, formData)
        toast.success("Student updated successfully")
      } else {
        await axios.post("/api/students", formData)
        toast.success("Student added successfully")
      }

      navigate("/students")
    } catch (err) {
      console.error("Error saving student:", err)
      setError("Failed to save student")
      setLoading(false)
      toast.error("Failed to save student")
    }
  }

  if (loading && isEditMode) {
    return (
      <div className="student-form-loading">
        <div className="spinner"></div>
        <p>Loading student data...</p>
      </div>
    )
  }

  return (
    <div className="student-form-container">
      <div className="student-form-header">
        <h1>{isEditMode ? "Edit Student" : "Add Student"}</h1>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="studentId">Student ID</label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                  disabled={isEditMode}
                  placeholder="e.g., S1001" // Can't change ID in edit mode
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="class">Class</label>
                <select id="class" name="class" value={formData.class} onChange={handleChange} required>
                  <option value="">Select Class</option>
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Grade 6">Grade 6</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="grade">Grade/Section</label>
                <input
                  type="text"
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                  placeholder="e.g., A, B, C"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="3"
                  max="20"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="parentName">Parent/Guardian Name</label>
                <input
                  type="text"
                  id="parentName"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactNumber">Contact Number</label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                  pattern="[0-9]+"
                  title="Please enter a valid phone number (digits only)"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary button-width" onClick={() => navigate("/students")}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary button-width" disabled={loading}>
                {loading ? "Saving..." : isEditMode ? "Update Student" : "Add Student"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default StudentForm
