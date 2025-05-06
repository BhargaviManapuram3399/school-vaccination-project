"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import DashboardStats from "./DashboardStats"
import UpcomingDrives from "./UpcomingDrives"
import VaccinationChart from "./VaccinationChart"
import "./Dashboard.css"

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get("/api/dashboard/overview")
        setDashboardData(res.data.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data")
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to the School Vaccination Portal</p>
      </div>

      <div className="dashboard-stats-container">
        <DashboardStats
          totalStudents={dashboardData.totalStudents}
          vaccinatedStudents={dashboardData.vaccinatedStudents}
          vaccinationPercentage={dashboardData.vaccinationPercentage}
          availablevaccinations={dashboardData.availablevaccinations}
        />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Upcoming Vaccination Drives</h2>
            <Link to="/vaccination-drives" className="btn btn-sm">
              View All
            </Link>
          </div>
          <div className="card-body">
            <UpcomingDrives drives={dashboardData.upcomingDrives} />
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2>Vaccination Statistics</h2>
          </div>
          <div className="card-body">
            <VaccinationChart data={dashboardData.vaccinationsByType} />
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/students" className="action-card">
          <div className="action-icon">
            <i className="fas fa-user-graduate"></i>
          </div>
          <div className="action-content">
            <h3>Manage Students</h3>
            <p>Add, edit, or view student records</p>
          </div>
        </Link>

        <Link to="/vaccination-drives/add" className="action-card">
          <div className="action-icon">
            <i className="fas fa-calendar-plus"></i>
          </div>
          <div className="action-content">
            <h3>Schedule Drive</h3>
            <p>Create a new vaccination drive</p>
          </div>
        </Link>

        <Link to="/reports" className="action-card">
          <div className="action-icon">
            <i className="fas fa-chart-bar"></i>
          </div>
          <div className="action-content">
            <h3>Generate Reports</h3>
            <p>Create vaccination reports</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
