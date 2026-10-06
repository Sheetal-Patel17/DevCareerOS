import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { getApplications } from "./services/applicationService";
import { getSkills } from "./services/skillService";
import { getProjects } from "./services/projectService";
import { getDsaStats } from "./services/dsaService";
import { getGoals } from "./services/goalService";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("devcareer_user") || "{}");
  const [stats, setStats] = useState({ applications: 0, interviews: 0, projects: 0, skills: 0, dsa: 0, goals: 0 });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getApplications(),
      getSkills(),
      getProjects(),
      getDsaStats(),
      getGoals(),
    ]).then(([apps, skills, projects, dsa, goals]) => {
      const applications = apps.applications || [];
      setStats({
        applications: applications.length,
        interviews: applications.filter((item) => item.status === "Interview").length,
        projects: (projects.projects || []).length,
        skills: (skills.skills || []).length,
        dsa: dsa.stats?.solved ?? 0,
        goals: (goals.goals || []).length,
      });
      setRecentApplications(applications.slice(0, 5));
    }).catch((error) => {
      console.error("Dashboard loading error:", error);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-area">
        <Topbar />
        <div className="dashboard-content">
          <section className="page-heading">
            <h1>Good morning, {user.name || "there"}!</h1>
            <p>Your career workspace, personalized for your account.</p>
          </section>

          <section className="stats-grid">
            {[
              ["Applications", stats.applications],
              ["Interviews", stats.interviews],
              ["Projects", stats.projects],
              ["DSA Solved", stats.dsa],
            ].map(([label, value]) => (
              <article className="stat-card" key={label}>
                <div className="stat-card-header"><span>{label}</span></div>
                <strong>{value}</strong>
                <p>{loading ? "Loading..." : "Your account data"}</p>
              </article>
            ))}
          </section>

          <section className="progress-grid">
            <div className="panel">
              <div className="panel-heading">
                <div><h2>Your Skills</h2><p>Skills saved in your account.</p></div>
              </div>
              <strong>{stats.skills}</strong>
              <p className="dashboard-empty-note">Manage them from Skills & Learning.</p>
            </div>
            <div className="panel">
              <div className="panel-heading">
                <div><h2>Your Goals</h2><p>Career goals saved in your account.</p></div>
              </div>
              <strong>{stats.goals}</strong>
              <p className="dashboard-empty-note">Manage them from Goals.</p>
            </div>
          </section>

          <section className="panel applications-panel">
            <div className="panel-heading">
              <div><h2>Recent Applications</h2><p>Only applications belonging to your account.</p></div>
            </div>
            {recentApplications.length === 0 ? (
              <div className="empty-applications"><h3>No applications yet</h3><p>Create your first application to see it here.</p></div>
            ) : (
              <div className="table-wrapper">
                <table className="application-table">
                  <thead><tr><th>Company</th><th>Role</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {recentApplications.map((item) => (
                      <tr key={item._id}>
                        <td>{item.company}</td><td>{item.role}</td><td>{item.status}</td>
                        <td>{item.dateApplied ? new Date(item.dateApplied).toLocaleDateString() : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;