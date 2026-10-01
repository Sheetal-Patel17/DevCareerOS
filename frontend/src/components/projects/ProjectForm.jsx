import { X } from "lucide-react";
import { useEffect, useState } from "react";

const emptyProject = {
  name: "",
  description: "",
  technologies: [],
  technologiesInput: "",
  status: "Planning",
  progress: 0,
  githubUrl: "",
  liveUrl: "",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: "",
};

function ProjectForm({ project, onClose, onSave }) {
  const [form, setForm] = useState({
    ...emptyProject,
    ...(project || {}),
    technologiesInput: project?.technologies?.join(", ") || "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    setForm({
      ...emptyProject,
      ...(project || {}),
      technologiesInput: project?.technologies?.join(", ") || "",
    });

    setError("");
  }, [project]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: name === "progress" ? Number(value) : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Project name is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Project description is required.");
      return;
    }

    if (form.progress < 0 || form.progress > 100) {
      setError("Progress must be between 0 and 100.");
      return;
    }

    const technologies = form.technologiesInput
      .split(",")
      .map((technology) => technology.trim())
      .filter(Boolean);

    if (technologies.length === 0) {
      setError("Add at least one technology.");
      return;
    }

    if (form.githubUrl && !form.githubUrl.startsWith("http")) {
      setError("GitHub URL must start with http:// or https://.");
      return;
    }

    if (form.liveUrl && !form.liveUrl.startsWith("http")) {
      setError("Live URL must start with http:// or https://.");
      return;
    }

    onSave({
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      technologies,
    });
  }

  return (
    <div className="modal-backdrop">
      <div className="project-modal">
        <div className="modal-header">
          <div>
            <h2>{project ? "Edit Project" : "Add Project"}</h2>
            <p>Keep your portfolio projects organized.</p>
          </div>

          <button type="button" className="modal-close" onClick={onClose}>
            <X size={19} />
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="project-form-grid">
            <label>
              Project Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="My Full Stack App"
              />
            </label>

            <label>
              Status
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option>Planning</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>On Hold</option>
              </select>
            </label>
          </div>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What does this project do?"
              rows="4"
            />
          </label>

          <label>
            Technologies
            <input
              name="technologiesInput"
              value={form.technologiesInput}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
            />
            <small>Separate technologies with commas.</small>
          </label>

          <div className="project-form-grid">
            <label>
              Progress (%)
              <input
                type="number"
                name="progress"
                min="0"
                max="100"
                value={form.progress}
                onChange={handleChange}
              />
            </label>

            <label>
              Start Date
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />
            </label>

            <label>
              GitHub URL
              <input
                type="url"
                name="githubUrl"
                value={form.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/..."
              />
            </label>

            <label>
              Live Demo URL
              <input
                type="url"
                name="liveUrl"
                value={form.liveUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </label>
          </div>

          <label>
            End Date
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="primary-button">
              {project ? "Save Changes" : "Add Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectForm;
