import { BarChart3, BriefcaseBusiness, FolderKanban, Gauge, GraduationCap, LayoutDashboard, ListChecks, LogOut, MessageSquareText, Settings, Target, Trophy, UserRound, GitBranch } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const navigationItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Applications", icon: BriefcaseBusiness, path: "/applications" },
  { label: "Skills", icon: GraduationCap, path: "/skills" },
  { label: "Projects", icon: FolderKanban, path: "/projects" },
  { label: "DSA Progress", icon: Trophy, path: "/dsa" },
  { label: "GitHub Activity", icon: GitBranch, path: "/github" },
  { label: "Interviews", icon: MessageSquareText, path: "/interviews" },
  { label: "Goals", icon: Target, path: "/goals" },
  { label: "Career Analytics", icon: BarChart3, path: "/analytics" },
];

function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("devcareer_user") || "{}");
  const accountLabel = user.role === "admin" ? "Administrator" : "Career Member";

  useEffect(() => {
    const openMenu = () => setOpen(true);
    window.addEventListener("devcareer:open-menu", openMenu);
    return () => window.removeEventListener("devcareer:open-menu", openMenu);
  }, []);

  function logout() {
    localStorage.removeItem("devcareer_token");
    localStorage.removeItem("devcareer_user");
    navigate("/login", { replace: true });
  }

  return (
    <aside className={"sidebar" + (open ? " sidebar-open" : "")}>
      <div className="brand">
        <div className="brand-mark"><Gauge size={20} /></div>
        <div><h2>DevCareerOS</h2><span>Career Command Center</span></div>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <p className="nav-section-title">Workspace</p>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              to={item.path}
              className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
              key={item.label}
              onClick={() => setOpen(false)}
            >
              <Icon size={18} /><span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <NavLink to="/resumes" onClick={() => setOpen(false)} className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <ListChecks size={18} /><span>Resume Manager</span>
        </NavLink>
        <NavLink to="/settings" onClick={() => setOpen(false)} className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <Settings size={18} /><span>Settings</span>
        </NavLink>

        <div className="profile-mini">
          <div className="profile-avatar"><UserRound size={18} /></div>
          <div className="profile-mini-text">
            <strong>{user.name || "Your Name"}</strong>
            <span>{accountLabel}</span>
          </div>
        </div>

        <button type="button" className="logout-button" onClick={logout}>
          <LogOut size={17} /><span>Log out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;