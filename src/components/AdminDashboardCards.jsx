import {
  Users,
  UserCheck,
  Clock,
  Globe,
  FileText,
  Calendar
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";

export default function AdminDashboardCards({
  metrics
}) {
    console.log("AdminDashboardCards rendered");

  const { theme } = useTheme();

  const isDark = theme === "dark";

  console.log("Dashboard card theme:", theme, "isDark:", isDark);

  const cards = [

    {
      title: "Total Employees",
      value: metrics.totalEmployees,
      icon: Users,
      color: "bg-blue-500"
    },

    {
      title: "Active Employees",
      value: metrics.activeEmployees,
      icon: UserCheck,
      color: "bg-green-500"
    },

    {
      title: "Pending Approvals",
      value: metrics.pendingApprovals,
      icon: Clock,
      color: "bg-orange-500"
    },

    {
      title: "Countries",
      value: metrics.totalCountries,
      icon: Globe,
      color: "bg-purple-500"
    },

    {
      title: "Policies",
      value: metrics.totalPolicies,
      icon: FileText,
      color: "bg-pink-500"
    },

    {
      title: "Upcoming Holidays",
      value: metrics.upcomingHolidays,
      icon: Calendar,
      color: "bg-red-500"
    }

  ];

  return (

    <div
      className="
        grid
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
      "
    >

      {cards.map((card) => {

        const Icon = card.icon;

        return (

          <div
            key={card.title}

            className="
              rounded-2xl
              shadow
              p-6
              flex
              items-center
              justify-between
              transition-all
              duration-300
              border
            "

            style={{
              backgroundColor: isDark
                ? "#1e293b"
                : "#ffffff",

              borderColor: isDark
                ? "#334155"
                : "#e5e7eb",

              color: isDark
                ? "#ffffff"
                : "#111827"
            }}
          >

            {/* LEFT SIDE */}

            <div>

              <p
                className="text-sm"
                style={{
                  color: isDark
                    ? "#94a3b8"
                    : "#64748b"
                }}
              >
                {card.title}
              </p>

              <h2
                className="
                  text-3xl
                  font-bold
                  mt-2
                "
                style={{
                  color: isDark
                    ? "#ffffff"
                    : "#1e293b"
                }}
              >
                {card.value}
              </h2>

              <p
                className="text-xs mt-2"
                style={{
                  color: isDark
                    ? "#94a3b8"
                    : "#94a3b8"
                }}
              >
                {card.title === "Total Employees" &&
                  "All registered users"
                }

                {card.title === "Active Employees" &&
                  "Currently active"
                }

                {card.title === "Pending Approvals" &&
                  "Awaiting approval"
                }

                {card.title === "Countries" &&
                  "Total countries"
                }

                {card.title === "Policies" &&
                  "Leave policies"
                }

                {card.title === "Upcoming Holidays" &&
                  "Next 30 days"
                }
              </p>

            </div>

            {/* ICON */}

            <div
              className={`
                ${card.color}
                p-4
                rounded-xl
                text-white
                shadow-sm
              `}
            >

              <Icon size={28} />

            </div>

          </div>

        );

      })}

    </div>

  );
}