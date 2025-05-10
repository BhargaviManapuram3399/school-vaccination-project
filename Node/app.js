const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Student = require("./models/Student");

// Swagger setup
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School Vaccination Portal API',
      version: '1.0.0',
      description: 'API documentation for the student vaccination portal',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
      },
    ],
  },
  apis: ['./routes/api/*.js'], // Adjust path as needed
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// App setup
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = 'mongodb+srv://2024tm93081:Ka49bEPVKDMaSSoN@school-vaccination-db.szdalc7.mongodb.net/school-vaccination-db?retryWrites=true&w=majority&appName=school-vaccination-db';

// MongoDB connection
async function connectToDatabase() {
  try {
    await mongoose.connect(uri, { ssl: true });
    console.log('Connected to MongoDB');
    // require('./models/Sample.js');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

// Routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/students", require("./routes/api/students"));
app.use("/api/vaccination-drives", require("./routes/api/vaccination-drives"));
app.use("/api/dashboard", require("./routes/api/dashboard"));

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start server
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await connectToDatabase();
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Closing MongoDB connection...');
  await mongoose.connection.close();
  console.log('MongoDB connection closed.');
  process.exit(0);
});
