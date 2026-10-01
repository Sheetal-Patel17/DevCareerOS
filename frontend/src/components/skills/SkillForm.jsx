import { X } from "lucide-react";
import { useEffect, useState } from "react";

const emptySkill = {
  name: "",
  category: "Programming",
  level: "Beginner",
  progress: 20,
  target: 80,
  lastUpdated: new Date().toISOString().slice(0, 10),
};

function SkillForm({ skill, onClose, onSave }) {
  const [form, setForm] = useState(skill || emptySkill);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(skill || emptySkill);
    setError("");
  }, [skill]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "progress" || name === "target" ? Number(value) : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Skill name is required.");
      return;
    }

    if (form.progress < 0 || form.progress > 100) {
      setError("Progress must be between 0 and 100.");
      return;
    }

    if (form.target < 0 || form.target > 100) {
      setError("Target must be between 0 and 100.");
      return;
    }

    onSave({
      ...form,
      name: form.name.trim(),
      lastUpdated: new Date().toISOString().slice(0, 10),
    });
  }

  return (
    <div className="modal-backdrop">
      <div className="skill-modal">
        <div className="modal-header">
          <div>
            <h2>{skill ? "Edit Skill" : "Add Skill"}</h2>
            <p>Track your current level and target.</p>
          </div>

          <button type="button" className="modal-close" onClick={onClose}>
            <X size={19} />
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Skill Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="TypeScript"
              />
            </label>

            <label>
              Category
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option>Programming</option>
                <option>Frontend</option>
                <option>Backend</option>
                <option>Database</option>
                <option>AI/ML</option>
                <option>Tools</option>
              </select>
            </label>

            <label>
              Proficiency
              <select name="level" value={form.level} onChange={handleChange}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </label>

            <label>
              Current Progress
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
              Target Progress
              <input
                type="number"
                name="target"
                min="0"
                max="100"
                value={form.target}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="primary-button">
              {skill ? "Save Changes" : "Add Skill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SkillForm;
