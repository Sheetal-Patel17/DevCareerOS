import React from "react";
import "../styles/interviews.css";

function Interviews() {
  return (
    <div className="interviews-page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Career Management</p>
          <h1>Interviews</h1>
          <p className="page-description">
            Prepare, schedule, and track every interview throughout your job
            search.
          </p>
        </div>

        <button className="primary-button">
          + Add Interview
        </button>
      </div>

      <div className="interview-stats-grid">
        <div className="interview-stat-card">
          <span>Total Interviews</span>
          <strong>0</strong>
        </div>

        <div className="interview-stat-card">
          <span>Scheduled</span>
          <strong>0</strong>
        </div>

        <div className="interview-stat-card">
          <span>Completed</span>
          <strong>0</strong>
        </div>

        <div className="interview-stat-card">
          <span>Selected</span>
          <strong>0</strong>
        </div>
      </div>

      <div className="interviews-empty-state">
        <div className="empty-state-icon">📅</div>

        <h2>No interviews yet</h2>

        <p>
          Add your first interview to start tracking interview rounds,
          schedules, preparation notes, and outcomes.
        </p>

        <button className="secondary-button">
          Add Your First Interview
        </button>
      </div>
    </div>
  );
}

export default Interviews;