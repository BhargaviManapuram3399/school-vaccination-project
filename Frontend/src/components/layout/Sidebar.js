"use client"

import { Link, useLocation } from "react-router-dom"
import "./Sidebar.css"

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation()
  console.log(`Sidebar is now: ${isOpen ? "open" : "closed"}`)

  const isActive = (path) => {
    return location.pathname === path ? "active" : ""
  }

  const handleLinkClick = () => {
    // On mobile, we want to close the sidebar when a link is clicked
    if (window.innerWidth < 992 && toggleSidebar) {
      toggleSidebar()
    }
  }

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h3>Navigation</h3>
      </div>
      <ul className="sidebar-menu">
        <li className={isActive("/dashboard")}>
          <Link to="/dashboard" onClick={handleLinkClick}>
            <i className="fas fa-th-large"></i> Dashboard
          </Link>
        </li>
        <li className={isActive("/students")}>
          <Link to="/students" onClick={handleLinkClick}>
            <i className="fas fa-user-graduate"></i> Students
          </Link>
        </li>
        <li className={isActive("/vaccination-drives")}>
          <Link to="/vaccination-drives" onClick={handleLinkClick}>
            <i className="fas fa-syringe"></i> Vaccination Drives
          </Link>
        </li>
        <li className={isActive("/reports")}>
          <Link to="/reports" onClick={handleLinkClick}>
            <i className="fas fa-file-alt"></i> Reports
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
