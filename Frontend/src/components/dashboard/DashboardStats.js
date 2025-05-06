import "./DashboardStats.css"

const DashboardStats = ({ totalStudents, vaccinatedStudents, vaccinationPercentage , availablevaccinations}) => {
  return (
    <div className="stats-container">
      <div className="stat-card">
        <div className="stat-icon">
          <i className="fas fa-users"></i>
        </div>
        <div className="stat-content">
          <h3>Total Students</h3>
          <p className="stat-value">{totalStudents}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <i className="fas fa-syringe"></i>
        </div>
        <div className="stat-content">
          <h3>Vaccinated Students</h3>
          <p className="stat-value">{vaccinatedStudents}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <i className="fas fa-chart-pie"></i>
        </div>
        <div className="stat-content">
          <h3>Vaccination Rate</h3>
          <p className="stat-value">{vaccinationPercentage}%</p>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${vaccinationPercentage}%` }}></div>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <i className="fas fa-syringe"></i>
        </div>
        <div className="stat-content">
          <h3>Available Vaccines</h3>
          <p className="stat-value">{availablevaccinations}</p>
        </div>
      </div>

    </div>
  )
}

export default DashboardStats
