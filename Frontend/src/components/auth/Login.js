"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import AlertContext from "../../context/alert/alertContext"
import "./Login.css"

const Login = () => {
  const alertContext = useContext(AlertContext)
  const { setAlert } = alertContext
  const navigate = useNavigate()

  const [user, setUser] = useState({
    username: "",
    password: "",
  })

  const { username, password } = user

  // Static credentials
  const STATIC_USER = {
    username: "admin",
    password: "adminpassword", 
    role: "admin",
    name: "Admin User"
  }

  useEffect(() => {
    // Check if the user is already logged in and redirect to the dashboard
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (isLoggedIn) {
      navigate("/dashboard")  // Navigate to dashboard if already logged in
    }
    // eslint-disable-next-line
  }, [navigate])

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value })

  const onSubmit = (e) => {
    e.preventDefault()
    if (username === "" || password === "") {
      setAlert("Please fill in all fields", "danger")
    } else {
      // Check against static credentials
      if (username === STATIC_USER.username && password === STATIC_USER.password) {
        // Redirect to the dashboard directly, no need to store a token
        localStorage.setItem("isLoggedIn", "true");
        navigate("/dashboard")
      } else {
        setAlert("Invalid credentials", "danger")
      }
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <i className="fas fa-shield-alt"></i>
          </div>
          <h1>School Vaccination Portal</h1>
          <p>Sign in as a school coordinator to manage vaccination records</p>
        </div>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="username">Email/UserID</label>
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={onChange}
              placeholder="coordinator@school.edu"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" value={password} onChange={onChange} required />
          </div>
          <button type="submit" className="btn btn-success">
            Sign In
          </button>
          <p className="default_para">*Default UserId: admin , Password: adminpassword</p>
        </form>
        <div className="login-footer">
          <p>© 2025 School Vaccination Portal</p>
        </div>
      </div>
    </div>
  )
}

export default Login
