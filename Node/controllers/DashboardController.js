const Student = require("../models/Student")
const VaccinationDrive = require("../models/VaccinationDrive")

// Get dashboard overview data
exports.getDashboardOverview = async (req, res) => {
  try {
    // Get total number of students
    const totalStudents = await Student.countDocuments()

    // Get number of vaccinated students (at least one completed vaccination)
    const vaccinatedStudents = await Student.countDocuments({
      "vaccinations.status": "Completed",
    })

    // Calculate vaccination percentage
    const vaccinationPercentage = totalStudents > 0 ? Math.round((vaccinatedStudents / totalStudents) * 100) : 0

    // Get upcoming vaccination drives (next 30 days)
    const today = new Date()
    const thirtyDaysLater = new Date()
    thirtyDaysLater.setDate(today.getDate() + 30)

    const result = await VaccinationDrive.aggregate([
      {
        $match: {
          driveDate: {
            $gte: today,
            $lte: thirtyDaysLater,
          },
          status: "Scheduled",
          availableDoses: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          totalAvailableDoses: { $sum: "$availableDoses" },
        },
      },
    ]);
    
    const availablevaccinations = result[0]?.totalAvailableDoses || 0;
    console.log("Available Vaccines:", availablevaccinations)

    const upcomingDrives = await VaccinationDrive.find({
      driveDate: {
        $gte: today,
        $lte: thirtyDaysLater,
      },
      status: "Scheduled",
    })
      .sort({ driveDate: 1 })
      .limit(5)



    // Get recent vaccinations
    const recentVaccinations = await Student.find({
      "vaccinations.status": "Completed",
    })
      .sort({ "vaccinations.dateAdministered": -1 })
      .limit(5)

    // Get vaccination counts by vaccine type
    const vaccinationsByType = await Student.aggregate([
      { $unwind: "$vaccinations" },
      { $match: { "vaccinations.status": "Completed" } },
      { $group: { _id: "$vaccinations.vaccineName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    res.json({
      success: true,
      data: {
        totalStudents,
        vaccinatedStudents,
        vaccinationPercentage,
        availablevaccinations,
        upcomingDrives,
        recentVaccinations,
        vaccinationsByType,
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard overview:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard overview",
      error: error.message,
    })
  }
}

// Get vaccination statistics by class
exports.getVaccinationStatsByClass = async (req, res) => {
  try {
    const statsByClass = await Student.aggregate([
      {
        $group: {
          _id: "$class",
          totalStudents: { $sum: 1 },
          vaccinatedStudents: {
            $sum: {
              $cond: [
                {
                  $gt: [
                    {
                      $size: {
                        $filter: {
                          input: "$vaccinations",
                          as: "v",
                          cond: { $eq: ["$$v.status", "Completed"] },
                        },
                      },
                    },
                    0,
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          class: "$_id",
          totalStudents: 1,
          vaccinatedStudents: 1,
          vaccinationPercentage: {
            $multiply: [{ $divide: ["$vaccinatedStudents", "$totalStudents"] }, 100],
          },
        },
      },
      { $sort: { class: 1 } },
    ])

    res.json({
      success: true,
      data: statsByClass,
    })
  } catch (error) {
    console.error("Error fetching vaccination stats by class:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch vaccination stats by class",
      error: error.message,
    })
  }
}

// Get monthly vaccination trends
exports.getMonthlyVaccinationTrends = async (req, res) => {
  try {
    // Get vaccination trends for the last 6 months
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyTrends = await Student.aggregate([
      { $unwind: "$vaccinations" },
      {
        $match: {
          "vaccinations.status": "Completed",
          "vaccinations.dateAdministered": { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$vaccinations.dateAdministered" },
            year: { $year: "$vaccinations.dateAdministered" },
            vaccine: "$vaccinations.vaccineName",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ])

    // Format the data for frontend charts
    const formattedTrends = monthlyTrends.map((item) => ({
      month: `${item._id.month}/${item._id.year}`,
      vaccine: item._id.vaccine,
      count: item.count,
    }))

    res.json({
      success: true,
      data: formattedTrends,
    })
  } catch (error) {
    console.error("Error fetching monthly vaccination trends:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch monthly vaccination trends",
      error: error.message,
    })
  }
}
