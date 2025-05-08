"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import "./VaccinationDrivesList.css"

const VaccinationDrivesList = () => {
  const [drives, setDrives] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    status: "",
    vaccineName: "",
    upcoming: false,
  })

  useEffect(() => {
    fetchDrives()
  }, [currentPage, filters])

  const fetchDrives = async () => {
    try {
      setLoading(true)

      // Build query string from filters
      const queryParams = new URLSearchParams()
      queryParams.append("page", currentPage)

      if (filters.status) queryParams.append("status", filters.status)
      if (filters.vaccineName) queryParams.append("vaccineName", filters.vaccineName)
      if (filters.upcoming) queryParams.append("upcoming", "true")

      const res = await axios.get(`/api/vaccination-drives?${queryParams.toString()}`)

      setDrives(res.data.data)
      setTotalPages(res.data.pagination.pages)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching vaccination drives:", err)
      setError("Failed to fetch vaccination drives")
      setLoading(false)
      toast.error("Failed to fetch vaccination drives")
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleUpcomingChange = (e) => {
    setFilters((prev) => ({ ...prev, upcoming: e.target.checked }))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      status: "",
      vaccineName: "",
      upcoming: false,
    })
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const deleteDrive = async (id) => {
    if (window.confirm("Are you sure you want to delete this vaccination drive?")) {
      try {
        await axios.delete(`/api/vaccination-drives/${id}`)
        toast.success("Vaccination drive deleted successfully")
        fetchDrives()
      } catch (err) {
        console.error("Error deleting vaccination drive:", err)
        toast.error(err.response?.data?.message || "Failed to delete vaccination drive")
      }
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading && drives.length === 0) {
    return (
      <div className="drives-loading">
        <div className="spinner"></div>
        <p>Loading vaccination drives...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="drives-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchDrives} className="btn btn-primary">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="drives-list-container">
      <div className="drives-header">
        <h1>Vaccination Drives</h1>
        <div className="drives-actions">
          <Link to="/vaccination-drives/add" className="btn btn-primary">
            <i className="fas fa-plus"></i> Schedule Drive
          </Link>
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-row">
          <div className="filter-group">
            <input
              type="text"
              name="vaccineName"
              placeholder="Filter by vaccine name"
              value={filters.vaccineName}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-group">
            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="filter-group checkbox-group">
            <label>
              <input type="checkbox" checked={filters.upcoming} onChange={handleUpcomingChange} />
              Show only upcoming drives (next 30 days)
            </label>
          </div>
          <button className="btn btn-secondary button-width" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      {drives.length === 0 ? (
        <div className="no-drives">
          <i className="fas fa-calendar-times"></i>
          <p>No vaccination drives found</p>
          <Link to="/vaccination-drives/add" className="btn btn-primary">
            Schedule a Drive
          </Link>
        </div>
      ) : (
        <>
          <div className="drives-grid">
            {drives.map((drive) => {
              const driveDate = new Date(drive.driveDate)
              const today = new Date()
              const isPast = driveDate < today

              return (
                <div key={drive._id} className={`drive-card ${isPast ? "past-drive" : ""}`}>
                  <div className="drive-card-header">
                    <div className="drive-date">
                      <span className="month">{driveDate.toLocaleDateString("en-US", { month: "short" })}</span>
                      <span className="day">{driveDate.getDate()}</span>
                      <span className="year">{driveDate.getFullYear()}</span>
                    </div>
                    <div className="drive-status">
                      <span
                        className={`badge badge-${
                          drive.status === "Scheduled"
                            ? "primary"
                            : drive.status === "Completed"
                              ? "success"
                              : "warning"
                        }`}
                      >
                        {drive.status}
                      </span>
                    </div>
                  </div>
                  <div className="drive-card-body">
                    <h3>{drive.vaccineName}</h3>
                    <p>
                      <i className="fas fa-syringe"></i> {drive.availableDoses} doses available
                    </p>
                    <p>
                      <i className="fas fa-users"></i> For: {drive.applicableClasses.join(", ")}
                    </p>
                    {drive.description && (
                      <p className="drive-description">
                        <i className="fas fa-info-circle"></i> {drive.description}
                      </p>
                    )}
                  </div>
                  <div className="drive-card-footer">
                    <Link to={`/vaccination-drives/${drive._id}`} className="btn btn-sm btn-primary">
                      View Details
                    </Link>
                    {!isPast && (
                      <Link to={`/vaccination-drives/edit/${drive._id}`} className="btn btn-sm btn-secondary">
                        Edit
                      </Link>
                    )}
                    {!isPast && (
                      <button className="btn btn-sm btn-danger" onClick={() => deleteDrive(drive._id)}>
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className={`pagination-link ${currentPage === 1 ? "disabled" : ""}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              {[...Array(totalPages).keys()].map((page) => (
                <button
                  key={page + 1}
                  className={`pagination-link ${currentPage === page + 1 ? "active" : ""}`}
                  onClick={() => handlePageChange(page + 1)}
                >
                  {page + 1}
                </button>
              ))}

              <button
                className={`pagination-link ${currentPage === totalPages ? "disabled" : ""}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default VaccinationDrivesList
