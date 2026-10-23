import {
  useEffect,
  useState
} from "react";

import {
  CalendarDays,
  Globe2,
  Clock3
} from "lucide-react";

import holidayService
from "../../services/holidayService";

export default function AdminUpcomingHolidayWidget() {

  const [holidays,
    setHolidays] =
    useState([]);

  useEffect(() => {

    loadHolidays();

  }, []);

 const loadHolidays = async () => {
  try {
    const response = await holidayService.getAll();

    console.log("ADMIN HOLIDAY API RESPONSE:", response.data);

    // Support both:
    // { success: true, data: [...] }
    // and direct [...]
    const allHolidays =
      response.data?.data ??
      response.data ??
      [];

    console.log("ALL HOLIDAYS:", allHolidays);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = allHolidays
      .filter((holiday) => {

        // Support holidayDate
        // If your backend uses another field, we can adjust it after seeing the log.
        const dateValue =
          holiday.holidayDate ||
          holiday.date;

        if (!dateValue) {
          return false;
        }

        const holidayDate = new Date(dateValue);
        holidayDate.setHours(0, 0, 0, 0);

        return holidayDate >= today;
      })
      .sort((a, b) => {

        const dateA =
          new Date(a.holidayDate || a.date);

        const dateB =
          new Date(b.holidayDate || b.date);

        return dateA - dateB;
      });

    console.log("UPCOMING HOLIDAYS:", upcoming);

    setHolidays(upcoming);

  } catch (error) {

    console.error(
      "Failed to load upcoming holidays:",
      error
    );

    setHolidays([]);

  }
};
  const getDaysLeft = (date) => {

    const today =
      new Date();

    const holiday =
      new Date(date);

    const diff =
      Math.ceil(

        (holiday - today)

        /

        (1000*60*60*24)

      );

    if(diff <= 0)
      return "Today";

    if(diff === 1)
      return "Tomorrow";

    return diff + " Days";

  };

  return (

<div
className="
bg-white
dark:bg-slate-800
rounded-2xl
shadow-sm
dark:shadow-slate-950/30
border
border-slate-100
dark:border-slate-700
p-6
hover:shadow-lg
transition
"
>

<div
className="
flex
justify-between
items-center
mb-6
"
>

<div
className="
flex
items-center
gap-3
"
>

<div
className="
w-10
h-10
rounded-xl
bg-violet-100
flex
items-center
justify-center
"
>

<CalendarDays
size={20}
className="text-violet-600"
/>

</div>

<div>

<h2
className="
font-bold
text-lg
text-slate-800
dark:text-white
"
>

Upcoming Holidays

</h2>

<p
className="
text-sm
text-slate-500
dark:text-slate-400
"
>

Next Holidays

</p>

</div>

</div>

<span
className="
bg-violet-50
text-violet-600
px-3
py-2
rounded-full
text-xs
font-semibold
"
>

{holidays.length} Holidays

</span>

</div>

<div
className="
space-y-5
max-h-[380px]
overflow-y-auto
pr-2
"
>

{

holidays.length===0

?

(

<div
className="
text-center
py-10
text-slate-400
"
>

No Upcoming Holidays

</div>

)

:

holidays.map(

(holiday,index)=>(

<div

key={index}

className="
flex
items-start
gap-4
pb-4
border-b
border-slate-100
dark:border-slate-700
last:border-0
hover:bg-slate-50
dark:hover:bg-slate-700/50
rounded-xl
px-2
transition
"
>

<div
className="
w-14
h-14
rounded-2xl
bg-gradient-to-r
from-violet-500
to-indigo-600
text-white
flex
flex-col
justify-center
items-center
shadow
"
>

<p
className="
text-lg
font-bold
leading-none
"
>

{

new Date(
holiday.holidayDate
)

.getDate()

}

</p>

<p
className="
text-xs
uppercase
"
>

{

new Date(holiday.holidayDate || holiday.date)

.toLocaleString(

"default",

{

month:"short"

}

)

}

</p>

</div>

<div
className="
flex-1
"
>

<h3
className="
font-semibold
text-slate-800
dark:text-white
"
>

{

holiday.holidayName || holiday.name || "Holiday"

}

</h3>

<div
className="
flex
items-center
gap-2
mt-2
text-sm
text-slate-500
dark:text-slate-400
"
>

<Globe2
size={15}
/>

{

holiday.isGlobal

?

"Global Holiday"

:

holiday.countryName

}

</div>

<div
className="
flex
items-center
gap-2
mt-2
text-xs
text-violet-600
font-medium
"
>

<Clock3
size={14}
/>

{

getDaysLeft(
holiday.holidayDate
)

}

</div>

</div>

</div>

)

)

}

</div>

<div
className="
mt-6
rounded-xl
bg-violet-50
dark:bg-violet-900/30
text-violet-600
dark:text-violet-300
py-3
text-center
font-medium
"
>

Holiday Calendar Reminder

</div>

</div>

  );

}