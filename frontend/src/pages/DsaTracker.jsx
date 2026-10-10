import React, { useEffect, useState } from "react";
import {
  createDsaProblem,
  deleteDsaProblem,
  getDsaProblems,
  getDsaStats,
  updateDsaProblem,
} from "../services/dsaService";
import "../styles/dsaTracker.css";
import DashboardBackButton from "../components/DashboardBackButton";

const initialForm = {
  title: "",
  topic: "",
  difficulty: "Easy",
  status: "Not Started",
  platform: "LeetCode",
  problemUrl: "",
  notes: "",
};

const initialStats = {
  total: 0,
  solved: 0,
  inProgress: 0,
  notStarted: 0,
  completionPercentage: 0,
  difficulty: {
    totalEasy: 0,
    totalMedium: 0,
    totalHard: 0,
    solvedEasy: 0,
    solvedMedium: 0,
    solvedHard: 0,
  },
};

function DsaTracker() {
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState(initialStats);

  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadDsaData = async () => {
    try {
      setLoading(true);
      setError("");

      const [problemData, statsData] = await Promise.all([
        getDsaProblems(),
        getDsaStats(),
      ]);

      setProblems(problemData.problems || []);
      setStats(statsData.stats || initialStats);
    } catch (err) {
      console.error("DSA tracker error:", err);
      setError(err.message || "Failed to load DSA data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDsaData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim() || !formData.topic.trim()) {
      setError("Title and topic are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        title: formData.title.trim(),
        topic: formData.topic.trim(),
        difficulty: formData.difficulty,
        status: formData.status,
        platform: formData.platform.trim() || "LeetCode",
        problemUrl: formData.problemUrl.trim(),
        notes: formData.notes.trim(),
      };

      if (editingId) {
        await updateDsaProblem(editingId, payload);
      } else {
        await createDsaProblem(payload);
      }

      resetForm();
      await loadDsaData();
    } catch (err) {
      console.error("Save DSA problem error:", err);
      setError(err.message || "Failed to save DSA problem");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (problem) => {
    setEditingId(problem._id);

    setFormData({
      title: problem.title || "",
      topic: problem.topic || "",
      difficulty: problem.difficulty || "Easy",
      status: problem.status || "Not Started",
      platform: problem.platform || "LeetCode",
      problemUrl: problem.problemUrl || "",
      notes: problem.notes || "",
    });

    setShowForm(true);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (problemId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this DSA problem?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteDsaProblem(problemId);

      await loadDsaData();
    } catch (err) {
      console.error("Delete DSA problem error:", err);
      setError(err.message || "Failed to delete DSA problem");
    }
  };

  const filteredProblems = problems.filter((problem) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !search ||
      problem.title?.toLowerCase().includes(search) ||
      problem.topic?.toLowerCase().includes(search) ||
      problem.platform?.toLowerCase().includes(search);

    const matchesDifficulty =
      difficultyFilter === "All" ||
      problem.difficulty === difficultyFilter;

    const matchesStatus =
      statusFilter === "All" ||
      problem.status === statusFilter;

    return (
      matchesSearch &&
      matchesDifficulty &&
      matchesStatus
    );
  });

  const getStatusClass = (status) => {
    if (status === "Solved") {
      return "dsa-status dsa-status-solved";
    }

    if (status === "In Progress") {
      return "dsa-status dsa-status-progress";
    }

    return "dsa-status dsa-status-not-started";
  };

  const getDifficultyClass = (difficulty) => {
    if (difficulty === "Hard") {
      return "dsa-difficulty dsa-difficulty-hard";
    }

    if (difficulty === "Medium") {
      return "dsa-difficulty dsa-difficulty-medium";
    }

    return "dsa-difficulty dsa-difficulty-easy";
  };

  if (loading) {
    return (
      <main className="dsa-page">
        <DashboardBackButton />
        <div className="dsa-header">
          <p className="dsa-eyebrow">Practice Tracker</p>
          <h1>DSA Progress</h1>
          <p className="dsa-description">
            Track coding problems, topics, difficulty, and solving progress.
          </p>
        </div>

        <div className="dsa-state-card">
          <p>Loading your DSA tracker...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="dsa-page">
        <DashboardBackButton />
      <div className="dsa-header">
        <div>
          <p className="dsa-eyebrow">Practice Tracker</p>

          <h1>DSA Progress</h1>

          <p className="dsa-description">
            Track coding problems, monitor your progress, and build consistent
            problem-solving habits.
          </p>
        </div>

        <div className="dsa-header-actions">
          <button
            type="button"
            className="dsa-secondary-button"
            onClick={loadDsaData}
          >
            Refresh
          </button>

          <button
            type="button"
            className="dsa-primary-button"
            onClick={() => {
              setShowForm((current) => !current);
              setError("");
            }}
          >
            {showForm ? "Close Form" : "Add Problem"}
          </button>
        </div>
      </div>

      {error && (
        <div className="dsa-message dsa-error">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <section className="dsa-stats-grid">
        <article className="dsa-stat-card">
          <span>Total Problems</span>
          <strong>{stats.total || 0}</strong>
          <p>All tracked problems</p>
        </article>

        <article className="dsa-stat-card">
          <span>Solved</span>
          <strong>{stats.solved || 0}</strong>
          <p>Successfully completed</p>
        </article>

        <article className="dsa-stat-card">
          <span>In Progress</span>
          <strong>{stats.inProgress || 0}</strong>
          <p>Currently being practiced</p>
        </article>

        <article className="dsa-stat-card">
          <span>Completion</span>
          <strong>{stats.completionPercentage || 0}%</strong>
          <p>Overall solving progress</p>
        </article>
      </section>

      <section className="dsa-difficulty-summary">
        <div>
          <span>Easy</span>
          <strong>{stats.difficulty?.totalEasy || 0}</strong>
          <small>
            {stats.difficulty?.solvedEasy || 0} solved
          </small>
        </div>

        <div>
          <span>Medium</span>
          <strong>{stats.difficulty?.totalMedium || 0}</strong>
          <small>
            {stats.difficulty?.solvedMedium || 0} solved
          </small>
        </div>

        <div>
          <span>Hard</span>
          <strong>{stats.difficulty?.totalHard || 0}</strong>
          <small>
            {stats.difficulty?.solvedHard || 0} solved
          </small>
        </div>
      </section>

      {showForm && (
        <section className="dsa-form-card">
          <div className="dsa-section-header">
            <div>
              <h2>
                {editingId ? "Edit DSA Problem" : "Add DSA Problem"}
              </h2>

              <p>
                Save the problem details so you can track your practice.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="dsa-form">
            <div className="dsa-form-grid">
              <div className="dsa-form-group">
                <label htmlFor="title">Problem Title *</label>

                <input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Two Sum"
                  maxLength={160}
                  required
                />
              </div>

              <div className="dsa-form-group">
                <label htmlFor="topic">Topic *</label>

                <input
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  placeholder="e.g. Arrays, Binary Search"
                  maxLength={100}
                  required
                />
              </div>

              <div className="dsa-form-group">
                <label htmlFor="difficulty">Difficulty</label>

                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="dsa-form-group">
                <label htmlFor="status">Status</label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Solved">Solved</option>
                </select>
              </div>

              <div className="dsa-form-group">
                <label htmlFor="platform">Platform</label>

                <input
                  id="platform"
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  placeholder="LeetCode"
                  maxLength={80}
                />
              </div>

              <div className="dsa-form-group">
                <label htmlFor="problemUrl">Problem URL</label>

                <input
                  id="problemUrl"
                  name="problemUrl"
                  type="url"
                  value={formData.problemUrl}
                  onChange={handleChange}
                  placeholder="https://leetcode.com/problems/..."
                />
              </div>

              <div className="dsa-form-group dsa-form-full">
                <label htmlFor="notes">Notes</label>

                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add approach, mistakes, key idea, or revision notes."
                  rows="4"
                  maxLength={1000}
                />
              </div>
            </div>

            <div className="dsa-form-actions">
              <button
                type="button"
                className="dsa-secondary-button"
                onClick={resetForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="dsa-primary-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Problem"
                    : "Save Problem"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="dsa-list-card">
        <div className="dsa-section-header">
          <div>
            <h2>Problem Tracker</h2>

            <p>
              {filteredProblems.length} problem
              {filteredProblems.length === 1 ? "" : "s"} shown
            </p>
          </div>
        </div>

        <div className="dsa-filters">
          <div className="dsa-search">
            <label htmlFor="dsa-search">Search</label>

            <input
              id="dsa-search"
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search title, topic, or platform..."
            />
          </div>

          <div className="dsa-filter-group">
            <label htmlFor="difficulty-filter">Difficulty</label>

            <select
              id="difficulty-filter"
              value={difficultyFilter}
              onChange={(event) =>
                setDifficultyFilter(event.target.value)
              }
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="dsa-filter-group">
            <label htmlFor="status-filter">Status</label>

            <select
              id="status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="All">All Statuses</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Solved">Solved</option>
            </select>
          </div>

          <button
            type="button"
            className="dsa-clear-button"
            onClick={() => {
              setSearchTerm("");
              setDifficultyFilter("All");
              setStatusFilter("All");
            }}
          >
            Clear
          </button>
        </div>

        {filteredProblems.length === 0 ? (
          <div className="dsa-empty-state">
            <h3>
              {problems.length === 0
                ? "No DSA problems yet"
                : "No problems match your filters"}
            </h3>

            <p>
              {problems.length === 0
                ? "Add your first coding problem to start tracking your DSA progress."
                : "Try changing your search or filter selections."}
            </p>

            {problems.length === 0 && (
              <button
                type="button"
                className="dsa-primary-button"
                onClick={() => setShowForm(true)}
              >
                Add Your First Problem
              </button>
            )}
          </div>
        ) : (
          <div className="dsa-table-wrapper">
            <table className="dsa-table">
              <thead>
                <tr>
                  <th>Problem</th>
                  <th>Topic</th>
                  <th>Difficulty</th>
                  <th>Status</th>
                  <th>Platform</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProblems.map((problem) => (
                  <tr key={problem._id}>
                    <td>
                      <div className="dsa-problem-title">
                        <strong>{problem.title}</strong>

                        {problem.problemUrl && (
                          <a
                            href={problem.problemUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open problem
                          </a>
                        )}
                      </div>
                    </td>

                    <td>{problem.topic}</td>

                    <td>
                      <span
                        className={getDifficultyClass(
                          problem.difficulty
                        )}
                      >
                        {problem.difficulty}
                      </span>
                    </td>

                    <td>
                      <span
                        className={getStatusClass(
                          problem.status
                        )}
                      >
                        {problem.status}
                      </span>
                    </td>

                    <td>{problem.platform || "LeetCode"}</td>

                    <td>
                      {problem.updatedAt
                        ? new Date(
                            problem.updatedAt
                          ).toLocaleDateString()
                        : "—"}
                    </td>

                    <td>
                      <div className="dsa-action-buttons">
                        <button
                          type="button"
                          className="dsa-action-button"
                          onClick={() => handleEdit(problem)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="dsa-action-button dsa-delete-button"
                          onClick={() =>
                            handleDelete(problem._id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default DsaTracker;