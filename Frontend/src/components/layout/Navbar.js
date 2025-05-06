// "use client"

// import { useNavigate, Link } from "react-router-dom"
// import "./Navbar.css"

// const Navbar = ({ setSidebarOpen, toggleSidebar  }) => {
//   const navigate = useNavigate()

//   const onLogout = () => {
//     // Clear any session data (e.g., localStorage)
//     localStorage.removeItem("isLoggedIn") // Remove the login status from localStorage
//     setSidebarOpen(false); 
//     navigate("/login") // Redirect to the login page
//   }

//   const authLinks = (
//     <ul className="navbar-nav">
//       <li className="nav-item">
//         <span className="nav-greeting">Hello, Admin</span> {/* Static greeting */}
//       </li>
//       <li className="nav-item">
//         <a onClick={onLogout} href="/login" className="nav-link">
//           <i className="fas fa-sign-out-alt"></i> <span>Logout</span>
//         </a>
//       </li>
//     </ul>
//   )

//   return (
//     <nav className="navbar">
//       <div className="navbar-container">
//         <div className="navbar-left">
//           <button className="sidebar-toggle" onClick={toggleSidebar}>
//             <i className="fas fa-bars"></i>
//           </button>
//           <Link to="/dashboard" className="navbar-brand">
//             <i className="fas fa-shield-alt"></i>
//             <span>School Vaccination Portal</span>
//           </Link>
//         </div>
//         {/* Render the authLinks if user is logged in */}
//         {localStorage.getItem("isLoggedIn") && authLinks}
//       </div>
//     </nav>
//   )
// }

// export default Navbar



"use client"

import { useNavigate, Link } from "react-router-dom"
import "./Navbar.css"

const Navbar = ({toggleSidebar }) => {
  const navigate = useNavigate()

  const onLogout = () => {
    // Clear any session data (e.g., localStorage)
    localStorage.removeItem("isLoggedIn") // Remove the login status from localStorage
    navigate("/login") // Redirect to the login page
  }

  const handleToggleSidebar = () => {
    console.log("Toggle sidebar button clicked")
    if (toggleSidebar) {
      toggleSidebar()
    }
  }

  const authLinks = (
    <ul className="navbar-nav">
      <li className="nav-item">
        <span className="nav-greeting">Hello, Admin</span> {/* Static greeting */}
      </li>
      <li className="nav-item">
        <a onClick={onLogout} href="/login" className="nav-link">
          <i className="fas fa-sign-out-alt"></i> <span>Logout</span>
        </a>
      </li>
    </ul>
  )

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <button className="sidebar-toggle" onClick={handleToggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
          <Link to="/dashboard" className="navbar-brand">
            <i className="fas fa-shield-alt"></i>
            <span>School Vaccination Portal</span>
          </Link>
        </div>
        {/* Render the authLinks if user is logged in */}
        {localStorage.getItem("isLoggedIn") && authLinks}
      </div>
    </nav>
  )
}

export default Navbar

