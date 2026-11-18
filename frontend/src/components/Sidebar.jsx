
import {
  Zap,
  LayoutDashboard,
  Activity,
  BatteryCharging,
  Sun,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  CircleDot,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const navigation = [
  {
    name: "Overview",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Battery Diagnostics",
    path: "/diagnostics",
    icon: Activity,
  },
  {
    name: "Second-Life Assessment",
    path: "/assessment",
    icon: BatteryCharging,
  },
  {
    name: "Solar Simulator",
    path: "/simulator",
    icon: Sun,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: FileText,
  },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Zap size={23} fill="currentColor" />
        </div>

        {!collapsed && (
          <div className="brand-text">
            <h2>ReVolt</h2>
            <span>Battery Intelligence</span>
          </div>
        )}
      </div>

      <button
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar"
      >
        {collapsed ? (
          <ChevronRight size={18} />
        ) : (
          <ChevronLeft size={18} />
        )}
      </button>

      <div className="sidebar-section-label">
        {!collapsed && "WORKSPACE"}
      </div>

      <nav className="sidebar-navigation">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              title={collapsed ? item.name : ""}
            >
              <Icon size={19} strokeWidth={1.8} />

              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="system-status">
          <div className="status-heading">
            <CircleDot size={15} />
            {!collapsed && <span>System Operational</span>}
          </div>

          {!collapsed && (
            <p>ML assessment interface ready</p>
          )}
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">A</div>

          {!collapsed && (
            <div className="profile-info">
              <strong>Analyst</strong>
              <span>ReVolt Workspace</span>
            </div>
          )}

          {!collapsed && (
            <Settings size={18} className="profile-settings" />
          )}
        </div>
      </div>
    </aside>
  );
}
