import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CalendarDays, ChevronRight, Command, Menu, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const workspacePages = [
  { label: "Dashboard", description: "Your career overview", path: "/" },
  { label: "Applications", description: "Track job applications", path: "/applications" },
  { label: "Skills & Learning", description: "Build your skill roadmap", path: "/skills" },
  { label: "Projects", description: "Manage portfolio projects", path: "/projects" },
  { label: "DSA Progress", description: "Track problem-solving practice", path: "/dsa" },
  { label: "GitHub Activity", description: "Review coding activity", path: "/github" },
  { label: "Interviews", description: "Manage interviews and rounds", path: "/interviews" },
  { label: "Goals", description: "Review your career goals", path: "/goals" },
  { label: "Career Analytics", description: "Explore career progress", path: "/analytics" },
  { label: "Resume Manager", description: "Manage resumes", path: "/resumes" },
  { label: "Profile & Settings", description: "Update your profile", path: "/settings" },
];

function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const rootRef = useRef(null);
  const searchRef = useRef(null);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [panel, setPanel] = useState(null);

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return [];
    return workspacePages.filter((page) => `${page.label} ${page.description}`.toLowerCase().includes(value)).slice(0, 6);
  }, [query]);

  useEffect(() => {
    setPanel(null);
    setSearchOpen(false);
    setQuery("");
  }, [location.pathname]);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setPanel(null);
        setSearchOpen(false);
      }
    };
    const handleKeyboard = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
        setSearchOpen(true);
        setPanel(null);
      }
      if (event.key === "Escape") {
        setPanel(null);
        setSearchOpen(false);
        searchRef.current?.blur();
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    window.addEventListener("keydown", handleKeyboard);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, []);

  const goToPage = (path) => {
    setPanel(null);
    setSearchOpen(false);
    setQuery("");
    navigate(path);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (results.length) goToPage(results[0].path);
    else if (query.trim()) setSearchOpen(true);
  };

  return (
    <header className="topbar" ref={rootRef}>
      <div className="topbar-left">
        <button type="button" className="mobile-menu-button" onClick={() => window.dispatchEvent(new Event("devcareer:open-menu"))} aria-label="Open navigation" title="Open navigation">
          <Menu size={20} />
        </button>
        <div className="topbar-search-wrap">
          <form className="search-box" role="search" onSubmit={handleSearchSubmit}>
            <Search size={17} aria-hidden="true" />
            <input ref={searchRef} type="search" placeholder="Search your career workspace..." aria-label="Search your career workspace" aria-keyshortcuts="Control+K Meta+K" aria-expanded={searchOpen && query.trim().length > 0} aria-controls="workspace-search-results" value={query} onFocus={() => setSearchOpen(true)} onChange={(event) => { setQuery(event.target.value); setSearchOpen(true); setPanel(null); }} />
            <span className="search-shortcut"><Command size={12} /> K</span>
          </form>
          {searchOpen && query.trim() && (
            <div className="workspace-search-results" id="workspace-search-results">
              {results.length ? results.map((page) => (
                <button type="button" key={page.path} onClick={() => goToPage(page.path)} className="workspace-search-result">
                  <span className="workspace-search-result-copy"><strong>{page.label}</strong><small>{page.description}</small></span>
                  <ChevronRight size={16} />
                </button>
              )) : <p className="workspace-search-empty">No pages found for “{query.trim()}”. Try “interviews”, “goals”, or “resume”.</p>}
              <div className="workspace-search-hint">Press Enter to open the first result</div>
            </div>
          )}
        </div>
      </div>
      <div className="topbar-actions">
        <div className="topbar-popover-anchor">
          <button type="button" className={`icon-button ${panel === "calendar" ? "is-active" : ""}`} title="Quick schedule" aria-label="Open schedule shortcuts" aria-expanded={panel === "calendar"} onClick={() => { setPanel((current) => current === "calendar" ? null : "calendar"); setSearchOpen(false); }}>
            <CalendarDays size={18} />
          </button>
          {panel === "calendar" && (
            <section className="topbar-popover topbar-calendar-popover" aria-label="Schedule shortcuts">
              <div className="topbar-popover-heading"><span className="topbar-popover-icon"><CalendarDays size={17} /></span><div><strong>Your schedule</strong><small>{new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</small></div></div>
              <p className="topbar-popover-note">Keep your next career milestone close at hand.</p>
              <button type="button" className="topbar-popover-link" onClick={() => goToPage("/interviews")}><span><strong>Interview tracker</strong><small>Review rounds and interview dates</small></span><ChevronRight size={16} /></button>
              <button type="button" className="topbar-popover-link" onClick={() => goToPage("/goals")}><span><strong>Career goals</strong><small>Check your upcoming priorities</small></span><ChevronRight size={16} /></button>
            </section>
          )}
        </div>
        <div className="topbar-popover-anchor">
          <button type="button" className={`icon-button notification-button ${panel === "notifications" ? "is-active" : ""}`} title="Notifications" aria-label="Open notifications" aria-expanded={panel === "notifications"} onClick={() => { setPanel((current) => current === "notifications" ? null : "notifications"); setSearchOpen(false); }}>
            <Bell size={18} />
          </button>
          {panel === "notifications" && (
            <section className="topbar-popover topbar-notifications-popover" aria-label="Notifications">
              <div className="topbar-popover-heading"><span className="topbar-popover-icon"><Bell size={17} /></span><div><strong>Notifications</strong><small>Workspace updates</small></div><span className="notification-count">0 new</span></div>
              <div className="topbar-notifications-empty"><span className="topbar-notifications-check">✓</span><strong>You’re all caught up</strong><p>When there are updates to review, you’ll find them here.</p></div>
              <button type="button" className="topbar-popover-link" onClick={() => goToPage("/interviews")}><span><strong>Review interviews</strong><small>Keep your interview pipeline up to date</small></span><ChevronRight size={16} /></button>
            </section>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
