import {
  BriefcaseBusiness,
  FolderKanban,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  MessageSquareText,
  Settings,
  Target,
  Trophy,
  UserRound,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigationItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Applications", icon: BriefcaseBusiness, path: "/applications" },
  { label: "Skills", icon: GraduationCap, path: "/skills" },
  { label: "Projects", icon: FolderKanban, path: "/projects" },
  { label: "DSA Progress", icon: Trophy, path: "#" },
  { label: "Interviews", icon: MessageSquareText, path: "/interviews" },
  { label: "Goals", icon: Target, path: "/goals" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <Gauge size={20} />
        </div>

        <div>
          <h2>DevCareerOS</h2>
          <span>Career Command Center</span>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <p className="nav-section-title">Workspace</p>

        {navigationItems.map((item) => {
          const Icon = item.icon;

          if (item.path === "#") {
            return (
              <button type="button" className="nav-item" key={item.label}>
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              key={item.label}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <button type="button" className="nav-item">
          <ListChecks size={18} />
          <span>Resume Manager</span>
        </button>

        <button type="button" className="nav-item">
          <Settings size={18} />
          <span>Settings</span>
        </button>

        <div className="profile-mini">
          <div className="profile-avatar">
            <UserRound size={18} />
          </div>

          <div>
            <strong>Sheetal Patel</strong>
            <span>Developer</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
