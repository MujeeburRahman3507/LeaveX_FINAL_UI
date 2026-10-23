import {
  useEffect,
  useState
} from "react";

import employeeService from "../services/leaveService";

export default function HolidayWidget({
  managerMode = false
}) {

  const [holidays, setHolidays] = useState([]);

  const [showAll, setShowAll] = useState(false);

useEffect(() => {
  loadHolidays();
}, [managerMode]);

  const loadHolidays = async () => {

    try {

 const response = managerMode
  ? await employeeService.getManagerUpcomingHolidays()
  : await employeeService.getUpcomingHolidays();

      setHolidays(
        response.data.data || []
      );

    } catch (error) {

      console.error(error);

    }

  };

  // Only 2 holidays on dashboard
  const displayedHolidays =
    holidays.slice(0, 2);

  return (

    <>
      {/* =====================================================
          UPCOMING HOLIDAYS WIDGET
          ===================================================== */}

      <div
        className="
          bg-white
          dark:bg-slate-800
          border
          border-slate-200
          dark:border-slate-700
          rounded-3xl
          shadow-sm
          p-6
          transition-colors
          duration-300
        "
      >

        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between
            mb-5
          "
        >

          <h3
            className="
              text-xl
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            Upcoming Holidays
          </h3>

          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="
              text-sm
              font-semibold
              text-violet-600
              hover:text-violet-800
              dark:text-violet-400
              dark:hover:text-violet-300
              transition
            "
          >
            View All
          </button>

        </div>


        {/* No holidays */}
        {holidays.length === 0 ? (

          <p
            className="
              text-slate-500
              dark:text-slate-400
              text-center
              py-6
            "
          >
            No Upcoming Holidays
          </p>

        ) : (

          <div>

            {displayedHolidays.map(
              (holiday) => (

                <div
                  key={holiday.id}
                  className="
                    border-b
                    border-slate-200
                    dark:border-slate-700
                    py-3
                    last:border-b-0
                    hover:bg-slate-50
                    dark:hover:bg-slate-700/40
                    rounded-xl
                    transition
                    px-2
                  "
                >

                  {/* Holiday Name */}
                  <div
                    className="
                      font-semibold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {holiday.holidayName}
                  </div>

                  {/* Holiday Date */}
                  <div
                    className="
                      text-sm
                      text-slate-500
                      dark:text-slate-400
                      mt-1
                    "
                  >
                    {holiday.holidayDate}
                  </div>

                  {/* Country / Global */}
                  <div
                    className="
                      inline-block
                      mt-2
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-medium
                      bg-violet-100
                      text-violet-700
                      dark:bg-violet-900/40
                      dark:text-violet-300
                    "
                  >
                    {
                      holiday.isGlobal
                        ? "Global Holiday"
                        : holiday.countryName
                    }
                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* =====================================================
          VIEW ALL HOLIDAYS MODAL
          ===================================================== */}

      {showAll && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            backdrop-blur-sm
            p-4
          "
          onClick={() => setShowAll(false)}
        >

          {/* Modal */}
          <div
            className="
              bg-white
              dark:bg-slate-800
              w-full
              max-w-2xl
              max-h-[80vh]
              rounded-2xl
              shadow-2xl
              overflow-hidden
            "
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div
              className="
                flex
                items-center
                justify-between
                px-6
                py-4
                border-b
                border-slate-200
                dark:border-slate-700
              "
            >

              <div>

                <h2
                  className="
                    text-xl
                    font-bold
                    text-slate-900
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
                    mt-1
                  "
                >
                  Complete upcoming holiday list
                </p>

              </div>


              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowAll(false)}
                className="
                  w-9
                  h-9
                  flex
                  items-center
                  justify-center
                  rounded-full
                  text-slate-500
                  hover:bg-slate-100
                  dark:hover:bg-slate-700
                  dark:text-slate-400
                  text-xl
                  transition
                "
              >
                ×
              </button>

            </div>


            {/* Holiday List */}
            <div
              className="
                overflow-y-auto
                max-h-[65vh]
                p-6
              "
            >

              {holidays.length === 0 ? (

                <p
                  className="
                    text-center
                    text-slate-500
                    dark:text-slate-400
                    py-8
                  "
                >
                  No Upcoming Holidays
                </p>

              ) : (

                <div className="space-y-2">

                  {holidays.map(
                    (holiday) => (

                      <div
                        key={holiday.id}
                        className="
                          border
                          border-slate-200
                          dark:border-slate-700
                          rounded-xl
                          p-4
                          hover:bg-slate-50
                          dark:hover:bg-slate-700/40
                          transition
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            gap-4
                          "
                        >

                          <div>

                            <div
                              className="
                                font-semibold
                                text-slate-900
                                dark:text-white
                              "
                            >
                              {holiday.holidayName}
                            </div>

                            {holiday.description && (

                              <div
                                className="
                                  text-sm
                                  text-slate-500
                                  dark:text-slate-400
                                  mt-1
                                "
                              >
                                {holiday.description}
                              </div>

                            )}

                          </div>


                          <div
                            className="
                              text-right
                              shrink-0
                            "
                          >

                            <div
                              className="
                                text-sm
                                font-medium
                                text-slate-700
                                dark:text-slate-300
                              "
                            >
                              {holiday.holidayDate}
                            </div>

                            <div
                              className="
                                inline-block
                                mt-2
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-medium
                                bg-violet-100
                                text-violet-700
                                dark:bg-violet-900/40
                                dark:text-violet-300
                              "
                            >
                              {
                                holiday.isGlobal
                                  ? "Global Holiday"
                                  : holiday.countryName
                              }
                            </div>

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>


            {/* Modal Footer */}
            <div
              className="
                flex
                justify-end
                px-6
                py-4
                border-t
                border-slate-200
                dark:border-slate-700
              "
            >

              <button
                type="button"
                onClick={() => setShowAll(false)}
                className="
                  px-5
                  py-2
                  rounded-lg
                  bg-violet-600
                  hover:bg-violet-700
                  text-white
                  font-medium
                  transition
                "
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </>

  );
}