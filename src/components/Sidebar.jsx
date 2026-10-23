import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Calendar,
  CalendarPlus,
  FileText,
  X,
  User,
  Settings,
  ChevronDown,
  Bell,
  Target,
  Clock,
  CalendarClock,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { useState } from "react";

import boitLogo from "../assets/boit-logo.png";

export default function Sidebar({
  isOpen,
  setIsOpen
}) {

  const { hasRole } = useAuth();

  const [settingsOpen, setSettingsOpen] =
    useState(false);

    const [isCollapsed, setIsCollapsed] = useState(false);

  const menuClass =
    ({ isActive }) =>
      `
      flex
      items-center
      gap-3
      px-4
      py-3
      rounded-xl
      transition-all
      ${
        isActive
          ? "bg-violet-600 text-white shadow-sm"
          : `
            text-slate-600
            dark:text-slate-300
            hover:bg-violet-50
            dark:hover:bg-slate-700
          `
      }
    `;

  return (

    <aside
      className={`
        fixed
        left-0
        top-0
        z-50
        bg-white
        dark:bg-slate-800
        dark:text-white
        border-r
        border-slate-200
        dark:border-slate-700
${isCollapsed ? "sidebar-collapsed w-[72px]" : "w-64"}
        h-full
        transition-transform
        duration-300
        ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
    >

{/* COMPANY LOGO / BRANDING */}
<div
  className={`
    h-20 flex items-center
    border-b border-slate-200 dark:border-slate-700
    ${isCollapsed ? "justify-center px-2" : "justify-between px-3"}
  `}
>
  <div className={`flex items-center ${isCollapsed ? "" : "gap-3"}`}>
    <div
      className="
        w-11 h-11 shrink-0 rounded-xl
        bg-white dark:bg-slate-700
        border border-slate-200 dark:border-slate-600
        flex items-center justify-center
        overflow-hidden shadow-sm
      "
    >
      <img
        src={boitLogo}
        alt="BOIT GLOBAL"
        className="w-9 h-9 object-contain"
      />
    </div>

    {!isCollapsed && (
      <h2 className="text-lg font-bold text-violet-600 tracking-tight whitespace-nowrap">
        BOIT GLOBAL
      </h2>
    )}
  </div>

  {!isCollapsed && (
    <button
      onClick={() => setIsOpen(false)}
      className="lg:hidden text-slate-500 hover:text-violet-600"
      aria-label="Close sidebar"
    >
      <X size={20} />
    </button>
  )}

  {/* Expand / Collapse */}
  <button
    onClick={() => setIsCollapsed(prev => !prev)}
    className="
      hidden lg:flex
      absolute -right-3 top-7
      h-7 w-7 items-center justify-center
      rounded-full border border-slate-200
      bg-white text-slate-600 shadow-sm
      hover:bg-violet-50 hover:text-violet-600
      dark:bg-slate-700 dark:border-slate-600
      dark:text-white dark:hover:bg-slate-600
      transition-colors
    "
    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
  >
    {isCollapsed
      ? <PanelLeftOpen size={15} />
      : <PanelLeftClose size={15} />
    }
  </button>
</div>


      {/* ================================================= */}
      {/* NAVIGATION */}
      {/* ================================================= */}

<nav
  className={`
    p-4 space-y-2
    ${isCollapsed ? "hidden" : "block"}
  `}
>

        {/* ================================================= */}
        {/* EMPLOYEE */}
        {/* ================================================= */}

        {hasRole("EMPLOYEE") && (

          <>

            <NavLink
              to="/employee" end
              className={menuClass}
            >

              <LayoutDashboard size={18} />

              Dashboard

            </NavLink>


            <NavLink
              to="/employee/apply-leave"
              className={menuClass}
            >

              <CalendarPlus size={18} />

              Apply Leave

            </NavLink>


            <NavLink
              to="/employee/my-leaves"
              className={menuClass}
            >

              <ClipboardList size={18} />

              My Leaves

            </NavLink>

            <NavLink
  to="/employee/appraisal"
  className={menuClass}
>
  <Target size={18} />

  Performance Appraisal
</NavLink>

          </>

          

        )}


        {/* ================================================= */}
        {/* MANAGER */}
        {/* ================================================= */}

        {hasRole("MANAGER") && (

  <>

    {/* Apply Leave */}

    <NavLink
      to="/manager"
      end
      className={menuClass}
    >

      <LayoutDashboard size={18} />

      Dashboard

    </NavLink>


    <NavLink
      to="/manager/apply-leave"
      className={menuClass}
    >

      <CalendarPlus size={18} />

      Apply Leave

    </NavLink>


    {/* My Leave Requests */}

    <NavLink
      to="/manager/my-leaves"
      className={menuClass}
    >

      <ClipboardList size={18} />

      My Leave Requests

    </NavLink>


    {/* Approvals */}

    <NavLink
      to="/manager/approvals"
      className={menuClass}
    >

      <ClipboardList size={18} />

      Approvals

    </NavLink>


    {/* Document Review */}

    <NavLink
      to="/manager/document-review"
      className={menuClass}
    >

      <FileText size={18} />

      Document Review

    </NavLink>


    {/* Performance Appraisal */}

    <NavLink
      to="/manager/appraisals"
      className={menuClass}
    >

      <Target size={18} />

      Performance Appraisal

    </NavLink>


    {/* Team Calendar */}

    <NavLink
      to="/manager/calendar"
      className={menuClass}
    >

      <Calendar size={18} />

      Team Calendar

    </NavLink>

  </>

)}

        {/* ================================================= */}
        {/* ADMIN */}
        {/* ================================================= */}

        {hasRole("ADMIN") && (

          <>

            <NavLink
              to="/admin"
              className={menuClass}
            >

              <LayoutDashboard size={18} />

              Dashboard

            </NavLink>

            <NavLink
    to="/admin/approvals"
    className={menuClass}
>

    <ClipboardList size={18} />

    Approvals

</NavLink>


            <NavLink
              to="/admin/employees"
              className={menuClass}
            >

              <Users size={18} />

              Employees

            </NavLink>


            <NavLink
              to="/admin/audit-logs"
              className={menuClass}
            >

              <ClipboardList size={18} />

              Audit Logs

            </NavLink>


            <NavLink
              to="/admin/reports"
              className={menuClass}
            >

              <FileText size={18} />

              Reports

            </NavLink>


            <NavLink
              to="/admin/holidays"
              className={menuClass}
            >

              <Calendar size={18} />

              Holiday Management

            </NavLink>


            <NavLink
              to="/admin/leave-policies"
              className={menuClass}
            >

              <ClipboardList size={18} />

              Leave Policies

            </NavLink>

            <NavLink
  to="/admin/sla-management"
  className={menuClass}
>
  <Clock size={18} />

  SLA Management
</NavLink>

<NavLink
  to="/admin/backdated-leave"
  className={menuClass}
>
  <CalendarClock size={18} />
  Backdated Leave
</NavLink>

            <NavLink
  to="/admin/appraisal-cycles"
  className={({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
      isActive
        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
    }`
  }
>
  <Target size={18} />
  <span>Performance Appraisal</span>
</NavLink>

<NavLink
  to="/admin/appraisals"
  className={({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
      isActive
        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
    }`
  }
>
  <Target size={18} />
  <span>Appraisal Reviews</span>
</NavLink>

        <NavLink
  to="/admin/notification-templates"
  className={menuClass}
>
  <Bell size={18} />

  Notification Templates
</NavLink>

          </>
 

        )}




        {/* ================================================= */}
        {/* SETTINGS */}
        {/* ================================================= */}

        <div className="pt-2">

          <button
            onClick={() =>
              setSettingsOpen(
                !settingsOpen
              )
            }
            className="
              w-full
              flex
              items-center
              justify-between
              gap-3
              px-4
              py-3
              rounded-xl
              text-slate-600
              dark:text-slate-300
              hover:bg-violet-50
              dark:hover:bg-slate-700
              transition-all
            "
          >

            <div className="
              flex
              items-center
              gap-3
            ">

              <Settings size={18} />

              <span>
                Settings
              </span>

            </div>

            <ChevronDown
              size={17}
              className={`
                transition-transform
                duration-200
                ${
                  settingsOpen
                    ? "rotate-180"
                    : ""
                }
              `}
            />

          </button>


          {/* Settings Sub Menu */}

          {settingsOpen && (

            <div
              className="
                mt-1
                ml-3
                pl-3
                border-l
                border-slate-200
                dark:border-slate-700
                space-y-1
              "
            >

              <NavLink
                to="/profile"
                className={menuClass}
              >

                <User size={17} />

                My Profile

              </NavLink>


              <NavLink
                to="/change-password"
                className={menuClass}
              >

                <ClipboardList size={17} />

                Change Password

              </NavLink>

            </div>

          )}

        </div>

      </nav>

    </aside>

  );
}