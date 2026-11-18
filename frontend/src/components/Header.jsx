
import { useState } from "react";
import {
  Search,
  Bell,
  RefreshCw,
  ChevronDown,
  CalendarDays,
} from "lucide-react";

export default function Header({ onRefresh }) {
  const [searchOpen, setSearchOpen] = useState(false);

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="breadcrumb">
          <span>ReVolt</span>
          <span className="breadcrumb-separator">/</span>
          <strong>Workspace</strong>
        </div>

        <div className="header-date">
          <CalendarDays size={15} />
          <span>{today}</span>
        </div>
      </div>

      <div className="header-actions">
        <div className={`header-search ${searchOpen ? "search-open" : ""}`}>
          {searchOpen && (
            <input
              type="search"
              placeholder="Search batteries..."
              autoFocus
              aria-label="Search batteries"
            />
          )}

          <button
            className="header-icon-button"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle search"
          >
            <Search size={19} />
          </button>
        </div>

        <button
          className="header-icon-button"
          onClick={onRefresh}
          title="Refresh dashboard"
          aria-label="Refresh dashboard"
        >
          <RefreshCw size={18} />
        </button>

        <button
          className="header-icon-button notification-button"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={19} />
          <span className="notification-dot" />
        </button>

        <button className="header-profile">
          <span className="header-avatar">A</span>
          <span className="header-profile-name">Analyst</span>
          <ChevronDown size={15} />
        </button>
      </div>
    </header>
  );
}
