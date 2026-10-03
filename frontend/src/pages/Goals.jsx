import React, { useEffect, useState } from "react";
import "../styles/goals.css";
import {
  getGoals,
  getGoalStats,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../services/goalService";

const initialForm = {
  title: "",
  description: "",
  category: "Career",
  priority: "Medium",
  status: "Not Started",
  progress: 0,
  deadline: "",
  milestones: [],
};

const formatDateForInput = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (value) => String(value).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  return year + "-" + month + "-" + day;
};

function Goals() {
  const [goals, setGoals] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    averageProgress: 0,
    completedMilestones: 0,
    totalMilestones: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState(initialForm);
  const [milestoneTitle, setMilestoneTitle] = useState("");

  const loadGoalData = async () => {
    try {
      setLoading(true);
      setError("");

      const [goalData, statsData] = await Promise.all([
        getGoals(),
        getGoalStats(),
      ]);

      setGoals(goalData.goals || []);

      setStats({
        total: statsData.stats?.total || 0,
        completed: statsData.stats?.completed || 0,
        inProgress: statsData.stats?.inProgress || 0,
        notStarted: statsData.stats?.notStarted || 0,
        averageProgress: statsData.stats?.averageProgress || 0,
        completedMilestones:
          statsData.stats?.completedMilestones || 0,
        totalMilestones: statsData.stats?.totalMilestones || 0,
      });
    } catch (err) {
      console.error("Goal page error:", err);
      setError(err.message || "Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoalData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: name === "progress" ? Number(value) : value,
    }));
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData(initialForm);
    setMilestoneTitle("");
    setShowForm(true);
    setError("");
  };

  const openEditForm = (goal) => {
    setEditingId(goal._id);

    setFormData({
      title: goal.title || "",
      description: goal.description || "",
      category: goal.category || "Career",
      priority: goal.priority || "Medium",
      status: goal.status || "Not Started",
      progress: goal.progress || 0,
      deadline: formatDateForInput(goal.deadline),
      milestones: Array.isArray(goal.milestones)
        ? goal.milestones
        : [],
    });

    setMilestoneTitle("");
    setShowForm(true);
    setError("");
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(initialForm);
    setMilestoneTitle("");
  };

  const addMilestone = () => {
    const title = milestoneTitle.trim();

    if (!title) {
      return;
    }

    setFormData((previous) => ({
      ...previous,
      milestones: [
        ...previous.milestones,
        {
          title,
          completed: false,
        },
      ],
    }));

    setMilestoneTitle("");
  };

  const removeMilestone = (index) => {
    setFormData((previous) => ({
      ...previous,
      milestones: previous.milestones.filter(
        (_, milestoneIndex) => milestoneIndex !== index
      ),
    }));
  };

  const toggleMilestone = (index) => {
    setFormData((previous) => ({
      ...previous,
      milestones: previous.milestones.map((milestone, milestoneIndex) =>
        milestoneIndex === index
          ? {
              ...milestone,
              completed: !milestone.completed,
            }
          : milestone
      ),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        ...formData,
        progress:
          formData.status === "Completed"
            ? 100
            : Number(formData.progress),
      };

      if (editingId) {
        await updateGoal(editingId, payload);
      } else {
        await createGoal(payload);
      }

      closeForm();
      await loadGoalData();
    } catch (err) {
      console.error("Save goal error:", err);
      setError(err.message || "Failed to save goal");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this goal?"
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setError("");

      await deleteGoal(id);

      await loadGoalData();
    } catch (err) {
      console.error("Delete goal error:", err);
      setError(err.message || "Failed to delete goal");
    }
  };

  return (
    <div className="goals-page">
      <div className="goals-header">
        <div>
          <p className="goals-eyebrow">Career Planning</p>

          <h1>Goals & Milestones</h1>

          <p className="goals-description">
            Define your career objectives, track progress, and stay
            accountable to your milestones.
          </p>
        </div>

        <button className="primary-button" onClick={openAddForm}>
          + Add Goal
        </button>
      </div>

      {error && <div className="goal-error">{error}</div>}

      <div className="goal-stats-grid">
        <div className="goal-stat-card">
          <span>Total Goals</span>
          <strong>{loading ? "—" : stats.total}</strong>
        </div>

        <div className="goal-stat-card">
          <span>In Progress</span>
          <strong>{loading ? "—" : stats.inProgress}</strong>
        </div>

        <div className="goal-stat-card">
          <span>Completed</span>
          <strong>{loading ? "—" : stats.completed}</strong>
        </div>

        <div className="goal-stat-card">
          <span>Average Progress</span>
          <strong>
            {loading ? "—" : stats.averageProgress + "%"}
          </strong>
        </div>
      </div>

      {showForm && (
        <form className="goal-form" onSubmit={handleSubmit}>
          <div className="goal-form-header">
            <h2>{editingId ? "Edit Goal" : "Create Goal"}</h2>
            <p>
              {editingId
                ? "Update your goal and its milestones."
                : "Add a new objective to your career plan."}
            </p>
          </div>

          <div className="goal-form-grid">
            <div className="goal-form-group full-width">
              <label htmlFor="title">Goal Title</label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Get a software development internship"
                required
              />
            </div>

            <div className="goal-form-group full-width">
              <label htmlFor="description">Description</label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what you want to achieve..."
                rows="4"
              />
            </div>

            <div className="goal-form-group">
              <label htmlFor="category">Category</label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Career">Career</option>
                <option value="Learning">Learning</option>
                <option value="DSA">DSA</option>
                <option value="Project">Project</option>
                <option value="Job Search">Job Search</option>
                <option value="Personal">Personal</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="goal-form-group">
              <label htmlFor="priority">Priority</label>

              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="goal-form-group">
              <label htmlFor="status">Status</label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Paused">Paused</option>
              </select>
            </div>

            <div className="goal-form-group">
              <label htmlFor="progress">
                Progress: {formData.progress}%
              </label>

              <input
                id="progress"
                name="progress"
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={handleChange}
              />
            </div>

            <div className="goal-form-group">
              <label htmlFor="deadline">Deadline</label>

              <input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>

            <div className="goal-form-group full-width">
              <label htmlFor="milestoneTitle">Add Milestone</label>

              <div className="milestone-input-row">
                <input
                  id="milestoneTitle"
                  type="text"
                  value={milestoneTitle}
                  onChange={(event) =>
                    setMilestoneTitle(event.target.value)
                  }
                  placeholder="e.g. Complete 50 DSA problems"
                />

                <button
                  type="button"
                  className="secondary-button"
                  onClick={addMilestone}
                >
                  Add
                </button>
              </div>
            </div>

            {formData.milestones.length > 0 && (
              <div className="goal-form-group full-width">
                <label>Milestones</label>

                <div className="milestone-list">
                  {formData.milestones.map((milestone, index) => (
                    <div
                      className="milestone-row"
                      key={index}
                    >
                      <label className="milestone-check">
                        <input
                          type="checkbox"
                          checked={milestone.completed}
                          onChange={() =>
                            toggleMilestone(index)
                          }
                        />

                        <span
                          className={
                            milestone.completed
                              ? "completed-milestone"
                              : ""
                          }
                        >
                          {milestone.title}
                        </span>
                      </label>

                      <button
                        type="button"
                        className="text-button"
                        onClick={() => removeMilestone(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="goal-form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={closeForm}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Goal"
                : "Save Goal"}
            </button>
          </div>
        </form>
      )}

      <div className="goals-list-header">
        <div>
          <h2>Your Goals</h2>
          <p>Track progress across your career objectives.</p>
        </div>
      </div>

      {!loading && goals.length === 0 && !showForm && (
        <div className="goals-empty-state">
          <div className="goals-empty-icon">🎯</div>

          <h2>No goals yet</h2>

          <p>
            Add your first career goal and start tracking your progress.
          </p>

          <button className="secondary-button" onClick={openAddForm}>
            Create Your First Goal
          </button>
        </div>
      )}

      {!loading && goals.length > 0 && (
        <div className="goals-list">
          {goals.map((goal) => (
            <div className="goal-card" key={goal._id}>
              <div className="goal-card-top">
                <div>
                  <p className="goal-category">{goal.category}</p>

                  <h3>{goal.title}</h3>

                  {goal.description && (
                    <p className="goal-description">
                      {goal.description}
                    </p>
                  )}
                </div>

                <div className="goal-badges">
                  <span className="goal-priority">
                    {goal.priority}
                  </span>

                  <span className="goal-status">
                    {goal.status}
                  </span>
                </div>
              </div>

              <div className="goal-progress-section">
                <div className="goal-progress-header">
                  <span>Progress</span>
                  <strong>{goal.progress}%</strong>
                </div>

                <div className="goal-progress-track">
                  <div
                    className="goal-progress-fill"
                    style={{ width: goal.progress + "%" }}
                  />
                </div>
              </div>

              <div className="goal-card-bottom">
                <div className="goal-meta">
                  {goal.deadline && (
                    <span>
                      Deadline:{" "}
                      {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                  )}

                  <span>
                    Milestones:{" "}
                    {
                      goal.milestones.filter(
                        (milestone) => milestone.completed
                      ).length
                    }
                    /{goal.milestones.length}
                  </span>
                </div>

                <div className="goal-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => openEditForm(goal)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => handleDelete(goal._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="goals-empty-state">
          <h2>Loading goals...</h2>
        </div>
      )}
    </div>
  );
}

export default Goals;