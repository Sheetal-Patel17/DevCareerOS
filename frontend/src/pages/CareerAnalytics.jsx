import React, { useEffect, useState } from "react";
import { getCareerAnalytics } from "../services/analyticsService";
import "../styles/careerAnalytics.css";

function CareerAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCareerAnalytics();

      setAnalytics(data);
    } catch (err) {
      console.error("Career analytics page error:", err);
      setError(err.message || "Failed to load career analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <main className="career-analytics-page">
        <div className="career-analytics-header">
          <p className="career-analytics-eyebrow">Career Dashboard</p>
          <h1>Career Analytics</h1>
          <p className="career-analytics-description">
            Track your overall career preparation and progress.
          </p>
        </div>

        <div className="analytics-state-card">
          <p>Loading your career analytics...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="career-analytics-page">
        <div className="career-analytics-header">
          <p className="career-analytics-eyebrow">Career Dashboard</p>
          <h1>Career Analytics</h1>
          <p className="career-analytics-description">
            Track your overall career preparation and progress.
          </p>
        </div>

        <div className="analytics-state-card analytics-error">
          <p>{error}</p>

          <button
            type="button"
            className="primary-button"
            onClick={loadAnalytics}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!analytics) {
    return (
      <main className="career-analytics-page">
        <div className="career-analytics-header">
          <p className="career-analytics-eyebrow">Career Dashboard</p>
          <h1>Career Analytics</h1>
          <p className="career-analytics-description">
            Track your overall career preparation and progress.
          </p>
        </div>

        <div className="analytics-state-card">
          <p>No analytics data is available yet.</p>

          <button
            type="button"
            className="primary-button"
            onClick={loadAnalytics}
          >
            Refresh
          </button>
        </div>
      </main>
    );
  }

  const summary = analytics.summary || {};
  const dsa = analytics.dsa || {};
  const goals = analytics.goals || {};
  const interviews = analytics.interviews || {};
  const resumes = analytics.resumes || {};

  return (
    <main className="career-analytics-page">
      <div className="career-analytics-header">
        <div>
          <p className="career-analytics-eyebrow">Career Dashboard</p>

          <h1>Career Analytics</h1>

          <p className="career-analytics-description">
            Track your DSA practice, goals, interviews, and resumes in one
            place.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={loadAnalytics}
        >
          Refresh Data
        </button>
      </div>

      <section className="analytics-overview">
        <div className="analytics-section-header">
          <div>
            <h2>Career Overview</h2>

            <p>
              Your current preparation activity across DevCareerOS.
            </p>
          </div>
        </div>

        <div className="analytics-placeholder-grid">
          <div className="analytics-placeholder-card">
            <span>Total Career Records</span>
            <strong>{summary.totalCareerRecords || 0}</strong>
          </div>

          <div className="analytics-placeholder-card">
            <span>DSA Problems</span>
            <strong>{summary.totalDsaProblems || 0}</strong>
          </div>

          <div className="analytics-placeholder-card">
            <span>Goals</span>
            <strong>{summary.totalGoals || 0}</strong>
          </div>

          <div className="analytics-placeholder-card">
            <span>Interviews</span>
            <strong>{summary.totalInterviews || 0}</strong>
          </div>

          <div className="analytics-placeholder-card">
            <span>Resumes</span>
            <strong>{summary.totalResumes || 0}</strong>
          </div>
        </div>
      </section>

      <section className="analytics-overview">
        <div className="analytics-section-header">
          <div>
            <h2>DSA Progress</h2>

            <p>
              Problem-solving activity and completion progress.
            </p>
          </div>
        </div>

        <div className="analytics-basic-grid">
          <div>
            <span>Total</span>
            <strong>{dsa.total || 0}</strong>
          </div>

          <div>
            <span>Solved</span>
            <strong>{dsa.solved || 0}</strong>
          </div>

          <div>
            <span>In Progress</span>
            <strong>{dsa.inProgress || 0}</strong>
          </div>

          <div>
            <span>Completion</span>
            <strong>{dsa.completionPercentage || 0}%</strong>
          </div>
        </div>
      </section>

      <section className="analytics-overview">
        <div className="analytics-section-header">
          <div>
            <h2>Goals</h2>

            <p>
              Career goals and progress toward completion.
            </p>
          </div>
        </div>

        <div className="analytics-basic-grid">
          <div>
            <span>Total Goals</span>
            <strong>{goals.total || 0}</strong>
          </div>

          <div>
            <span>Completed</span>
            <strong>{goals.completed || 0}</strong>
          </div>

          <div>
            <span>In Progress</span>
            <strong>{goals.inProgress || 0}</strong>
          </div>

          <div>
            <span>Average Progress</span>
            <strong>{goals.averageProgress || 0}%</strong>
          </div>
        </div>
      </section>

      <section className="analytics-overview">
        <div className="analytics-section-header">
          <div>
            <h2>Interview Performance</h2>

            <p>
              Track interview activity and outcomes.
            </p>
          </div>
        </div>

        <div className="analytics-basic-grid">
          <div>
            <span>Total Interviews</span>
            <strong>{interviews.total || 0}</strong>
          </div>

          <div>
            <span>Completed</span>
            <strong>{interviews.completed || 0}</strong>
          </div>

          <div>
            <span>Selected</span>
            <strong>{interviews.selected || 0}</strong>
          </div>

          <div>
            <span>Success Rate</span>
            <strong>{interviews.successRate || 0}%</strong>
          </div>
        </div>
      </section>

      <section className="analytics-overview">
        <div className="analytics-section-header">
          <div>
            <h2>Resume Status</h2>

            <p>
              Monitor your resume preparation and readiness.
            </p>
          </div>
        </div>

        <div className="analytics-basic-grid">
          <div>
            <span>Total Resumes</span>
            <strong>{resumes.total || 0}</strong>
          </div>

          <div>
            <span>Draft</span>
            <strong>{resumes.draft || 0}</strong>
          </div>

          <div>
            <span>Ready</span>
            <strong>{resumes.ready || 0}</strong>
          </div>

          <div>
            <span>Ready Percentage</span>
            <strong>{resumes.readyPercentage || 0}%</strong>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CareerAnalytics;