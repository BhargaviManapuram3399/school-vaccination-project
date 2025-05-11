# School Vaccination Portal

![School Vaccination Portal](https://i.imgur.com/JKgXmLs.png)

A comprehensive web application for managing and tracking vaccination drives in a school. This system allows school coordinators to manage student records, schedule vaccination drives, update vaccination statuses, and generate reports.

## 📋 Features

- **Authentication & Access Control**: Secure login for school coordinators
- **Dashboard Overview**: Display important metrics and insights
- **Student Management**: Add/edit student details individually or via bulk import
- **Vaccination Drive Management**: Create and manage vaccination drives
- **Reports Generation**: Generate and export vaccination reports

## 🛠️ Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## 🚀 Quick Start

### Prerequisites

- Node.js (V16.20.2)
- MongoDB (Atlas)
- npm

### Installation & Setup

#### Backend

1. Navigate to the backend directory:
   \`\`\`
   cd Node
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Start the server:
   \`\`\`
   npm start
   \`\`\`
   
   For development with auto-reload:
   \`\`\`
   npm run dev
   \`\`\`

#### Frontend

1. Navigate to the frontend directory:
   \`\`\`
   cd Frontend
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Start the development server:
   \`\`\`
   npm start
   \`\`\`

4. Open your browser and navigate to:
   \`\`\`
   http://localhost:3000
   \`\`\`

## 📱 Application Preview

### Login Screen

### Dashboard

### Students Management

### Vaccination Drives

### Reports

## 🔑 Default Login Credentials

- Username: admin
- Password: adminpassword

## 📚 API Documentation

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/user` - Get current user

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get a single student
- `POST /api/students` - Create a new student
- `PUT /api/students/:id` - Update a student
- `DELETE /api/students/:id` - Delete a student
- `POST /api/students/import` - Bulk import students from CSV
- `PUT /api/students/:studentId/vaccinate/:driveId` - Mark student as vaccinated

### Vaccination Drives
- `GET /api/vaccination-drives` - Get all vaccination drives
- `GET /api/vaccination-drives/:id` - Get a single vaccination drive
- `POST /api/vaccination-drives` - Create a new vaccination drive
- `PUT /api/vaccination-drives/:id` - Update a vaccination drive
- `DELETE /api/vaccination-drives/:id` - Delete a vaccination drive
- `GET /api/vaccination-drives/dashboard/stats` - Get dashboard statistics
- `GET /api/vaccination-drives/reports/generate` - Generate vaccination report

### Dashboard
- `GET /api/dashboard/overview` - Get dashboard overview data
- `GET /api/dashboard/stats/class` - Get vaccination statistics by class
- `GET /api/dashboard/trends/monthly` - Get monthly vaccination trends

## 📁 Project Structure

\`\`\`
school-vaccination-portal/
├── Node/                   # Backend
│   ├── controllers/        # API controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── app.js              # Express app
│
└── Frontend/               # Frontend
    ├── public/             # Static files
    └── src/                # React source code
        ├── components/     # React components
        ├── context/        # React context
        └── App.js          # Main React component
\`\`\`

## 👏 Acknowledgements

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Chart.js](https://www.chartjs.org/)
- [Font Awesome](https://fontawesome.com/)
\`\`\`

Now, let's create a simple script to help you preview the website locally:
