const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();

const Student = require("./models/Student")

const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');
app.use(cors());

// Middleware to parse incoming request body
app.use(express.json());

const mongoose = require('mongoose'); 
// const { MongoClient } = require('mongodb');

// MongoDB URI from .env (for better security, store sensitive data in environment variables)
const uri = 'mongodb+srv://2024tm93081:Ka49bEPVKDMaSSoN@school-vaccination-db.szdalc7.mongodb.net/school-vaccination-db?retryWrites=true&w=majority&appName=school-vaccination-db';

// MongoDB Client initialization
// const client = new MongoClient(uri, {
//   ssl: true,
// });

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(uri, {ssl: true });
    console.log('Connected to MongoDB');
    require('./models/Sample.js');

  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);  // Exit if MongoDB connection fails
  }
}


app.use("/api/auth", require("./routes/api/auth"))
app.use("/api/students", require("./routes/api/students"))
app.use("/api/vaccination-drives", require("./routes/api/vaccination-drives"))
app.use("/api/dashboard", require("./routes/api/dashboard"))

// Start the server and connect to MongoDB
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await connectToDatabase();
});

// Properly close the MongoDB connection on exit
process.on('SIGINT', async () => {
  console.log('Closing MongoDB connection...');
  await mongoose.connection.close();
  console.log('MongoDB connection closed.');
  process.exit(0);
});
