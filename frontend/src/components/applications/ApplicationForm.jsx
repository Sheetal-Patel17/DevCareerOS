import { X } from "lucide-react";
import { useEffect, useState } from "react";

const emptyApplication = {
  company: "",
  role: "",
  location: "",
  type: "Full-time",
  salary: "",
  dateApplied: new Date().toISOString().slice(0, 10),
  status: "Applied",
  source: "LinkedIn",
  url: "",
  notes: "",
};

function ApplicationForm({ application, onClose, onSave }) {
  const [form, setForm] = useState(application || emptyApplication);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(application || emptyApplication);
    setError("");
  }, [application]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.company.trim() || !form.role.trim()) {
      setError("Company name and role are required.");
      return;
    }

    onSave(form);
  }

  return (
    <div className="modal-backdrop">
      <div className="application-modal">
        <div className="modal-header">
          <div>
            <h2>{application ? "Edit Application" : "Add Application"}</h2>
            <p>Keep your opportunity details organized.</p>
          </div>

          <button type="button" className="modal-close" onClick={onClose}>
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}

          <div className="form-grid">
            <label>
              Company
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company name"
              />
            </label>

            <label>
              Role
              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="Job title"
              />
            </label>

            <label>
              Location
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Ahmedabad / Remote"
              />
            </label>

            <label>
              Type
              <select name="type" value={form.type} onChange={handleChange}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Contract</option>
              </select>
            </label>

            <label>
              Salary
              <input
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="?6 LPA"
              />
            </label>

            <label>
              Date Applied
              <input
                type="date"
                name="dateApplied"
                value={form.dateApplied}
                onChange={handleChange}
              />
            </label>

            <label>
              Status
              <select name="status" value={form.status} onChange={handleChange}>
                <option>Applied</option>
                <option>Shortlisted</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </label>

            <label>
              Source
              <select name="source" value={form.source} onChange={handleChange}>
                <option>LinkedIn</option>
                <option>Company Website</option>
                <option>College Placement</option>
                <option>Job Portal</option>
                <option>Referral</option>
              </select>
            </label>
          </div>

          <label>
            Job URL
            <input
              type="url"
              name="url"
              value={form.url}
              onChange={handleChange}
              placeholder="https://..."
            />
          </label>

          <label>
            Notes
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Interview details, recruiter notes, next steps..."
              rows="4"
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="primary-button">
              {application ? "Save Changes" : "Add Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplicationForm;
