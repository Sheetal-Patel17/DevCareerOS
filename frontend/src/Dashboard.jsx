import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { getApplications } from "./services/applicationService";
import { getSkills } from "./services/skillService";
import { getProjects } from "./services/projectService";
import { getDsaStats } from "./services/dsaService";
import { getGoals } from "./services/goalService";

function getTimeGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("devcareer_user") || "{}");
  } catch {
    user = {};
  }

  const greeting = getTimeGreeting();
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    projects: 0,
    skills: 0,
    dsa: 0,
    goals: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // Update each card as soon as its own request finishes rather than
    // holding all dashboard data until the slowest request completes.
    const tasks = [
      getApplications()
        .then((data) => {
          if (!active) return;
          const applications = data.applications || [];
          setStats((current) => ({
            ...current,
            applications: applications.length,
            interviews: applications.filter((item) => item.status === "Interview").length,
          }));
          setRecentApplications(applications.slice(0, 5));
        })
        .catch((error) => console.error("Applications dashboard load error:", error)),

      getSkills()
        .then((data) => {
          if (active) setStats((current) => ({ ...current, skills: (data.skills || []).length }));
        })
        .catch((error) => console.error("Skills dashboard load error:", error)),

      getProjects()
        .then((data) => {
          if (active) setStats((current) => ({ ...current, projects: (data.projects || []).length }));
        })
        .catch((error) => console.error("Projects dashboard load error:", error)),

      getDsaStats()
        .then((data) => {
          if (active) setStats((current) => ({ ...current, dsa: data.stats?.solved ?? 0 }));
        })
        .catch((error) => console.error("DSA dashboard load error:", error)),

      getGoals()
        .then((data) => {
          if (active) setStats((current) => ({ ...current, goals: (data.goals || []).length }));
        })
        .catch((error) => console.error("Goals dashboard load error:", error)),
    ];

    Promise.allSettled(tasks).finally(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-area">
        <Topbar />
        <div className="dashboard-content">
          <section className="page-heading">
            <h1>{greeting}, {user.name || "there"}!</h1>
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
                <p>{loading ? "Loading your data…" : "Your account data"}</p>
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
              <div className="empty-applications">
                <h3>{loading ? "Loading applications…" : "No applications yet"}</h3>
                <p>{loading ? "Your workspace will update as data arrives." : "Create your first application to see it here."}</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="application-table">
                  <thead><tr><th>Company</th><th>Role</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {recentApplications.map((item) => (
                      <tr key={item._id}>
                        <td>{item.company}</td>
                        <td>{item.role}</td>
                        <td>{item.status}</td>
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
