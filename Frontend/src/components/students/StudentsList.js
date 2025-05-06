"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import "./StudentsList.css"
import * as XLSX from "xlsx"


const StudentsList = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    name: "",
    studentId: "",
    class: "",
    vaccinationStatus: "",
  })

  useEffect(() => {
    fetchStudents()
  }, [currentPage, filters])

  const fetchStudents = async () => {
    try {
      setLoading(true)

      // Build query string from filters
      const queryParams = new URLSearchParams()
      queryParams.append("page", currentPage)

      if (filters.name) queryParams.append("name", filters.name)
      if (filters.studentId) queryParams.append("studentId", filters.studentId)
      if (filters.class) queryParams.append("class", filters.class)
      if (filters.vaccinationStatus) queryParams.append("vaccinationStatus", filters.vaccinationStatus)

      const res = await axios.get(`/api/students?${queryParams.toString()}`)

      setStudents(res.data.data)
      setTotalPages(res.data.pagination.pages)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching students:", err)
      setError("Failed to fetch students")
      setLoading(false)
      toast.error("Failed to fetch students")
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
    setCurrentPage(1) // Reset to first page when filters change
  }

  const clearFilters = () => {
    setFilters({
      name: "",
      studentId: "",
      class: "",
      vaccinationStatus: "",
    })
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleExcelImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return
  
    try {
      const formData = new FormData()
      formData.append("file", file)
  
      await axios.post("/api/students/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
  
      toast.success("Excel file imported successfully")
      fetchStudents()
    } catch (error) {
      console.error("Import failed:", error)
      toast.error("Failed to import Excel file")
    }
  
    e.target.value = null // reset file input
  }
  
  const exportSampleExcel = () => {
    const sampleData = [
      {
        name: "Ravi",
        studentId: "S1001",
        class: "Grade 10",
        grade: "A",
        age: 15,
        gender: "Male",
        parentName: "Ramesh",
        contactNumber: "1234567890",
        vaccinations: JSON.stringify([
          {
            vaccineName: "COVID-19 Vaccine",
            dateAdministered: "2021-06-15",
            status: "Completed"
          }
        ])
      }
    ]
  
    const worksheet = XLSX.utils.json_to_sheet(sampleData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "SampleStudents")
    XLSX.writeFile(workbook, "sample_students.xlsx")
  }
  

  const deleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`/api/students/${id}`)
        toast.success("Student deleted successfully")
        fetchStudents()
      } catch (err) {
        console.error("Error deleting student:", err)
        toast.error("Failed to delete student")
      }
    }
  }

  if (loading && students.length === 0) {
    return (
      <div className="students-loading">
        <div className="spinner"></div>
        <p>Loading students...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="students-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchStudents} className="btn btn-primary">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="students-list-container">
      <div className="students-header">
        <h1>Students</h1>
        {/* <div className="students-actions">
          <Link to="/students/add" className="btn btn-primary button-width">
            <i className="fas fa-plus"></i> Add Student
          </Link>
          <label htmlFor="file-upload" className="btn btn-secondary button-width">
            <i className="fas fa-file-upload"></i> Import CSV
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0]
              if (file) {
                const formData = new FormData()
                formData.append("file", file)

                axios
                  .post("/api/students/import", formData, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  })
                  .then((res) => {
                    toast.success(res.data.message)
                    fetchStudents()
                  })
                  .catch((err) => {
                    console.error("Error importing students:", err)
                    toast.error("Failed to import students")
                  })

                // Reset the input
                e.target.value = null
              }
            }}
          />
        </div> */}

      <div className="students-actions">
        <Link to="/students/add" className="btn btn-primary button-width">
          <i className="fas fa-plus"></i> Add Student
        </Link>

        <button
          className="btn btn-secondary button-width"
          onClick={exportSampleExcel}
        >
          <i className="fas fa-file-download"></i> Export Sample Excel
        </button>

        <label htmlFor="file-upload" className="btn btn-secondary button-width">
          <i className="fas fa-file-upload"></i> Import Excel
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".xlsx"
          style={{ display: "none" }}
          onChange={handleExcelImport}
        />
      </div>


      </div>

      <div className="filter-section">
        <div className="filter-row">
          <div className="filter-group">
            <input
              type="text"
              name="name"
              placeholder="Filter by name"
              value={filters.name}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-group">
            <input
              type="text"
              name="studentId"
              placeholder="Filter by ID"
              value={filters.studentId}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-group">
            <select name="class" value={filters.class} onChange={handleFilterChange}>
              <option value="">All Classes</option>
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
          <div className="filter-group">
            <select name="vaccinationStatus" value={filters.vaccinationStatus} onChange={handleFilterChange}>
              <option value="">All Vaccination Status</option>
              <option value="vaccinated">Vaccinated</option>
              <option value="not-vaccinated">Not Vaccinated</option>
            </select>
          </div>
          <button className="btn btn-secondary button-width" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="no-students">
          <i className="fas fa-user-graduate"></i>
          <p>No students found</p>
          <Link to="/students/add" className="btn btn-primary button-width">
            Add Student
          </Link>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>ID</th>
                  <th>Class</th>
                  <th>Grade</th>
                  <th>Vaccination Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.studentId}</td>
                    <td>{student.class}</td>
                    <td>{student.grade}</td>
                    <td>
                      {student.vaccinations && student.vaccinations.some((v) => v.status === "Completed") ? (
                        <span className="badge badge-success">Vaccinated</span>
                      ) : (
                        <span className="badge badge-warning">Not Vaccinated</span>
                      )}
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/students/${student._id}`} className="btn-icon" title="View">
                          <i className="fas fa-eye"></i>
                        </Link>
                        <Link to={`/students/edit/${student._id}`} className="btn-icon" title="Edit">
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button
                          className="btn-icon btn-icon-danger"
                          onClick={() => deleteStudent(student._id)}
                          title="Delete"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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

export default StudentsList
