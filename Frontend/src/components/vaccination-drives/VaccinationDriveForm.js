"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import "./VaccinationDriveForm.css"

const VaccinationDriveForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    vaccineName: "",
    driveDate: "",
    availableDoses: "",
    applicableClasses: [],
    description: "",
    status: "Scheduled",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Available classes for checkboxes
  const availableClasses = [
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
    "Grade 12",
  ]

  useEffect(() => {
    if (isEditMode) {
      fetchDrive()
    }
  }, [id])

  const fetchDrive = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`/api/vaccination-drives/${id}`)
      const drive = res.data.data

      // Format date for input field (YYYY-MM-DD)
      const driveDate = new Date(drive.driveDate)
      const formattedDate = driveDate.toISOString().split("T")[0]

      setFormData({
        vaccineName: drive.vaccineName,
        driveDate: formattedDate,
        availableDoses: drive.availableDoses,
        applicableClasses: drive.applicableClasses,
        description: drive.description || "",
        status: drive.status,
      })

      setLoading(false)
    } catch (err) {
      console.error("Error fetching vaccination drive:", err)
      setError("Failed to fetch vaccination drive details")
      setLoading(false)
      toast.error("Failed to fetch vaccination drive details")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleClassChange = (e) => {
    const { value, checked } = e.target

    if (checked) {
      setFormData((prev) => ({
        ...prev,
        applicableClasses: [...prev.applicableClasses, value],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        applicableClasses: prev.applicableClasses.filter((c) => c !== value),
      }))
    }
  }

  const validateForm = () => {
    // Check if drive date is at least 15 days in the future
    const today = new Date()
    const driveDate = new Date(formData.driveDate)
    const diffTime = Math.abs(driveDate - today)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 15 && !isEditMode) {
      toast.error("Vaccination drives must be scheduled at least 15 days in advance")
      return false
    }

    // Check if at least one class is selected
    if (formData.applicableClasses.length === 0) {
      toast.error("Please select at least one applicable class")
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)

      if (isEditMode) {
        await axios.put(`/api/vaccination-drives/${id}`, formData)
        toast.success("Vaccination drive updated successfully")
      } else {
        await axios.post("/api/vaccination-drives", formData)
        toast.success("Vaccination drive scheduled successfully")
      }

      navigate("/vaccination-drives")
    } catch (err) {
      console.error("Error saving vaccination drive:", err)
      setError(err.response?.data?.message || "Failed to save vaccination drive")
      setLoading(false)
      toast.error(err.response?.data?.message || "Failed to save vaccination drive")
    }
  }

  if (loading && isEditMode) {
    return (
      <div className="drive-form-loading">
        <div className="spinner"></div>
        <p>Loading vaccination drive data...</p>
      </div>
    )
  }

  return (
    <div className="drive-form-container">
      <div className="drive-form-header">
        <h1>{isEditMode ? "Edit Vaccination Drive" : "Schedule Vaccination Drive"}</h1>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
            <div className="form-group">
              <label htmlFor="vaccineName">Vaccine Name</label>
              <select
                id="vaccineName"
                name="vaccineName"
                value={formData.vaccineName}
                onChange={handleChange}
                required
              >
                <option value="">Select a vaccine</option>
                <option value="COVID-19">COVID-19</option>
                <option value="Chickenpox">Chickenpox</option>
                <option value="Flu">Flu</option>
                <option value="Hepatitis B">Hepatitis B</option>
                <option value="Measles">Measles</option>
                <option value="Polio">Polio</option>
                <option value="Tetanus">Tetanus</option>
                <option value="MMR">MMR (Measles, Mumps, Rubella)</option>
                <option value="HPV">HPV (Human Papillomavirus)</option>
                <option value="DTP">DTP (Diphtheria, Tetanus, Pertussis)</option>
                <option value="BCG">BCG (Tuberculosis)</option>
                <option value="Rotavirus">Rotavirus</option>
                <option value="Hib">Hib (Haemophilus influenzae type B)</option>
              </select>
            </div>


              <div className="form-group">
                <label htmlFor="driveDate">Drive Date</label>
                <input
                  type="date"
                  id="driveDate"
                  name="driveDate"
                  value={formData.driveDate}
                  onChange={handleChange}
                  required
                  min={
                    new Date(new Date().setDate(new Date().getDate() + (isEditMode ? 0 : 15)))
                      .toISOString()
                      .split("T")[0]
                  }
                />
                {!isEditMode && (
                  <small className="form-text text-muted">
                    Vaccination drives must be scheduled at least 15 days in advance.
                  </small>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="availableDoses">Available Doses</label>
                <input
                  type="number"
                  id="availableDoses"
                  name="availableDoses"
                  value={formData.availableDoses}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange} required>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Additional information about the vaccination drive"
              ></textarea>
            </div>

            <div className="form-group">
              <label>Applicable Classes</label>
              <div className="checkbox-grid">
                {availableClasses.map((className) => (
                  <div key={className} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`class-${className}`}
                      value={className}
                      checked={formData.applicableClasses.includes(className)}
                      onChange={handleClassChange}
                    />
                    <label htmlFor={`class-${className}`}>{className}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary button-width" onClick={() => navigate("/vaccination-drives")}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary button-width" disabled={loading}>
                {loading ? "Saving..." : isEditMode ? "Update Drive" : "Schedule Drive"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default VaccinationDriveForm
