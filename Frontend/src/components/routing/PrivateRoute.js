"use client"

import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import Spinner from "../layout/Spinner"

const PrivateRoute = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null) // Add state to track login status

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loginStatus) // Update state based on localStorage
  }, [])

  // If the state hasn't been set yet, show a loading spinner
  if (isLoggedIn === null) {
    return <Spinner /> // You can use your existing Spinner component or any loading state here
  }

  // If not logged in, redirect to login page
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  // If logged in, render the protected content
  return children
}

export default PrivateRoute
