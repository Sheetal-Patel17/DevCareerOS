import { Bell, CalendarDays, Menu, Search } from "lucide-react";

function Topbar({ onMenuClick }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button type="button" className="mobile-menu-button" onClick={onMenuClick} aria-label="Open navigation">
          <Menu size={20} />
        </button>
        <div className="search-box">
          <Search size={17} />
          <input type="text" placeholder="Search your career workspace..." aria-label="Search" />
        </div>
      </div>
      <div className="topbar-actions">
        <button type="button" className="icon-button" title="Calendar"><CalendarDays size={18} /></button>
        <button type="button" className="icon-button notification-button" title="Notifications">
          <Bell size={18} /><span className="notification-dot" />
        </button>
      </div>
    </header>
  );
}
export default Topbar;