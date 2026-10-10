import { Bell, CalendarDays, Home, Menu, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function Topbar() {
  const location = useLocation();
  const showDashboardShortcut = location.pathname !== "/";

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => window.dispatchEvent(new Event("devcareer:open-menu"))}
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        {showDashboardShortcut && (
          <Link
            to="/"
            className="dashboard-shortcut"
            aria-label="Go to Dashboard"
            title="Back to Dashboard"
          >
            <Home size={17} />
            <span className="dashboard-shortcut-label">Dashboard</span>
          </Link>
        )}

        <div className="search-box">
          <Search size={17} />
          <input
            type="text"
            placeholder="Search your career workspace..."
            aria-label="Search"
          />
        </div>
      </div>

      <div className="topbar-actions">
        <button type="button" className="icon-button" title="Calendar" aria-label="Calendar">
          <CalendarDays size={18} />
        </button>
        <button type="button" className="icon-button notification-button" title="Notifications" aria-label="Notifications">
          <Bell size={18} />
          <span className="notification-dot" />
        </button>
      </div>
    </header>
  );
}

export default Topbar;
