"use client"

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Auth Components
import Login from "./components/auth/Login"
import PrivateRoute from "./components/routing/PrivateRoute"

// Layout Components
import Navbar from "./components/layout/Navbar"
import Sidebar from "./components/layout/Sidebar"
import Footer from "./components/layout/Footer"

// Page Components
import Dashboard from "./components/dashboard/Dashboard"
import StudentsList from "./components/students/StudentsList"
import StudentForm from "./components/students/StudentForm"
import StudentDetail from "./components/students/StudentDetail"
import VaccinationDrivesList from "./components/vaccination-drives/VaccinationDrivesList"
import VaccinationDriveForm from "./components/vaccination-drives/VaccinationDriveForm"
import VaccinationDriveDetail from "./components/vaccination-drives/VaccinationDriveDetail"
import Reports from "./components/reports/Reports"
// import Analytics from "./components/analytics/Analytics"
import NotFound from "./components/layout/NotFound"

// Context
import AuthState from "./context/auth/AuthState"
import AlertState from "./context/alert/AlertState"

// CSS
import "./App.css"

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <AuthState>
      <AlertState>
        <Router>
          <div className="app-container">
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
              {/* <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Navigate to="/dashboard" replace />
                  </PrivateRoute>
                }
              /> */}
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <div className="app-wrapper">
                      <Navbar toggleSidebar={toggleSidebar} />
                      <div className="content-container">
                        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                        <main className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
                          <Dashboard />
                        </main>
                      </div>
                      <Footer />
                    </div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/students"
                element={
                  <PrivateRoute>
                    <div className="app-wrapper">
                      <Navbar toggleSidebar={toggleSidebar} />
                      <div className="content-container">
                        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                        <main className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
                          <StudentsList />
                        </main>
                      </div>
                      <Footer />
                    </div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/students/add"
                element={
                  <PrivateRoute>
                    <div className="app-wrapper">
                      <Navbar toggleSidebar={toggleSidebar} />
                      <div className="content-container">
                        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                        <main className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
                          <StudentForm />
                        </main>
                      </div>
                      <Footer />
                    </div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/students/edit/:id"
                element={
                  <PrivateRoute>
                    <div className="app-wrapper">
                      <Navbar toggleSidebar={toggleSidebar} />
                      <div className="content-container">
                        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                        <main className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
                          <StudentForm />
                        </main>
                      </div>
                      <Footer />
                    </div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/students/:id"
                element={
                  <PrivateRoute>
                    <div className="app-wrapper">
                      <Navbar toggleSidebar={toggleSidebar} />
                      <div className="content-container">
                        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                        <main className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
                          <StudentDetail />
                        </main>
                      </div>
                      <Footer />
                    </div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/vaccination-drives"
                element={
                  <PrivateRoute>
                    <div className="app-wrapper">
                      <Navbar toggleSidebar={toggleSidebar} />
                      <div className="content-container">
                        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                        <main className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
                          <VaccinationDrivesList />
                        </main>
                      </div>
                      <Footer />
                    </div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/vaccination-drives/add"
                element={
                  <PrivateRoute>
                    <div className="app-wrapper">
                      <Navbar toggleSidebar={toggleSidebar} />
                      <div className="content-container">
                        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                        <main className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
                          <VaccinationDriveForm />
                        </main>
                      </div>
                      <Footer />
                    </div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/vaccination-drives/edit/:id"
                element={
                  <PrivateRoute>
                    <div className="app-wrapper">
                      <Navbar toggleSidebar={toggleSidebar} />
                      <div className="content-container">
                        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                        <main className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
                          <VaccinationDriveForm />
                        </main>
                      </div>
                      <Footer />
                    </div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/vaccination-drives/:id"
                element={
                  <PrivateRoute>
                    <div className="app-wrapper">
                      <Navbar toggleSidebar={toggleSidebar} />
                      <div className="content-container">
                        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                        <main className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
                          <VaccinationDriveDetail />
                        </main>
                      </div>
                      <Footer />
                    </div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <PrivateRoute>
                    <div className="app-wrapper">
                      <Navbar toggleSidebar={toggleSidebar} />
                      <div className="content-container">
                        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                        <main className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
                          <Reports />
                        </main>
                      </div>
                      <Footer />
                    </div>
                  </PrivateRoute>
                }
              />
              {/* <Route
                path="/analytics"
                element={
                  <PrivateRoute>
                    <div className="app-wrapper">
                      <Navbar toggleSidebar={toggleSidebar} />
                      <div className="content-container">
                        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                        <main className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
                          <Analytics />
                        </main>
                      </div>
                      <Footer />
                    </div>
                  </PrivateRoute>
                }
              /> */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </AlertState>
    </AuthState>
  )
}

export default App
