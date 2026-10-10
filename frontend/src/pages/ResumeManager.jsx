import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import "../styles/resumeManager.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
getResumes,
getResumeStats,
createResume,
updateResume,
deleteResume,
} from "../services/resumeService";

const initialForm = {
title: "",
targetRole: "",
version: "v1.0",
summary: "",
skills: [],
education: [],
experience: [],
projects: [],
certifications: [],
links: {
github: "",
linkedin: "",
portfolio: "",
},
status: "Draft",
};

function createEmptyForm() {
return {
...initialForm,
skills: [],
education: [],
experience: [],
projects: [],
certifications: [],
links: {
github: "",
linkedin: "",
portfolio: "",
},
};
}

function ResumeManager() {
const [resumes, setResumes] = useState([]);

const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("All");

const [stats, setStats] = useState({
total: 0,
draft: 0,
ready: 0,
archived: 0,
});

const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const [showForm, setShowForm] = useState(false);
const [editingId, setEditingId] = useState(null);
const [saving, setSaving] = useState(false);

const [formData, setFormData] = useState(createEmptyForm());

const loadResumeData = async () => {
try {
setLoading(true);
setError("");


  const [resumeData, statsData] = await Promise.all([
    getResumes(),
    getResumeStats(),
  ]);

  setResumes(resumeData.resumes || []);

  setStats({
    total: statsData.stats?.total || 0,
    draft: statsData.stats?.draft || 0,
    ready: statsData.stats?.ready || 0,
    archived: statsData.stats?.archived || 0,
  });
} catch (err) {
  console.error("Resume manager error:", err);
  setError(err.message || "Failed to load resumes");
} finally {
  setLoading(false);
}


};

useEffect(() => {
loadResumeData();
}, []);

const handleChange = (event) => {
const { name, value } = event.target;


setFormData((previous) => ({
  ...previous,
  [name]: value,
}));


};

const handleLinkChange = (event) => {
const { name, value } = event.target;


setFormData((previous) => ({
  ...previous,
  links: {
    ...previous.links,
    [name]: value,
  },
}));


};

const openAddForm = () => {
setEditingId(null);
setFormData(createEmptyForm());
setShowForm(true);
setError("");
};

const openEditForm = (resume) => {
setEditingId(resume._id);


setFormData({
  title: resume.title || "",
  targetRole: resume.targetRole || "",
  version: resume.version || "v1.0",
  summary: resume.summary || "",
  skills: Array.isArray(resume.skills) ? resume.skills : [],
  education: Array.isArray(resume.education)
    ? resume.education
    : [],
  experience: Array.isArray(resume.experience)
    ? resume.experience
    : [],
  projects: Array.isArray(resume.projects)
    ? resume.projects
    : [],
  certifications: Array.isArray(resume.certifications)
    ? resume.certifications
    : [],
  links: {
    github: resume.links?.github || "",
    linkedin: resume.links?.linkedin || "",
    portfolio: resume.links?.portfolio || "",
  },
  status: resume.status || "Draft",
});

setShowForm(true);
setError("");


};

const closeForm = () => {
setShowForm(false);
setEditingId(null);
setFormData(createEmptyForm());
};

const handleSkillsChange = (event) => {
const skills = event.target.value
.split(",")
.map((skill) => skill.trim())
.filter(Boolean);


setFormData((previous) => ({
  ...previous,
  skills,
}));


};

const handleSubmit = async (event) => {
event.preventDefault();


try {
  setSaving(true);
  setError("");

  if (editingId) {
    await updateResume(editingId, formData);
  } else {
    await createResume(formData);
  }

  closeForm();
  await loadResumeData();
} catch (err) {
  console.error("Save resume error:", err);
  setError(err.message || "Failed to save resume");
} finally {
  setSaving(false);
}


};

const handleDelete = async (id) => {
const shouldDelete = window.confirm(
"Are you sure you want to delete this resume?"
);


if (!shouldDelete) {
  return;
}

try {
  setError("");

  await deleteResume(id);
  await loadResumeData();
} catch (err) {
  console.error("Delete resume error:", err);
  setError(err.message || "Failed to delete resume");
}


};

const filteredResumes = resumes.filter((resume) => {
const search = searchTerm.toLowerCase().trim();


const title = (resume.title || "").toLowerCase();
const targetRole = (resume.targetRole || "").toLowerCase();
const version = (resume.version || "").toLowerCase();

const matchesSearch =
  search === "" ||
  title.includes(search) ||
  targetRole.includes(search) ||
  version.includes(search);

const matchesStatus =
  statusFilter === "All" ||
  resume.status === statusFilter;

return matchesSearch && matchesStatus;


});

return ( <div className="app-shell">
  <Sidebar />
  <main className="main-area">
    <Topbar />
    <div className="resume-manager-page"> <div className="resume-manager-header"> <div> <p className="resume-eyebrow">Career Documents</p>


      <h1>Resume Manager</h1>

      <p className="resume-description">
        Manage resume versions for different roles and keep your
        career documents organized.
      </p>
    </div>

    <button
      className="primary-button"
      onClick={openAddForm}
    >
      + Add Resume
    </button>
  </div>

  {error && (
    <div className="resume-error">
      {error}
    </div>
  )}

  <div className="resume-stats-grid">
    <div className="resume-stat-card">
      <span>Total Resumes</span>
      <strong>
        {loading ? "—" : stats.total}
      </strong>
    </div>

    <div className="resume-stat-card">
      <span>Draft</span>
      <strong>
        {loading ? "—" : stats.draft}
      </strong>
    </div>

    <div className="resume-stat-card">
      <span>Ready</span>
      <strong>
        {loading ? "—" : stats.ready}
      </strong>
    </div>

    <div className="resume-stat-card">
      <span>Archived</span>
      <strong>
        {loading ? "—" : stats.archived}
      </strong>
    </div>
  </div>

  {showForm && (
    <div
      className="resume-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) closeForm();
      }}
    >
      <form
        className="resume-form resume-form-modal"
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-modal-title"
      >
        <div className="resume-form-header resume-modal-heading">
          <div>
            <h2 id="resume-modal-title">
              {editingId ? "Edit Resume" : "Create Resume"}
            </h2>
            <p>
              {editingId
                ? "Update your resume information."
                : "Create a new resume version."}
            </p>
          </div>
          <button
            type="button"
            className="resume-modal-close"
            onClick={closeForm}
            disabled={saving}
            aria-label="Close resume form"
          >
            <X size={20} />
          </button>
        </div>

      <div className="resume-form-grid">
        <div className="resume-form-group">
          <label htmlFor="title">
            Resume Title
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Software Developer Resume"
            required
          />
        </div>

        <div className="resume-form-group">
          <label htmlFor="targetRole">
            Target Role
          </label>

          <input
            id="targetRole"
            name="targetRole"
            type="text"
            value={formData.targetRole}
            onChange={handleChange}
            placeholder="e.g. Full Stack Developer"
            required
          />
        </div>

        <div className="resume-form-group">
          <label htmlFor="version">
            Version
          </label>

          <input
            id="version"
            name="version"
            type="text"
            value={formData.version}
            onChange={handleChange}
            placeholder="e.g. v1.0"
          />
        </div>

        <div className="resume-form-group">
          <label htmlFor="status">
            Status
          </label>

          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Draft">Draft</option>
            <option value="Ready">Ready</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        <div className="resume-form-group full-width">
          <label htmlFor="summary">
            Professional Summary
          </label>

          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder="Write a concise professional summary..."
            rows="5"
          />
        </div>

        <div className="resume-form-group full-width">
          <label htmlFor="skills">
            Skills
          </label>

          <input
            id="skills"
            type="text"
            value={formData.skills.join(", ")}
            onChange={handleSkillsChange}
            placeholder="Python, React, Node.js, SQL"
          />

          <small>
            Separate skills with commas.
          </small>
        </div>

        <div className="resume-form-group full-width">
          <label>
            Professional Links
          </label>

          <div className="resume-links-grid">
            <input
              name="github"
              type="url"
              value={formData.links.github}
              onChange={handleLinkChange}
              placeholder="GitHub URL"
            />

            <input
              name="linkedin"
              type="url"
              value={formData.links.linkedin}
              onChange={handleLinkChange}
              placeholder="LinkedIn URL"
            />

            <input
              name="portfolio"
              type="url"
              value={formData.links.portfolio}
              onChange={handleLinkChange}
              placeholder="Portfolio URL"
            />
          </div>
        </div>
      </div>

      <div className="resume-form-actions">
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
            ? "Update Resume"
            : "Save Resume"}
        </button>
      </div>
      </form>
    </div>
  )}

  <div className="resume-list-header">
    <div>
      <h2>Your Resumes</h2>

      <p>
        Keep multiple versions ready for different job roles.
      </p>
    </div>
  </div>

  {!loading && resumes.length > 0 && (
    <div className="resume-filters" aria-label="Filter resumes">
      <div className="resume-filter-group resume-search-group">
        <label htmlFor="resume-search">Search resumes</label>
        <input
          id="resume-search"
          type="search"
          placeholder="Search by title, target role, or version"
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
        />
      </div>

      <div className="resume-filter-group resume-status-filter">
        <label htmlFor="resume-status-filter">Filter by status</label>
        <select
          id="resume-status-filter"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="All">All statuses</option>
          <option value="Draft">Draft</option>
          <option value="Ready">Ready</option>
          <option value="Archived">Archived</option>
        </select>
      </div>
    </div>
  )}

  {!loading &&
    resumes.length === 0 &&
    !showForm && (
      <div className="resume-empty-state">
        <div className="resume-empty-icon">
          📄
        </div>

        <h2>No resumes yet</h2>

        <p>
          Create your first resume version to start
          organizing your career documents.
        </p>

        <button
          className="secondary-button"
          onClick={openAddForm}
        >
          Create Your First Resume
        </button>
      </div>
    )}

  {!loading &&
    resumes.length > 0 &&
    filteredResumes.length === 0 && (
      <div className="resume-empty-state">
        <div className="resume-empty-icon">
          🔎
        </div>

        <h2>No matching resumes</h2>

        <p>
          Try changing your search or status filter.
        </p>

        <button
          className="secondary-button"
          onClick={() => {
            setSearchTerm("");
            setStatusFilter("All");
          }}
        >
          Clear Filters
        </button>
      </div>
    )}

  {!loading &&
    filteredResumes.length > 0 && (
      <div className="resume-list">
        {filteredResumes.map((resume) => (
          <div
            className="resume-card"
            key={resume._id}
          >
            <div className="resume-card-top">
              <div>
                <p className="resume-target-role">
                  {resume.targetRole}
                </p>

                <h3>{resume.title}</h3>

                <p className="resume-version">
                  Version {resume.version}
                </p>
              </div>

              <span className="resume-status">
                {resume.status}
              </span>
            </div>

            {resume.summary && (
              <p className="resume-card-summary">
                {resume.summary}
              </p>
            )}

            {resume.skills?.length > 0 && (
              <div className="resume-skills">
                {resume.skills.map(
                  (skill, index) => (
                    <span key={index}>
                      {skill}
                    </span>
                  )
                )}
              </div>
            )}

            <div className="resume-card-bottom">
              <small>
                Updated{" "}
                {new Date(
                  resume.lastUpdated ||
                    resume.updatedAt
                ).toLocaleDateString()}
              </small>

              <div className="resume-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    openEditForm(resume)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    handleDelete(resume._id)
                  }
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
    <div className="resume-empty-state">
      <h2>Loading resumes...</h2>
    </div>
  )}
</div>
  </main>
</div>

);
}

export default ResumeManager;


