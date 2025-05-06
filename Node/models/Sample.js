const Student = require("./Student");

const students = [
    {
      name: "Ravi",
      studentId: "S1001",
      class: "10th Grade",
      grade: "A",
      age: 15,
      gender: "Male",
      parentName: "Ramesh",
      contactNumber: "1234567890",
      vaccinations: [
        {
          vaccineId: "603d5d7d4a3e7b4ab95a8c07", // Example ObjectId for vaccine
          vaccineName: "COVID-19 Vaccine",
          dateAdministered: new Date("2021-06-15"),
          status: "Completed",
        },
      ],
    },
    {
      name: "Sushma",
      studentId: "S1002",
      class: "9th Grade",
      grade: "B",
      age: 14,
      gender: "Female",
      parentName: "Sharmila",
      contactNumber: "9876543210",
      vaccinations: [
        {
          vaccineId: "603d5d7d4a3e7b4ab95a8c07",
          vaccineName: "Flu Vaccine",
          dateAdministered: new Date("2021-10-20"),
          status: "Completed",
        },
      ],
    },
    {
      name: "Rajesh",
      studentId: "S1003",
      class: "10th Grade",
      grade: "A",
      age: 16,
      gender: "Male",
      parentName: "Raju",
      contactNumber: "1112233445",
      vaccinations: [
        {
          vaccineId: "603d5d7d4a3e7b4ab95a8c07",
          vaccineName: "Hepatitis B",
          dateAdministered: new Date("2021-01-15"),
          status: "Completed",
        },
      ],
    },
    {
      name: "Roja",
      studentId: "S1004",
      class: "8th Grade",
      grade: "B",
      age: 13,
      gender: "Female",
      parentName: "Chaitanya",
      contactNumber: "2233445566",
      vaccinations: [
        {
          vaccineId: "603d5d7d4a3e7b4ab95a8c07",
          vaccineName: "Polio Vaccine",
          dateAdministered: new Date("2021-05-10"),
          status: "Completed",
        },
      ],
    },
    {
      name: "Asif",
      studentId: "S1005",
      class: "11th Grade",
      grade: "C",
      age: 17,
      gender: "Male",
      parentName: "Mohammad",
      contactNumber: "3344556677",
      vaccinations: [
        {
          vaccineId: "603d5d7d4a3e7b4ab95a8c07",
          vaccineName: "Tetanus Vaccine",
          dateAdministered: new Date("2021-08-05"),
          status: "Pending",
        },
      ],
    },
    {
      name: "Mery",
      studentId: "S1006",
      class: "7th Grade",
      grade: "A",
      age: 12,
      gender: "Female",
      parentName: "Joseph",
      contactNumber: "4455667788",
      vaccinations: [
        {
          vaccineId: "603d5d7d4a3e7b4ab95a8c07",
          vaccineName: "Chickenpox Vaccine",
          dateAdministered: new Date("2021-03-30"),
          status: "Completed",
        },
      ],
    },
    {
      name: "David Johnson",
      studentId: "S1007",
      class: "9th Grade",
      grade: "B",
      age: 14,
      gender: "Male",
      parentName: "John Johnson",
      contactNumber: "5566778899",
      vaccinations: [
        {
          vaccineId: "603d5d7d4a3e7b4ab95a8c07",
          vaccineName: "COVID-19 Vaccine",
          dateAdministered: new Date("2021-07-18"),
          status: "Completed",
        },
      ],
    },
    {
      name: "Sophia Williams",
      studentId: "S1008",
      class: "8th Grade",
      grade: "A",
      age: 13,
      gender: "Female",
      parentName: "Liam Williams",
      contactNumber: "6677889900",
      vaccinations: [
        {
          vaccineId: "603d5d7d4a3e7b4ab95a8c07",
          vaccineName: "Flu Vaccine",
          dateAdministered: new Date("2021-09-25"),
          status: "Missed",
        },
      ],
    },
    {
      name: "stephen",
      studentId: "S1009",
      class: "10th Grade",
      grade: "A",
      age: 15,
      gender: "Male",
      parentName: "Maria",
      contactNumber: "7788990011",
      vaccinations: [
        {
          vaccineId: "603d5d7d4a3e7b4ab95a8c07",
          vaccineName: "Measles Vaccine",
          dateAdministered: new Date("2021-11-01"),
          status: "Completed",
        },
      ],
    },
    {
      name: "Ali",
      studentId: "S1010",
      class: "11th Grade",
      grade: "B",
      age: 16,
      gender: "Female",
      parentName: "Mohiddin",
      contactNumber: "8899001122",
      vaccinations: [
        {
          vaccineId: "603d5d7d4a3e7b4ab95a8c07",
          vaccineName: "Hepatitis B",
          dateAdministered: new Date("2021-02-28"),
          status: "Completed",
        },
      ],
    },
  ];

  async function insertStudents() {
    try {
      // Insert student data into the same connected database
      await Student.insertMany(students);
      console.log("Dummy students added successfully");
  
      const vaccinatedStudents = await Student.countDocuments({ "vaccinations.status": "Completed" });
      console.log(`Vaccinated students: ${vaccinatedStudents}`);
    } catch (error) {
      console.error("Error adding students:", error);
    }
  }
  
  // Insert students after DB connection is established in app.js
  insertStudents();