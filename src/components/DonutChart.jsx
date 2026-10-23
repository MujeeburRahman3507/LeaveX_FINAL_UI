/**
 * Simple SVG donut chart (no chart library, so it always renders).
 * data: [{ name, value, color }]
 */
export default function DonutChart({ data, total, label }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  const sum = data.reduce((s, d) => s + (Number(d.value) || 0), 0);

  let offset = 0;
  const segments =
    sum > 0
      ? data.map((d) => {
          const value = Number(d.value) || 0;
          if (!value) return null;
          const length = (value / sum) * circumference;
          const circle = (
            <circle
              key={d.name}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth="14"
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset}
            />
          );
          offset += length;
          return circle;
        })
      : null;

  return (
    <div className="w-32 h-32 sm:w-44 sm:h-44 shrink-0 relative mx-auto sm:mx-0">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#cbd5e1"
          strokeOpacity="0.35"
          strokeWidth="14"
        />
        {segments}
      </svg>

      <div className="absolute inset-0 flex flex-col justify-center items-center">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <span className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          {total}
        </span>
      </div>
    </div>
  );
}
