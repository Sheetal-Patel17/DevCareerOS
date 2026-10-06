import React, { useEffect, useState } from "react";
import { getCareerAnalytics } from "../services/analyticsService";
import "../styles/careerAnalytics.css";

function StatBar({ label, value, total, suffix = "" }) {
  const numericValue = Number(value || 0);
  const numericTotal = Number(total || 0);

  const percentage =
    numericTotal > 0
      ? Math.min((numericValue / numericTotal) * 100, 100)
      : numericValue > 0
        ? 100
        : 0;

  return (
    <div className="analytics-bar-row">
      <div className="analytics-bar-label">
        <span>{label}</span>
        <strong>
          {numericValue}
          {suffix}
        </strong>
      </div>

      <div className="analytics-bar-track">
        <div
          className="analytics-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

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
          <div>
            <p className="career-analytics-eyebrow">Career Dashboard</p>
            <h1>Career Analytics</h1>
            <p className="career-analytics-description">
              Track your overall career preparation and progress.
            </p>
          </div>
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
          <div>
            <p className="career-analytics-eyebrow">Career Dashboard</p>
            <h1>Career Analytics</h1>
            <p className="career-analytics-description">
              Track your overall career preparation and progress.
            </p>
          </div>
        </div>

        <div className="analytics-state-card analytics-error">
          <p>{error}</p>

          <button
            type="button"
            className="secondary-button"
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
          <div>
            <p className="career-analytics-eyebrow">Career Dashboard</p>
            <h1>Career Analytics</h1>
            <p className="career-analytics-description">
              Track your overall career preparation and progress.
            </p>
          </div>
        </div>

        <div className="analytics-state-card">
          <p>No analytics data is available yet.</p>

          <button
            type="button"
            className="secondary-button"
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

  const dsaCompletion = Number(summary.dsaCompletion || 0);
  const goalProgress = Number(goals.averageProgress || 0);
  const interviewSuccessRate = Number(
    summary.interviewSuccessRate || 0
  );
  const resumeReadyPercentage = Number(
    resumes.readyPercentage || 0
  );

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
              A snapshot of your current preparation activity.
            </p>
          </div>
        </div>

        <div className="analytics-summary-grid">
          <article className="analytics-summary-card">
            <div className="analytics-card-top">
              <span className="analytics-card-label">DSA Practice</span>
              <span className="analytics-card-icon">DSA</span>
            </div>

            <strong>{summary.totalDsaProblems || 0}</strong>

            <p>{summary.solvedDsaProblems || 0} solved</p>

            <div className="analytics-progress-track">
              <div
                className="analytics-progress-fill"
                style={{
                  width: `${Math.min(dsaCompletion, 100)}%`,
                }}
              />
            </div>

            <div className="analytics-progress-meta">
              <span>Completion</span>
              <strong>{dsaCompletion}%</strong>
            </div>
          </article>

          <article className="analytics-summary-card">
            <div className="analytics-card-top">
              <span className="analytics-card-label">Goals</span>
              <span className="analytics-card-icon">GO</span>
            </div>

            <strong>{summary.totalGoals || 0}</strong>

            <p>{summary.completedGoals || 0} completed</p>

            <div className="analytics-progress-track">
              <div
                className="analytics-progress-fill"
                style={{
                  width: `${Math.min(goalProgress, 100)}%`,
                }}
              />
            </div>

            <div className="analytics-progress-meta">
              <span>Average progress</span>
              <strong>{goalProgress}%</strong>
            </div>
          </article>

          <article className="analytics-summary-card">
            <div className="analytics-card-top">
              <span className="analytics-card-label">Interviews</span>
              <span className="analytics-card-icon">INT</span>
            </div>

            <strong>{summary.totalInterviews || 0}</strong>

            <p>{summary.selectedInterviews || 0} selected</p>

            <div className="analytics-progress-track">
              <div
                className="analytics-progress-fill"
                style={{
                  width: `${Math.min(interviewSuccessRate, 100)}%`,
                }}
              />
            </div>

            <div className="analytics-progress-meta">
              <span>Success rate</span>
              <strong>{interviewSuccessRate}%</strong>
            </div>
          </article>

          <article className="analytics-summary-card">
            <div className="analytics-card-top">
              <span className="analytics-card-label">Resumes</span>
              <span className="analytics-card-icon">CV</span>
            </div>

            <strong>{summary.totalResumes || 0}</strong>

            <p>{summary.readyResumes || 0} ready</p>

            <div className="analytics-progress-track">
              <div
                className="analytics-progress-fill"
                style={{
                  width: `${Math.min(
                    resumeReadyPercentage,
                    100
                  )}%`,
                }}
              />
            </div>

            <div className="analytics-progress-meta">
              <span>Ready percentage</span>
              <strong>{resumeReadyPercentage}%</strong>
            </div>
          </article>
        </div>

        <div className="analytics-mini-grid">
          <div className="analytics-mini-card">
            <span>Active Goals</span>
            <strong>{summary.activeGoals || 0}</strong>
          </div>

          <div className="analytics-mini-card">
            <span>Upcoming Interviews</span>
            <strong>{summary.upcomingInterviews || 0}</strong>
          </div>

          <div className="analytics-mini-card">
            <span>Total Career Records</span>
            <strong>{summary.totalCareerRecords || 0}</strong>
          </div>
        </div>
      </section>

      <section className="analytics-chart-grid">
        <div className="analytics-overview">
          <div className="analytics-section-header">
            <div>
              <h2>DSA Difficulty</h2>
              <p>
                Distribution of your problem-solving practice.
              </p>
            </div>
          </div>

          <div className="analytics-bars">
            <StatBar
              label="Easy"
              value={dsa.difficulty?.easy}
              total={dsa.total}
            />

            <StatBar
              label="Medium"
              value={dsa.difficulty?.medium}
              total={dsa.total}
            />

            <StatBar
              label="Hard"
              value={dsa.difficulty?.hard}
              total={dsa.total}
            />
          </div>
        </div>

        <div className="analytics-overview">
          <div className="analytics-section-header">
            <div>
              <h2>DSA Status</h2>
              <p>Current progress across your problems.</p>
            </div>
          </div>

          <div className="analytics-bars">
            <StatBar
              label="Solved"
              value={dsa.solved}
              total={dsa.total}
            />

            <StatBar
              label="In Progress"
              value={dsa.inProgress}
              total={dsa.total}
            />

            <StatBar
              label="Not Started"
              value={dsa.notStarted}
              total={dsa.total}
            />
          </div>
        </div>

        <div className="analytics-overview">
          <div className="analytics-section-header">
            <div>
              <h2>Goal Status</h2>
              <p>How your current goals are distributed.</p>
            </div>
          </div>

          <div className="analytics-bars">
            <StatBar
              label="Completed"
              value={goals.completed}
              total={goals.total}
            />

            <StatBar
              label="In Progress"
              value={goals.inProgress}
              total={goals.total}
            />

            <StatBar
              label="Not Started"
              value={goals.notStarted}
              total={goals.total}
            />

            <StatBar
              label="Paused"
              value={goals.paused}
              total={goals.total}
            />
          </div>
        </div>

        <div className="analytics-overview">
          <div className="analytics-section-header">
            <div>
              <h2>Interview Outcomes</h2>
              <p>Overview of your interview results.</p>
            </div>
          </div>

          <div className="analytics-bars">
            <StatBar
              label="Completed"
              value={interviews.completed}
              total={interviews.total}
            />

            <StatBar
              label="Selected"
              value={interviews.selected}
              total={interviews.total}
            />

            <StatBar
              label="Rejected"
              value={interviews.rejected}
              total={interviews.total}
            />

            <StatBar
              label="Cancelled"
              value={interviews.cancelled}
              total={interviews.total}
            />
          </div>
        </div>

        <div className="analytics-overview">
          <div className="analytics-section-header">
            <div>
              <h2>Resume Status</h2>
              <p>Readiness of your saved resumes.</p>
            </div>
          </div>

          <div className="analytics-bars">
            <StatBar
              label="Ready"
              value={resumes.ready}
              total={resumes.total}
            />

            <StatBar
              label="Draft"
              value={resumes.draft}
              total={resumes.total}
            />

            <StatBar
              label="Archived"
              value={resumes.archived}
              total={resumes.total}
            />
          </div>
        </div>

        <div className="analytics-overview">
          <div className="analytics-section-header">
            <div>
              <h2>Interview Types</h2>
              <p>Breakdown of your interview categories.</p>
            </div>
          </div>

          <div className="analytics-bars">
            {Object.keys(interviews.types || {}).length > 0 ? (
              Object.entries(interviews.types).map(
                ([type, count]) => (
                  <StatBar
                    key={type}
                    label={type}
                    value={count}
                    total={interviews.total}
                  />
                )
              )
            ) : (
              <div className="analytics-empty-chart">
                <p>No interview type data yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="analytics-overview">
        <div className="analytics-section-header">
          <div>
            <h2>Detailed Statistics</h2>
            <p>Additional metrics from your career activity.</p>
          </div>
        </div>

        <div className="analytics-basic-grid">
          <div>
            <span>DSA Solved</span>
            <strong>{dsa.solved || 0}</strong>
          </div>

          <div>
            <span>Goal Completion</span>
            <strong>{goals.completionPercentage || 0}%</strong>
          </div>

          <div>
            <span>Interview Success</span>
            <strong>{interviews.successRate || 0}%</strong>
          </div>

          <div>
            <span>Resume Readiness</span>
            <strong>{resumes.readyPercentage || 0}%</strong>
          </div>
        </div>

        <div className="analytics-detail-grid">
          <div>
            <span>Easy Solved</span>
            <strong>
              {dsa.difficulty?.solvedEasy || 0}
            </strong>
          </div>

          <div>
            <span>Medium Solved</span>
            <strong>
              {dsa.difficulty?.solvedMedium || 0}
            </strong>
          </div>

          <div>
            <span>Hard Solved</span>
            <strong>
              {dsa.difficulty?.solvedHard || 0}
            </strong>
          </div>

          <div>
            <span>Upcoming Interviews</span>
            <strong>{interviews.upcoming || 0}</strong>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CareerAnalytics;