import React, { useEffect, useState } from "react";
import "../styles/interviews.css";
import {
  getInterviews,
  getInterviewStats,
  createInterview,
} from "../services/interviewService";

const initialForm = {
  company: "",
  role: "",
  round: "",
  type: "Technical",
  status: "Scheduled",
  interviewDate: "",
  meetingLink: "",
  notes: "",
  preparation: "",
};

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
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    loadInterviewData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      await createInterview(formData);

      setFormData(initialForm);
      setShowForm(false);

      await loadInterviewData();
    } catch (err) {
      console.error("Create interview error:", err);
      setError(err.message || "Failed to create interview");
    } finally {
      setSaving(false);
    }
  };

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

        <button
          className="primary-button"
          onClick={() => setShowForm((previous) => !previous)}
        >
          {showForm ? "Close Form" : "+ Add Interview"}
        </button>
      </div>

      {error && <div className="interview-error">{error}</div>}

      {showForm && (
        <form className="interview-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <div>
              <h2>Add Interview</h2>
              <p>Save a new interview to your career tracker.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Infosys"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <input
                id="role"
                name="role"
                type="text"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Software Developer"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="round">Interview Round</label>
              <input
                id="round"
                name="round"
                type="text"
                value={formData.round}
                onChange={handleChange}
                placeholder="e.g. Technical Round 1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Interview Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="Technical">Technical</option>
                <option value="HR">HR</option>
                <option value="Managerial">Managerial</option>
                <option value="Coding">Coding</option>
                <option value="System Design">System Design</option>
                <option value="Behavioral">Behavioral</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="interviewDate">Interview Date & Time</label>
              <input
                id="interviewDate"
                name="interviewDate"
                type="datetime-local"
                value={formData.interviewDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="meetingLink">Meeting Link</label>
              <input
                id="meetingLink"
                name="meetingLink"
                type="url"
                value={formData.meetingLink}
                onChange={handleChange}
                placeholder="https://meet.google.com/..."
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="preparation">Preparation</label>
              <textarea
                id="preparation"
                name="preparation"
                value={formData.preparation}
                onChange={handleChange}
                placeholder="Topics to prepare..."
                rows="4"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional interview notes..."
                rows="4"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setShowForm(false);
                setFormData(initialForm);
              }}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Interview"}
            </button>
          </div>
        </form>
      )}

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

      {!loading && interviews.length === 0 && !showForm && (
        <div className="interviews-empty-state">
          <div className="empty-state-icon">📅</div>

          <h2>No interviews yet</h2>

          <p>
            Add your first interview to start tracking interview rounds,
            schedules, preparation notes, and outcomes.
          </p>

          <button
            className="secondary-button"
            onClick={() => setShowForm(true)}
          >
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

              <div className="interview-card-meta">
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