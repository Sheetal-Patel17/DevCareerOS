import { FolderKanban, Plus } from "lucide-react";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/projects.css";

function Projects() {
  const [showForm, setShowForm] = useState(false);

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
              onClick={() => setShowForm(true)}
            >
              <Plus size={17} />
              Add Project
            </button>
          </section>

          {showForm && (
            <div className="empty-projects">
              Project form will be added next.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Projects;
