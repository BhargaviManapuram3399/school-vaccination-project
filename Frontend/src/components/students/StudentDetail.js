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
  const [eligibleDrives, setEligibleDrives] = useState([])

  useEffect(() => {
    // Fetch both student and vaccination drives data
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch student data
        const studentRes = await axios.get(`/api/students/${id}`)
        const studentData = studentRes.data.data
        setStudent(studentData)

        // Fetch vaccination drives
        const drivesRes = await axios.get("/api/vaccination-drives?status=Scheduled")
        const drivesData = drivesRes.data.data
        setVaccinationDrives(drivesData)

        // Filter eligible drives after both data sets are loaded
        if (studentData && drivesData.length > 0) {
          // Get the student's class
          const studentClass = studentData.class

          // Get list of vaccines the student has already received
          const receivedVaccines = studentData.vaccinations ? studentData.vaccinations.map((v) => v.vaccineName) : []

          // Filter drives that are applicable to the student's class
          // and exclude vaccines the student has already received
          const eligible = drivesData.filter((drive) => {
            // Check if this drive is applicable to the student's class
            const isClassEligible = drive.applicableClasses.includes(studentClass)

            // Check if student has already received this vaccine
            const alreadyVaccinated = receivedVaccines.includes(drive.vaccineName)

            // Drive is eligible if it's for the student's class and they haven't received it yet
            return isClassEligible && !alreadyVaccinated
          })

          setEligibleDrives(eligible)
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to fetch data")
        setLoading(false)
        toast.error("Failed to fetch data")
      }
    }

    fetchData()
  }, [id])

  const markAsVaccinated = async () => {
    if (!selectedDrive) {
      toast.warning("Please select a vaccination drive")
      return
    }

    try {
      await axios.put(`/api/students/${id}/vaccinate/${selectedDrive}`)
      toast.success("Student marked as vaccinated")

      // Refresh all data after marking as vaccinated
      const studentRes = await axios.get(`/api/students/${id}`)
      setStudent(studentRes.data.data)

      // Re-filter eligible drives
      const updatedStudent = studentRes.data.data
      const receivedVaccines = updatedStudent.vaccinations ? updatedStudent.vaccinations.map((v) => v.vaccineName) : []

      const eligible = vaccinationDrives.filter((drive) => {
        const isClassEligible = drive.applicableClasses.includes(updatedStudent.class)
        const alreadyVaccinated = receivedVaccines.includes(drive.vaccineName)
        return isClassEligible && !alreadyVaccinated
      })

      setEligibleDrives(eligible)
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

  if (loading && !student) {
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
                <p className="para">No vaccination records found</p>
              </div>
            )}

            <div className="mark-vaccination">
              <h3>Mark as Vaccinated</h3>
              {loading ? (
                <div className="loading-drives">
                  <div className="spinner-small"></div>
                  <p>Loading eligible vaccination drives...</p>
                </div>
              ) : eligibleDrives.length > 0 ? (
                <div className="vaccination-form">
                  <select
                    value={selectedDrive}
                    onChange={(e) => setSelectedDrive(e.target.value)}
                    className="form-control"
                  >
                    <option value="">Select Vaccination Drive</option>
                    {eligibleDrives.map((drive) => (
                      <option key={drive._id} value={drive._id}>
                        {drive.vaccineName} - {formatDate(drive.driveDate)}
                      </option>
                    ))}
                  </select>
                  <button className="btn btn-success" onClick={markAsVaccinated} disabled={!selectedDrive}>
                    Mark as Vaccinated
                  </button>
                </div>
              ) : (
                <div className="no-eligible-drives">
                  <p>No eligible vaccination drives available for this student.</p>
                </div>
              )}
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
