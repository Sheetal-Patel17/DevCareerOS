import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ApplicationStats from "../components/applications/ApplicationStats";
import ApplicationFilters from "../components/applications/ApplicationFilters";
import ApplicationCard from "../components/applications/ApplicationCard";
import ApplicationForm from "../components/applications/ApplicationForm";
import { getApplications, createApplication, updateApplication, deleteApplication } from "../services/applicationService";
import "../styles/applications.css";

function Applications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getApplications().then((data) => setApplications(data.applications || [])).catch((error) => console.error("Application loading error:", error));
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);

  const filteredApplications = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesSearch =
        !search ||
        application.company.toLowerCase().includes(search) ||
        application.role.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  function handleSave(application) {
    if (application.id) {
      updateApplication(application.id, application).then((data) => {
        setApplications((current) => current.map((item) => item._id === application._id ? data.application : item));
      }).catch((error) => console.error(error));
    } else {
      createApplication(application).then((data) => setApplications((current) => [data.application, ...current])).catch((error) => console.error(error));
    }

    setShowForm(false);
    setEditingApplication(null);
  }

  function handleEdit(application) {
    setEditingApplication(application);
    setShowForm(true);
  }

  function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) {
      return;
    }

    deleteApplication(id).then(() => setApplications((current) => current.filter((application) => application._id !== id))).catch((error) => console.error(error));
  }

  function handleCloseForm() {
    setShowForm(false);
    setEditingApplication(null);
  }

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-area">
        <Topbar />

        <div className="dashboard-content">
          <section className="applications-header">
            <div className="page-heading">
              <h1>Job Applications</h1>
              <p>
                Track every opportunity from application to final outcome.
              </p>
            </div>

            <button
              type="button"
              className="primary-button add-application-button"
              onClick={() => {
                setEditingApplication(null);
                setShowForm(true);
              }}
            >
              <Plus size={17} />
              Add Application
            </button>
          </section>

          <ApplicationStats applications={applications} />

          <ApplicationFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <section className="applications-list">
            <div className="applications-list-header">
              <div>
                <h2>Your Applications</h2>
                <p>
                  Showing {filteredApplications.length} of {applications.length}{" "}
                  applications
                </p>
              </div>
            </div>

            {filteredApplications.length > 0 ? (
              <div className="application-card-list">
                {filteredApplications.map((application) => (
                  <ApplicationCard
                    application={application}
                    key={application._id}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-applications">
                <h3>No applications found</h3>
                <p>Try changing your search or status filter.</p>
              </div>
            )}
          </section>
        </div>
      </main>

      {showForm && (
        <ApplicationForm
          application={editingApplication}
          onClose={handleCloseForm}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default Applications;
