"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./VaccinationDriveDetail.css";

const VaccinationDriveDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vaccinatedStudents, setVaccinatedStudents] = useState([]);
  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [activeTab, setActiveTab] = useState("eligible");

  useEffect(() => {
    fetchDrive();
  }, [id]);

  const fetchDrive = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/vaccination-drives/${id}`);
      const driveData = res.data.data;
      setDrive(driveData);
      setLoading(false);
      await fetchStudents(driveData);
    } catch (err) {
      console.error("Error fetching vaccination drive:", err);
      setError("Failed to fetch vaccination drive details");
      setLoading(false);
      toast.error("Failed to fetch vaccination drive details");
    }
  };

  const fetchStudents = async (driveData) => {
    if (!driveData) return;

    try {
      setLoadingStudents(true);
      const studentsRes = await axios.get(`/api/students`);
      const allStudents = studentsRes.data.data;

      const vaccinated = allStudents.filter((student) => {
        return (
          student.vaccinations &&
          student.vaccinations.some(
            (v) => String(v.vaccineId) === String(driveData._id) && v.status === "Completed"
          )
        );
      });

      setVaccinatedStudents(vaccinated);

      const eligible = allStudents.filter((student) => {
        const isClassEligible = driveData.applicableClasses.includes(student.class);
        const hasVaccination =
          student.vaccinations &&
          student.vaccinations.some(
            (v) => String(v.vaccineId) === String(driveData._id) && v.status === "Completed"
          );
        return isClassEligible && !hasVaccination;
      });

      setEligibleStudents(eligible);
      setLoadingStudents(false);
    } catch (err) {
      console.error("Error fetching students:", err);
      setLoadingStudents(false);
      toast.error("Failed to fetch students");
    }
  };

  const handleStudentSelection = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const markSelectedAsVaccinated = async () => {
    if (selectedStudents.length === 0) {
      toast.warning("Please select at least one student");
      return;
    }

    if (selectedStudents.length > drive.availableDoses) {
      toast.error(`Only ${drive.availableDoses} doses available. Please select fewer students.`);
      return;
    }

    try {
      setLoadingStudents(true);

      for (const studentId of selectedStudents) {
        await axios.put(`/api/students/${studentId}/vaccinate/${id}`);
      }

      toast.success(`${selectedStudents.length} students marked as vaccinated`);
      setSelectedStudents([]);

      const updatedDrive = (await axios.get(`/api/vaccination-drives/${id}`)).data.data;
      setDrive(updatedDrive);
      await fetchStudents(updatedDrive);
    } catch (err) {
      console.error("Error marking students as vaccinated:", err);
      setLoadingStudents(false);
      toast.error(err.response?.data?.message || "Failed to mark students as vaccinated");
    }
  };

  const deleteDrive = async () => {
    if (window.confirm("Are you sure you want to delete this vaccination drive?")) {
      try {
        await axios.delete(`/api/vaccination-drives/${id}`);
        toast.success("Vaccination drive deleted successfully");
        navigate("/vaccination-drives");
      } catch (err) {
        console.error("Error deleting vaccination drive:", err);
        toast.error(err.response?.data?.message || "Failed to delete vaccination drive");
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="drive-detail-loading">
        <div className="spinner"></div>
        <p>Loading vaccination drive data...</p>
      </div>
    );
  }

  if (error || !drive) {
    return (
      <div className="drive-detail-error">
        <h2>Error</h2>
        <p>{error || "Vaccination drive not found"}</p>
        <Link to="/vaccination-drives" className="btn btn-primary">
          Back to Vaccination Drives
        </Link>
      </div>
    );
  }

  const driveDate = new Date(drive.driveDate);
  const today = new Date();
  const isPast = driveDate < today;
  const isToday = driveDate.toDateString() === today.toDateString();

  return (
    <div className="drive-detail-container">
      <div className="drive-detail-header">
        <h1>Vaccination Drive Details</h1>
        <div className="drive-detail-actions">
          {!isPast && (
            <>
              <Link to={`/vaccination-drives/edit/${id}`} className="btn btn-primary">
                <i className="fas fa-edit"></i> Edit
              </Link>
              <button className="btn btn-danger" onClick={deleteDrive}>
                <i className="fas fa-trash-alt"></i> Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="drive-detail-grid">
        <div className="drive-info-card">
          <div className="card-header">
            <h2>Drive Information</h2>
            <span
              className={`badge badge-${drive.status === "Scheduled" ? "primary" : drive.status === "Completed" ? "success" : "warning"}`}
            >
              {drive.status}
            </span>
          </div>
          <div className="card-body">
            <div className="info-row"><div className="info-label">Vaccine:</div><div className="info-value">{drive.vaccineName}</div></div>
            <div className="info-row"><div className="info-label">Date:</div><div className="info-value">{formatDate(drive.driveDate)}</div></div>
            <div className="info-row"><div className="info-label">Available Doses:</div><div className="info-value">{drive.availableDoses}</div></div>
            <div className="info-row"><div className="info-label">Applicable Classes:</div><div className="info-value">{drive.applicableClasses.join(", ")}</div></div>
            {drive.description && (
              <div className="info-row"><div className="info-label">Description:</div><div className="info-value">{drive.description}</div></div>
            )}
          </div>
        </div>

        <div className="drive-status-card">
          <div className="card-header"><h2>Drive Status</h2></div>
          <div className="card-body">
            <div className="status-grid">
              <div className="status-item"><div className="status-value">{drive.availableDoses}</div><div className="status-label">Available Doses</div></div>
              <div className="status-item"><div className="status-value">{vaccinatedStudents.length}</div><div className="status-label">Vaccinated Students</div></div>
              <div className="status-item"><div className="status-value">{eligibleStudents.length}</div><div className="status-label">Eligible Students</div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="students-section">
        <div className="card">
          <div className="card-header"><h2>Manage Vaccinations</h2></div>
          <div className="card-body">
            {loadingStudents ? (
              <div className="students-loading"><div className="spinner"></div><p>Loading students...</p></div>
            ) : (
              <>
                <div className="vaccination-actions">
                  <h3>Mark Students as Vaccinated</h3>
                  {drive.availableDoses > 0 && !isPast ? (
                    <>
                      <p>
                        Select students to mark as vaccinated. {drive.availableDoses} doses available.{" "}
                        {selectedStudents.length} students selected.
                      </p>
                      <button
                        className="btn btn-success button-width"
                        onClick={markSelectedAsVaccinated}
                        disabled={selectedStudents.length === 0}
                      >
                        Mark Selected as Vaccinated
                      </button>
                    </>
                  ) : (
                    <p>
                      {isPast
                        ? "Cannot mark students as vaccinated for past drives."
                        : "No doses available for this vaccination drive."}
                    </p>
                  )}
                </div>

                <div className="students-tabs">
                  <div className="tabs-header">
                    <button
                      className={`tab-btn ${activeTab === "eligible" ? "active" : ""}`}
                      onClick={() => setActiveTab("eligible")}
                    >
                      Eligible Students ({eligibleStudents.length})
                    </button>
                    <button
                      className={`tab-btn ${activeTab === "vaccinated" ? "active" : ""}`}
                      onClick={() => setActiveTab("vaccinated")}
                    >
                      Vaccinated Students ({vaccinatedStudents.length})
                    </button>
                  </div>

                  <div className="tab-content">
                    {activeTab === "eligible" ? (
                      eligibleStudents.length === 0 ? (
                        <div className="no-students"><p>No eligible students found for this vaccination drive.</p></div>
                      ) : (
                        <div className="table-container">
                          <table className="table">
                            <thead>
                              <tr>
                                {!isPast && drive.availableDoses > 0 && <th>Select</th>}
                                <th>Name</th>
                                <th>ID</th>
                                <th>Class</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {eligibleStudents.map((student) => (
                                <tr key={student._id}>
                                  {!isPast && drive.availableDoses > 0 && (
                                    <td>
                                      <input
                                        type="checkbox"
                                        checked={selectedStudents.includes(student._id)}
                                        onChange={() => handleStudentSelection(student._id)}
                                      />
                                    </td>
                                  )}
                                  <td>{student.name}</td>
                                  <td>{student.studentId}</td>
                                  <td>{student.class}</td>
                                  <td>
                                    <Link to={`/students/${student._id}`} className="btn-icon" title="View Student">
                                      <i className="fas fa-eye"></i>
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )
                    ) : vaccinatedStudents.length === 0 ? (
                      <div className="no-students"><p>No vaccinated students recorded for this drive.</p></div>
                    ) : (
                      <div className="table-container">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>ID</th>
                              <th>Class</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {vaccinatedStudents.map((student) => (
                              <tr key={student._id}>
                                <td>{student.name}</td>
                                <td>{student.studentId}</td>
                                <td>{student.class}</td>
                                <td>
                                  <Link to={`/students/${student._id}`} className="btn-icon" title="View Student">
                                    <i className="fas fa-eye"></i>
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="back-link">
        <Link to="/vaccination-drives">
          <i className="fas fa-arrow-left"></i> Back to Vaccination Drives
        </Link>
      </div>
    </div>
  );
};

export default VaccinationDriveDetail;
