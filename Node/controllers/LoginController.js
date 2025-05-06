const bcrypt = require("bcryptjs");

// Predefined static credentials
const STATIC_USER = {
  username: "admin",
  password: "adminpassword", // You can use bcrypt to hash it for security, but it's not necessary if it's static
  role: "admin",
  name: "Admin User"
}

// Login Controller
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if static credentials match
    if (username !== STATIC_USER.username || password !== STATIC_USER.password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Instead of generating a token, we now just return a success message and user info
    res.json({
      success: true,
      message: `Welcome ${STATIC_USER.username}!`,  // Success message
      user: {
        id: STATIC_USER.username,
        username: STATIC_USER.username,
        name: STATIC_USER.name,
        role: STATIC_USER.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
}

// Dashboard data
exports.dashboard = async (req, res) => {
  try {
    // This is just a placeholder - actual dashboard data is handled by DashboardController
    res.json({
      success: true,
      message: `Welcome ${STATIC_USER.username}!`,
      data: { actionableData: "Dashboard data here" },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
}
