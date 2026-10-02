import React, { useEffect, useState } from "react";
import "../styles/interviews.css";
import {
  getInterviews,
  getInterviewStats,
} from "../services/interviewService";

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    completed: 0,
    selected: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInterviewData = async () => {
      try {
        setLoading(true);
        setError("");

        const [interviewData, statsData] = await Promise.all([
          getInterviews(),
          getInterviewStats(),
        ]);

        setInterviews(interviewData.interviews || []);

        setStats({
          total: statsData.stats?.total || 0,
          scheduled: statsData.stats?.scheduled || 0,
          completed: statsData.stats?.completed || 0,
          selected: statsData.stats?.selected || 0,
        });
      } catch (err) {
        console.error("Interview page error:", err);
        setError(err.message || "Failed to load interview data");
      } finally {
        setLoading(false);
      }
    };

    loadInterviewData();
  }, []);

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

        <button className="primary-button">+ Add Interview</button>
      </div>

      {error && <div className="interview-error">{error}</div>}

      <div className="interview-stats-grid">
        <div className="interview-stat-card">
          <span>Total Interviews</span>
          <strong>{loading ? "—" : stats.total}</strong>
        </div>

        <div className="interview-stat-card">
          <span>Scheduled</span>
          <strong>{loading ? "—" : stats.scheduled}</strong>
        </div>

        <div className="interview-stat-card">
          <span>Completed</span>
          <strong>{loading ? "—" : stats.completed}</strong>
        </div>

        <div className="interview-stat-card">
          <span>Selected</span>
          <strong>{loading ? "—" : stats.selected}</strong>
        </div>
      </div>

      {!loading && interviews.length === 0 && (
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
      )}

      {!loading && interviews.length > 0 && (
        <div className="interviews-list">
          {interviews.map((interview) => (
            <div className="interview-card" key={interview._id}>
              <div>
                <h2>{interview.company}</h2>
                <p>{interview.role}</p>
              </div>

              <div>
                <strong>{interview.round}</strong>
                <span>{interview.type}</span>
                <span>{interview.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="interviews-empty-state">
          <h2>Loading interviews...</h2>
        </div>
      )}
    </div>
  );
}

export default Interviews;