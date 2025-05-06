"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import "./StudentDetail.css"

const StudentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [vaccinationDrives, setVaccinationDrives] = useState([])
  const [selectedDrive, setSelectedDrive] = useState("")

  useEffect(() => {
    fetchStudent()
    fetchVaccinationDrives()
  }, [id])

  const fetchStudent = async () => {
    try {
      const res = await axios.get(`/api/students/${id}`)
      setStudent(res.data.data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching student:", err)
      setError("Failed to fetch student details")
      setLoading(false)
      toast.error("Failed to fetch student details")
    }
  }

  const fetchVaccinationDrives = async () => {
    try {
      const res = await axios.get("/api/vaccination-drives?status=Scheduled")
      setVaccinationDrives(res.data.data)
    } catch (err) {
      console.error("Error fetching vaccination drives:", err)
      toast.error("Failed to fetch vaccination drives")
    }
  }

  const markAsVaccinated = async () => {
    if (!selectedDrive) {
      toast.warning("Please select a vaccination drive")
      return
    }

    try {
      await axios.put(`/api/students/${id}/vaccinate/${selectedDrive}`)
      toast.success("Student marked as vaccinated")
      fetchStudent()
      setSelectedDrive("")
    } catch (err) {
      console.error("Error marking student as vaccinated:", err)
      toast.error(err.response?.data?.message || "Failed to mark student as vaccinated")
    }
  }

  const deleteStudent = async () => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`/api/students/${id}`)
        toast.success("Student deleted successfully")
        navigate("/students")
      } catch (err) {
        console.error("Error deleting student:", err)
        toast.error("Failed to delete student")
      }
    }
  }

  if (loading) {
    return (
      <div className="student-detail-loading">
        <div className="spinner"></div>
        <p>Loading student data...</p>
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="student-detail-error">
        <h2>Error</h2>
        <p>{error || "Student not found"}</p>
        <Link to="/students" className="btn btn-primary">
          Back to Students
        </Link>
      </div>
    )
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="student-detail-container">
      <div className="student-detail-header">
        <h1>Student Details</h1>
        <div className="student-detail-actions">
          <Link to={`/students/edit/${id}`} className="btn btn-primary">
            <i className="fas fa-edit"></i> Edit
          </Link>
          <button className="btn btn-danger" onClick={deleteStudent}>
            <i className="fas fa-trash-alt"></i> Delete
          </button>
        </div>
      </div>

      <div className="student-detail-grid">
        <div className="student-info-card">
          <div className="card-header">
            <h2>Personal Information</h2>
          </div>
          <div className="card-body">
            <div className="info-row">
              <div className="info-label">Name:</div>
              <div className="info-value">{student.name}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Student ID:</div>
              <div className="info-value">{student.studentId}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Class:</div>
              <div className="info-value">{student.class}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Grade/Section:</div>
              <div className="info-value">{student.grade}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Age:</div>
              <div className="info-value">{student.age}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Gender:</div>
              <div className="info-value">{student.gender}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Parent/Guardian:</div>
              <div className="info-value">{student.parentName}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Contact Number:</div>
              <div className="info-value">{student.contactNumber}</div>
            </div>
          </div>
        </div>

        <div className="vaccination-card">
          <div className="card-header">
            <h2>Vaccination History</h2>
          </div>
          <div className="card-body">
            {student.vaccinations && student.vaccinations.length > 0 ? (
              <div className="vaccination-history">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Vaccine</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.vaccinations.map((vaccination, index) => (
                      <tr key={index}>
                        <td>{vaccination.vaccineName}</td>
                        <td>{formatDate(vaccination.dateAdministered)}</td>
                        <td>
                          <span className={`badge badge-${vaccination.status === "Completed" ? "success" : "warning"}`}>
                            {vaccination.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-vaccinations">
                <i className="fas fa-syringe"></i>
                <p>No vaccination records found</p>
              </div>
            )}

            <div className="mark-vaccination">
              <h3>Mark as Vaccinated</h3>
              <div className="vaccination-form">
                <select
                  value={selectedDrive}
                  onChange={(e) => setSelectedDrive(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Vaccination Drive</option>
                  {vaccinationDrives.map((drive) => (
                    <option key={drive._id} value={drive._id}>
                      {drive.vaccineName} - {formatDate(drive.driveDate)}
                    </option>
                  ))}
                </select>
                <button className="btn btn-success button-width" onClick={markAsVaccinated} disabled={!selectedDrive}>
                  Mark as Vaccinated
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="back-link">
        <Link to="/students">
          <i className="fas fa-arrow-left"></i> Back to Students List
        </Link>
      </div>
    </div>
  )
}

export default StudentDetail
