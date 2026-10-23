import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  CalendarPlus,
  Calendar,
  Users,
  Target,
  User,
  Menu,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

/**
 * Bottom tab bar shown only on phones/tablets (<1024px, see mobile.css).
 * Last tab opens the full sidebar for every other screen.
 */
export default function MobileBottomNav({ onMenu }) {
  const { hasRole } = useAuth();

  let tabs = [];

  if (hasRole("ADMIN")) {
    tabs = [
      { to: "/admin", label: "Home", icon: LayoutDashboard, end: true },
      { to: "/admin/approvals", label: "Approvals", icon: ClipboardList },
      { to: "/admin/employees", label: "Employees", icon: Users },
      { to: "/profile", label: "Profile", icon: User },
    ];
  } else if (hasRole("MANAGER")) {
    tabs = [
      { to: "/manager", label: "Home", icon: LayoutDashboard, end: true },
      { to: "/manager/approvals", label: "Approvals", icon: ClipboardList },
      { to: "/manager/apply-leave", label: "Apply", icon: CalendarPlus },
      { to: "/manager/calendar", label: "Calendar", icon: Calendar },
    ];
  } else {
    tabs = [
      { to: "/employee", label: "Home", icon: LayoutDashboard, end: true },
      { to: "/employee/apply-leave", label: "Apply", icon: CalendarPlus },
      { to: "/employee/my-leaves", label: "My Leaves", icon: ClipboardList },
      { to: "/employee/appraisal", label: "Appraisal", icon: Target },
    ];
  }

  return (
    <nav className="mobile-bottom-nav" aria-label="Primary">
      {tabs.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <Icon size={22} />
          {label}
        </NavLink>
      ))}
      <button type="button" onClick={onMenu} aria-label="Open menu">
        <Menu size={22} />
        More
      </button>
    </nav>
  );
}
