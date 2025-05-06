"use client"

import { useReducer } from "react"
import AuthContext from "./authContext"
import authReducer from "./authReducer"

const AuthState = (props) => {
  const initialState = {
    isAuthenticated: localStorage.getItem("isLoggedIn") === "true", // Check if user is logged in
    user: null,
    loading: true,
    error: null,
  }

  const [state, dispatch] = useReducer(authReducer, initialState)

  // Login User
  const login = (username, password) => {
    if (username === "admin" && password === "adminpassword") {
      localStorage.setItem("isLoggedIn", "true") // Set the login flag
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { username, role: "admin" }, // Example user info
      })
    } else {
      dispatch({
        type: "LOGIN_FAIL",
        payload: "Invalid credentials",
      })
    }
  }

  // Logout
  const logout = () => {
    localStorage.removeItem("isLoggedIn") // Remove the login flag
    dispatch({ type: "LOGOUT" })
  }

  // Clear Errors
  const clearErrors = () => dispatch({ type: "CLEAR_ERRORS" })

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        loading: state.loading,
        error: state.error,
        login,
        logout,
        clearErrors,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthState