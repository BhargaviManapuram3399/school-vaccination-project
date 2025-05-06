import { Link } from "react-router-dom"
import "./UpcomingDrives.css"

const UpcomingDrives = ({ drives }) => {
  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (!drives || drives.length === 0) {
    return (
      <div className="no-drives">
        <i className="fas fa-calendar-times"></i>
        <p>No upcoming vaccination drives scheduled</p>
        <Link to="/vaccination-drives/add" className="btn btn-primary">
          Schedule a Drive
        </Link>
      </div>
    )
  }

  return (
    <div className="upcoming-drives">
      {drives.map((drive) => (
        <div key={drive._id} className="drive-item">
          <div className="drive-date">
            <span className="month">{new Date(drive.driveDate).toLocaleDateString("en-US", { month: "short" })}</span>
            <span className="day">{new Date(drive.driveDate).getDate()}</span>
          </div>
          <div className="drive-details">
            <h4>{drive.vaccineName}</h4>
            <p>
              <i className="fas fa-syringe"></i> {drive.availableDoses} doses available
            </p>
            <p>
              <i className="fas fa-users"></i> For: {drive.applicableClasses.join(", ")}
            </p>
          </div>
          <div className="drive-actions">
            <Link to={`/vaccination-drives/${drive._id}`} className="btn btn-sm">
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

export default UpcomingDrives
