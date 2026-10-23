import {
  CalendarDays,
  CheckCircle,
  Clock3,
  XCircle,
  BriefcaseBusiness,
  TrendingUp
} from "lucide-react";

const iconMap = {
  "Annual Balance": CalendarDays,
  "Used Leave": BriefcaseBusiness,
  "Remaining": TrendingUp,
  "Approved": CheckCircle,
  "Rejected": XCircle,
  "Pending": Clock3
};

export default function MetricCard({
  title,
  value
}) {

  const Icon =
    iconMap[title] || CalendarDays;

  return (

    <div className="
      bg-white
      rounded-2xl
      p-5
      shadow-sm
      border
      border-slate-100
      hover:shadow-xl
      transition-all
      duration-300
      hover:-translate-y-1
    ">

      <div className="flex justify-between items-center">

        <div>

          <p className="
            text-sm
            text-slate-500
          ">
            {title}
          </p>

          <h2 className="
            text-3xl
            font-bold
            mt-2
            text-slate-800
          ">
            {value}
          </h2>

        </div>

        <div className="
          w-12 h-12
          rounded-xl
          bg-violet-100
          flex
          items-center
          justify-center
        ">
          <Icon
            size={22}
            className="text-violet-600"
          />
        </div>

      </div>

    </div>
  );
}