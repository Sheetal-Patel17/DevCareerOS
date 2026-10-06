import { FolderKanban, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ProjectStats from "../components/projects/ProjectStats";
import ProjectFilters from "../components/projects/ProjectFilters";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectForm from "../components/projects/ProjectForm";
import { getProjects, createProject, updateProject, deleteProject } from "../services/projectService";
import "../styles/projects.css";

function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getProjects().then((data) => setProjects(data.projects || [])).catch((error) => console.error("Project loading error:", error));
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const filteredProjects = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        !search ||
        project.name.toLowerCase().includes(search) ||
        project.description.toLowerCase().includes(search) ||
        project.technologies.some((technology) =>
          technology.toLowerCase().includes(search)
        );

      const matchesStatus =
        statusFilter === "All" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  function handleSave(project) {
    if (project.id) {
      updateProject(project.id, project).then((data) => setProjects((current) => current.map((item) => item._id === project._id ? data.project : item))).catch((error) => console.error(error));
    } else {
      createProject(project).then((data) => setProjects((current) => [data.project, ...current])).catch((error) => console.error(error));
    }

    setShowForm(false);
    setEditingProject(null);
  }

  function handleEdit(project) {
    setEditingProject(project);
    setShowForm(true);
  }

  function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    deleteProject(id).then(() => setProjects((current) => current.filter((project) => project._id !== id))).catch((error) => console.error(error));
  }

  function handleCloseForm() {
    setShowForm(false);
    setEditingProject(null);
  }

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-area">
        <Topbar />

        <div className="dashboard-content">
          <section className="projects-header">
            <div className="page-heading">
              <div className="page-heading-with-icon">
                <div className="page-icon">
                  <FolderKanban size={20} />
                </div>

                <div>
                  <h1>Projects</h1>
                  <p>
                    Manage the projects that showcase your skills and experience.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="primary-button"
              onClick={() => {
                setEditingProject(null);
                setShowForm(true);
              }}
            >
              <Plus size={17} />
              Add Project
            </button>
          </section>

          <ProjectStats projects={projects} />

          <ProjectFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <section className="projects-panel">
            <div className="projects-list-header">
              <div>
                <h2>Your Projects</h2>
                <p>
                  Showing {filteredProjects.length} of {projects.length} projects
                </p>
              </div>
            </div>

            {filteredProjects.length > 0 ? (
              <div className="projects-grid">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-projects">
                <h3>No projects found</h3>
                <p>Try another search or status filter.</p>
              </div>
            )}
          </section>
        </div>
      </main>

      {showForm && (
        <ProjectForm
          project={editingProject}
          onClose={handleCloseForm}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default Projects;
