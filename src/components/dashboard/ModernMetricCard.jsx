import { useEffect, useState } from "react";

import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    XCircle,
    Wallet,
    TrendingUp
} from "lucide-react";

export default function ModernMetricCard({

    title,

    value,

    color,

    icon

}) {

    const [displayValue, setDisplayValue] =
        useState(0);

    useEffect(() => {

        let start = 0;

        const end = Number(value);

        if (isNaN(end)) {

            setDisplayValue(value);

            return;

        }

        const duration = 1000;

        const increment =
            end / (duration / 20);

        const timer = setInterval(() => {

            start += increment;

            if (start >= end) {

                start = end;

                clearInterval(timer);

            }

        setDisplayValue(
    Number.isInteger(start)
        ? start
        : Number(start.toFixed(1))
);

        }, 20);

        return () => clearInterval(timer);

    }, [value]);

    const renderIcon = () => {

        switch (icon) {

            case "balance":

                return <Wallet size={30} />;

            case "approved":

                return <CheckCircle2 size={30} />;

            case "pending":

                return <Clock3 size={30} />;

            case "rejected":

                return <XCircle size={30} />;

            case "leave":

                return <CalendarDays size={30} />;

            default:

                return <TrendingUp size={30} />;

        }

    };

    return (

<div
className={`
group relative
rounded-2xl sm:rounded-3xl
shadow-lg
hover:shadow-2xl
hover:-translate-y-2
hover:scale-[1.02]
transition-all
duration-300
text-white
p-3 sm:p-6
${color}
`}
>

<div
className="
flex
justify-between
items-center
"
>

<div>

<p
className="
text-white/80
text-[11px] sm:text-sm leading-tight pr-6 sm:pr-0
"
>

{title}

</p>

<h2
className="
text-2xl sm:text-5xl
font-bold
mt-1 sm:mt-3
"
>

{displayValue}

</h2>

<p
className="
hidden sm:block
text-white/80 text-sm
mt-2
"
>

Updated just now

</p>

</div>

<div
className="
metric-icon absolute top-2 right-2 sm:static
bg-white/20
rounded-lg sm:rounded-2xl p-1.5 sm:p-4
transition-transform
duration-300
group-hover:rotate-6
group-hover:scale-110
"
>

{renderIcon()}

</div>

</div>

</div>

    );

}