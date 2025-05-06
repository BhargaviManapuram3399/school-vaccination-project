"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { CSVLink } from "react-csv"
import "./Reports.css"

const Reports = () => {
  const [reportData, setReportData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    vaccineName: "",
    fromDate: "",
    toDate: "",
    status: "",
  })

  useEffect(() => {
    if (filters.vaccineName || filters.fromDate || filters.toDate || filters.status) {
      generateReport()
    }
  }, [currentPage, filters])

  const generateReport = async () => {
    try {
      setLoading(true)

      // Build query string from filters
      const queryParams = new URLSearchParams()
      queryParams.append("page", currentPage)

      if (filters.vaccineName) queryParams.append("vaccineName", filters.vaccineName)
      if (filters.fromDate) queryParams.append("fromDate", filters.fromDate)
      if (filters.toDate) queryParams.append("toDate", filters.toDate)
      if (filters.status) queryParams.append("status", filters.status)

      const res = await axios.get(`/api/vaccination-drives/reports/generate?${queryParams.toString()}`)

      setReportData(res.data.data)
      setTotalPages(res.data.pagination.pages)
      setLoading(false)
    } catch (err) {
      console.error("Error generating report:", err)
      setError("Failed to generate report")
      setLoading(false)
      toast.error("Failed to generate report")
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
    setCurrentPage(1) // Reset to first page when filters change
  }

  const clearFilters = () => {
    setFilters({
      vaccineName: "",
      fromDate: "",
      toDate: "",
      status: "",
    })
    setReportData([])
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Prepare CSV data
  const prepareCSVData = () => {
    const headers = [
      { label: "Student Name", key: "name" },
      { label: "Student ID", key: "studentId" },
      { label: "Class", key: "class" },
      { label: "Grade", key: "grade" },
      { label: "Vaccine", key: "vaccineName" },
      { label: "Date Administered", key: "dateAdministered" },
      { label: "Status", key: "status" },
    ]

    const data = reportData.flatMap((student) =>
      student.vaccinations.map((vaccination) => ({
        name: student.name,
        studentId: student.studentId,
        class: student.class,
        grade: student.grade,
        vaccineName: vaccination.vaccineName,
        dateAdministered: formatDate(vaccination.dateAdministered),
        status: vaccination.status,
      })),
    )

    return { headers, data }
  }

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Vaccination Reports</h1>
      </div>

      <div className="filter-section">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="vaccineName">Vaccine Name</label>
            <input
              type="text"
              id="vaccineName"
              name="vaccineName"
              value={filters.vaccineName}
              onChange={handleFilterChange}
              placeholder="Filter by vaccine name"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="fromDate">From Date</label>
            <input type="date" id="fromDate" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} />
          </div>
          <div className="filter-group">
            <label htmlFor="toDate">To Date</label>
            <input type="date" id="toDate" name="toDate" value={filters.toDate} onChange={handleFilterChange} />
          </div>
          <div className="filter-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Missed">Missed</option>
            </select>
          </div>
        </div>
        <div className="filter-actions">
          <button className="btn btn-primary" onClick={generateReport}>
            Generate Report
          </button>
          <button className="btn btn-secondary" onClick={clearFilters}>
            Clear Filters
          </button>
          {reportData.length > 0 && (
            <CSVLink
              data={prepareCSVData().data}
              headers={prepareCSVData().headers}
              filename={`vaccination-report-${new Date().toISOString().split("T")[0]}.csv`}
              className="btn btn-success"
            >
              <i className="fas fa-download"></i> Download CSV
            </CSVLink>
          )}
        </div>
      </div>

      {loading ? (
        <div className="reports-loading">
          <div className="spinner"></div>
          <p>Generating report...</p>
        </div>
      ) : error ? (
        <div className="reports-error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={generateReport} className="btn btn-primary">
            Retry
          </button>
        </div>
      ) : reportData.length === 0 ? (
        <div className="no-report-data">
          <i className="fas fa-file-alt"></i>
          <p>No report data available. Please apply filters and generate a report.</p>
        </div>
      ) : (
        <>
          <div className="report-summary">
            <h2>Report Summary</h2>
            <div className="summary-stats">
              <div className="stat-item">
                <div className="stat-value">{reportData.length}</div>
                <div className="stat-label">Students</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {reportData.reduce((total, student) => total + student.vaccinations.length, 0)}
                </div>
                <div className="stat-label">Vaccinations</div>
              </div>
            </div>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Class</th>
                  <th>Vaccine</th>
                  <th>Date Administered</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reportData.flatMap((student) =>
                  student.vaccinations.map((vaccination, index) => (
                    <tr key={`${student._id}-${index}`}>
                      <td>{student.name}</td>
                      <td>{student.studentId}</td>
                      <td>{student.class}</td>
                      <td>{vaccination.vaccineName}</td>
                      <td>{formatDate(vaccination.dateAdministered)}</td>
                      <td>
                        <span
                          className={`badge badge-${
                            vaccination.status === "Completed"
                              ? "success"
                              : vaccination.status === "Missed"
                                ? "danger"
                                : "warning"
                          }`}
                        >
                          {vaccination.status}
                        </span>
                      </td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
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

export default Reports
