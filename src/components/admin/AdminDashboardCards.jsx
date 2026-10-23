import {
  Users,
  UserCheck,
  Clock3,
  Globe,
  FileText,
  CalendarDays,
  TrendingUp
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";



const cards = [

  {
    title: "Total Employees",
    key: "totalEmployees",
    subtitle: "All registered users",
    icon: Users,
    iconBg: "from-violet-500 to-indigo-600",
    badge: "100%"
  },

  {
    title: "Active Employees",
    key: "activeEmployees",
    subtitle: "Currently active",
    icon: UserCheck,
    iconBg: "from-emerald-500 to-green-600",
    badge: "100%"
  },

  {
    title: "Pending Approvals",
    key: "pendingApprovals",
    subtitle: "Awaiting approval",
    icon: Clock3,
    iconBg: "from-amber-500 to-orange-500",
    badge: "33%"
  },

  {
    title: "Countries",
    key: "totalCountries",
    subtitle: "Total countries",
    icon: Globe,
    iconBg: "from-purple-500 to-violet-600",
    badge: "100%"
  },

  {
    title: "Policies",
    key: "totalPolicies",
    subtitle: "Leave policies",
    icon: FileText,
    iconBg: "from-pink-500 to-rose-500",
    badge: "0%"
  },

  {
    title: "Upcoming Holidays",
    key: "upcomingHolidays",
    subtitle: "Next 30 days",
    icon: CalendarDays,
    iconBg: "from-red-500 to-orange-500",
    badge: "50%"
  }

];

export default function AdminDashboardCards({ metrics }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  return (

    <div
      className="
      grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6 keep-grid
      "
    >

      {

        cards.map(card => {

          const Icon =
            card.icon;

          return (

            <div
              key={card.key}
className={`
  rounded-2xl
  border
  shadow-sm
  hover:shadow-xl
  transition-all
  duration-300
  hover:-translate-y-1
  overflow-hidden
  ${
    isDark
      ? "bg-slate-800 border-slate-700"
      : "bg-white border-slate-100"
  }
`}
            >

              <div className="p-3 sm:p-6">

                <div className="flex justify-between">

                  <div
                    className={`
                    metric-icon-sm w-8 h-8 sm:w-16 sm:h-16 shrink-0
                    rounded-xl sm:rounded-2xl
                    bg-gradient-to-r
                    ${card.iconBg}
                    flex
                    items-center
                    justify-center
                    shadow-lg
                    `}
                  >

                    <Icon
                      className="text-white"
                      size={30}
                    />

                  </div>

                  <div>

                    <span
className={`
  hidden sm:flex px-3
  py-1
  rounded-full
  text-xs
  font-semibold
  items-center
  gap-1
  ${
    isDark
      ? "bg-green-900/40 text-green-300"
      : "bg-green-50 text-green-600"
  }
`}
                    >

                      <TrendingUp
                        size={14}
                      />

                      {card.badge}

                    </span>

                  </div>

                </div>

                <div className="mt-2 sm:mt-6">

                  <p
className={`
  text-xs sm:text-sm
  ${isDark ? "text-slate-300" : "text-slate-500"}
`}
                  >
                    {card.title}
                  </p>

                  <h2
className={`
  text-2xl sm:text-4xl
  font-bold
  mt-0.5 sm:mt-1
  ${isDark ? "text-white" : "text-slate-800"}
`}
                  >
                    {metrics[card.key]}
                  </h2>

                  <p
className={`
  text-[10px] sm:text-sm leading-tight
  mt-1 sm:mt-2
  ${isDark ? "text-slate-400" : "text-slate-400"}
`}
                  >
                    {card.subtitle}
                  </p>

                </div>

              </div>

              <div
                className="
                h-1
                bg-gradient-to-r
                from-violet-500
                to-indigo-500
                "
              />

            </div>

          );

        })

      }

    </div>

  );

}