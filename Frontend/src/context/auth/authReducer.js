const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload, // Set user info here
        loading: false,
      }
    case "LOGIN_FAIL":
      return {
        ...state,
        isAuthenticated: false,
        error: action.payload,
        loading: false,
      }
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
      }
    case "CLEAR_ERRORS":
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

export default authReducer