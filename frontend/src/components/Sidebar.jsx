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

const navigationItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Applications", icon: BriefcaseBusiness },
  { label: "Skills", icon: GraduationCap },
  { label: "Projects", icon: FolderKanban },
  { label: "DSA Progress", icon: Trophy },
  { label: "Interviews", icon: MessageSquareText },
  { label: "Goals", icon: Target },
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

          return (
            <button
              type="button"
              className={`nav-item ${item.active ? "active" : ""}`}
              key={item.label}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
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
