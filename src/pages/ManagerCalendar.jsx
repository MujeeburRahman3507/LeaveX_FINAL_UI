import { useEffect, useMemo, useState } from "react";

import leaveService from "../services/leaveService";

import {
  Calendar as CalendarIcon,
  RefreshCw,
  Users,
  Palmtree,
  Gift,
  Search,
  X,
  Filter
} from "lucide-react";

import {
  Calendar,
  dateFnsLocalizer
} from "react-big-calendar";

import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import isToday from "date-fns/isToday";
import isAfter from "date-fns/isAfter";

import "react-big-calendar/lib/css/react-big-calendar.css";


const locales = {};

const localizer =
  dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
  });


export default function ManagerCalendar() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 640
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);


  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [eventFilter, setEventFilter] =
    useState("ALL");

  const [leaveTypeFilter, setLeaveTypeFilter] =
    useState("ALL");

  const [selectedEvent, setSelectedEvent] =
    useState(null);


  /*
   * =====================================================
   * LOAD CALENDAR
   * =====================================================
   */

  const loadEvents =
    async () => {

      try {

        setLoading(true);

        const response =
          await leaveService
            .getCalendarEvents();

        const data =
          response.data || [];

        const formattedEvents =
          data.map(event => ({

            ...event,

            start:
              new Date(
                event.start
              ),

            end:
              new Date(
                event.end
              )

          }));

        setEvents(
          formattedEvents
        );

      } catch (error) {

        console.error(
          "Failed to load team calendar:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


  useEffect(() => {

    loadEvents();

  }, []);


  /*
   * =====================================================
   * FILTER EVENTS
   * =====================================================
   */

  const filteredEvents =
    useMemo(() => {

      return events.filter(event => {

        /*
         * Event type
         */

        if (
          eventFilter !== "ALL"
          &&
          eventFilter !== event.type
        ) {

          return false;

        }


        /*
         * Leave type
         */

        if (
          leaveTypeFilter !== "ALL"
          &&
          event.leaveType
          &&
          event.leaveType !==
            leaveTypeFilter
        ) {

          return false;

        }


        /*
         * Employee search
         */

        if (
          search.trim()
        ) {

          const searchText =
            search
              .trim()
              .toLowerCase();

          const title =
            (
              event.title || ""
            ).toLowerCase();

          const employeeName =
            (
              event.employeeName || ""
            ).toLowerCase();

          if (
            !title.includes(searchText)
            &&
            !employeeName.includes(
              searchText
            )
          ) {

            return false;

          }

        }


        return true;

      });

    }, [
      events,
      eventFilter,
      leaveTypeFilter,
      search
    ]);


  /*
   * =====================================================
   * SUMMARY DATA
   * =====================================================
   */

  const today =
    new Date();


  const leaveEvents =
    events.filter(
      event =>
        event.type !==
        "HOLIDAY"
    );


  const holidayEvents =
    events.filter(
      event =>
        event.type ===
        "HOLIDAY"
    );


  const todayLeaveCount =
    leaveEvents.filter(
      event =>
        event.start
        &&
        event.end
        &&
        today >= event.start
        &&
        today <= event.end
    ).length;


  const upcomingLeaveCount =
    leaveEvents.filter(
      event =>
        event.start
        &&
        isAfter(
          event.start,
          today
        )
    ).length;


  /*
   * =====================================================
   * EVENT STYLE
   * =====================================================
   */

  const eventPropGetter =
    (event) => {

      if (
        event.type ===
        "HOLIDAY"
      ) {

        return {

          style: {

            backgroundColor:
              "#ef4444",

            borderRadius:
              "8px",

            border:
              "none",

            color:
              "white",

            padding:
              "3px 6px"

          }

        };

      }


      return {

        style: {

          backgroundColor:
            "#7c3aed",

          borderRadius:
            "8px",

          border:
            "none",

          color:
            "white",

          padding:
            "3px 6px"

        }

      };

    };


  /*
   * =====================================================
   * CLEAR FILTERS
   * =====================================================
   */

  const clearFilters =
    () => {

      setSearch("");

      setEventFilter(
        "ALL"
      );

      setLeaveTypeFilter(
        "ALL"
      );

    };


  /*
   * =====================================================
   * EVENT CLICK
   * =====================================================
   */

  const handleEventClick =
    (event) => {

      setSelectedEvent(
        event
      );

    };


  /*
   * =====================================================
   * UI
   * =====================================================
   */

  return (

    <div
      className="
        min-h-screen
        bg-slate-50
        dark:bg-slate-900
        p-6
      "
    >

      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-4
          mb-6
        "
      >

        <div>

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                w-12
                h-12
                rounded-2xl
                bg-gradient-to-r
                from-violet-500
                to-indigo-600
                flex
                items-center
                justify-center
                shadow-lg
              "
            >

              <CalendarIcon
                size={25}
                className="text-white"
              />

            </div>

            <div>

              <h1
                className="
                  text-xl sm:text-3xl
                  font-bold
                  text-slate-800
                  dark:text-white
                "
              >
                Team Calendar
              </h1>

              <p
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                  mt-1
                "
              >
                View your team's leave schedule and holidays.
              </p>

            </div>

          </div>

        </div>


        <button
          onClick={loadEvents}
          disabled={loading}
          className="
            flex
            items-center
            justify-center
            gap-2
            bg-violet-600
            hover:bg-violet-700
            disabled:opacity-60
            text-white
            px-4 sm:px-5
            py-2 sm:py-3
            rounded-xl
            shadow
            transition w-full sm:w-auto
          "
        >

          <RefreshCw
            size={18}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh

        </button>

      </div>


      {/* ================================================= */}
      {/* SUMMARY CARDS */}
      {/* ================================================= */}

      <div
        className="
          grid
          grid-cols-2
          xl:grid-cols-4
          gap-3 sm:gap-5
          mb-4 sm:mb-6 keep-grid
        "
      >

        {/* TODAY */}

        <div
          className="
            bg-white
            dark:bg-slate-800
            border
            border-slate-200
            dark:border-slate-700
            rounded-2xl
            p-3 sm:p-5
            shadow-sm
          "
        >

          <div
            className="
              flex
              justify-between
              items-start
            "
          >

            <div>

              <p
                className="
                  text-xs sm:text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                On Leave Today
              </p>

              <h2
                className="
                  text-2xl sm:text-3xl
                  font-bold
                  text-slate-800
                  dark:text-white
                  mt-2
                "
              >
                {todayLeaveCount}
              </h2>

            </div>

            <div
              className="
                metric-icon-sm w-8 h-8 sm:w-11 sm:h-11
                rounded-xl
                bg-violet-100
                dark:bg-violet-900/30
                flex
                items-center
                justify-center
              "
            >

              <Users
                size={21}
                className="
                  text-violet-600
                  dark:text-violet-400
                "
              />

            </div>

          </div>

        </div>


        {/* UPCOMING */}

        <div
          className="
            bg-white
            dark:bg-slate-800
            border
            border-slate-200
            dark:border-slate-700
            rounded-2xl
            p-3 sm:p-5
            shadow-sm
          "
        >

          <div
            className="
              flex
              justify-between
              items-start
            "
          >

            <div>

              <p
                className="
                  text-xs sm:text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Upcoming Leaves
              </p>

              <h2
                className="
                  text-2xl sm:text-3xl
                  font-bold
                  text-slate-800
                  dark:text-white
                  mt-2
                "
              >
                {upcomingLeaveCount}
              </h2>

            </div>

            <div
              className="
                metric-icon-sm w-8 h-8 sm:w-11 sm:h-11
                rounded-xl
                bg-emerald-100
                dark:bg-emerald-900/30
                flex
                items-center
                justify-center
              "
            >

              <Palmtree
                size={21}
                className="
                  text-emerald-600
                  dark:text-emerald-400
                "
              />

            </div>

          </div>

        </div>


        {/* TOTAL LEAVE */}

        <div
          className="
            bg-white
            dark:bg-slate-800
            border
            border-slate-200
            dark:border-slate-700
            rounded-2xl
            p-3 sm:p-5
            shadow-sm
          "
        >

          <div
            className="
              flex
              justify-between
              items-start
            "
          >

            <div>

              <p
                className="
                  text-xs sm:text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Total Leave Events
              </p>

              <h2
                className="
                  text-2xl sm:text-3xl
                  font-bold
                  text-slate-800
                  dark:text-white
                  mt-2
                "
              >
                {leaveEvents.length}
              </h2>

            </div>

            <div
              className="
                metric-icon-sm w-8 h-8 sm:w-11 sm:h-11
                rounded-xl
                bg-blue-100
                dark:bg-blue-900/30
                flex
                items-center
                justify-center
              "
            >

              <CalendarIcon
                size={21}
                className="
                  text-blue-600
                  dark:text-blue-400
                "
              />

            </div>

          </div>

        </div>


        {/* HOLIDAYS */}

        <div
          className="
            bg-white
            dark:bg-slate-800
            border
            border-slate-200
            dark:border-slate-700
            rounded-2xl
            p-3 sm:p-5
            shadow-sm
          "
        >

          <div
            className="
              flex
              justify-between
              items-start
            "
          >

            <div>

              <p
                className="
                  text-xs sm:text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Holidays
              </p>

              <h2
                className="
                  text-2xl sm:text-3xl
                  font-bold
                  text-slate-800
                  dark:text-white
                  mt-2
                "
              >
                {holidayEvents.length}
              </h2>

            </div>

            <div
              className="
                metric-icon-sm w-8 h-8 sm:w-11 sm:h-11
                rounded-xl
                bg-red-100
                dark:bg-red-900/30
                flex
                items-center
                justify-center
              "
            >

              <Gift
                size={21}
                className="
                  text-red-600
                  dark:text-red-400
                "
              />

            </div>

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* FILTER BAR */}
      {/* ================================================= */}

      <div
        className="
          bg-white
          dark:bg-slate-800
          border
          border-slate-200
          dark:border-slate-700
          rounded-2xl
          p-4
          mb-6
          shadow-sm
        "
      >

        <div
          className="
            flex
            flex-col
            lg:flex-row
            gap-3
            lg:items-center
          "
        >

          {/* SEARCH */}

          <div
            className="
              relative
              flex-1
            "
          >

            <Search
              size={18}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={
                e =>
                  setSearch(
                    e.target.value
                  )
              }
              placeholder="Search employee..."
              className="
                w-full
                pl-10
                pr-4
                py-3
                rounded-xl
                border
                border-slate-200
                dark:border-slate-600
                bg-white
                dark:bg-slate-900
                text-slate-800
                dark:text-white
                outline-none
                focus:ring-2
                focus:ring-violet-500
              "
            />

          </div>


          {/* EVENT FILTER */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <Filter
              size={18}
              className="
                text-slate-400
              "
            />

            <select
              value={eventFilter}
              onChange={
                e =>
                  setEventFilter(
                    e.target.value
                  )
              }
              className="
                px-4
                py-3
                rounded-xl
                border
                border-slate-200
                dark:border-slate-600
                bg-white
                dark:bg-slate-900
                text-slate-700
                dark:text-white
              "
            >

              <option value="ALL">
                All Events
              </option>

              <option value="LEAVE">
                Leave
              </option>

              <option value="HOLIDAY">
                Holidays
              </option>

            </select>

          </div>


          {/* LEAVE TYPE */}

          <select
            value={leaveTypeFilter}
            onChange={
              e =>
                setLeaveTypeFilter(
                  e.target.value
                )
            }
            className="
              px-4
              py-3
              rounded-xl
              border
              border-slate-200
              dark:border-slate-600
              bg-white
              dark:bg-slate-900
              text-slate-700
              dark:text-white
            "
          >

            <option value="ALL">
              All Leave Types
            </option>

            <option value="CASUAL">
              Casual
            </option>

            <option value="MEDICAL">
              Medical
            </option>

            <option value="EARNED">
              Earned
            </option>

          </select>


          {/* CLEAR */}

          <button
            onClick={clearFilters}
            className="
              flex
              items-center
              justify-center
              gap-2
              px-4
              py-3
              rounded-xl
              border
              border-slate-200
              dark:border-slate-600
              text-slate-600
              dark:text-slate-300
              hover:bg-slate-50
              dark:hover:bg-slate-700
              transition
            "
          >

            <X size={17} />

            Clear

          </button>

        </div>

      </div>


      {/* ================================================= */}
      {/* CALENDAR */}
      {/* ================================================= */}

      <div
        className="
          bg-white
          dark:bg-slate-800
          rounded-2xl
          shadow-sm
          border
          border-slate-200
          dark:border-slate-700
          p-2 sm:p-5
        "
      >

        <Calendar
          localizer={localizer}

          events={filteredEvents}

          startAccessor="start"

          endAccessor="end"

          titleAccessor="title"

          style={{ height: isMobile ? 560 : 700 }}

          popup={true}

          selectable={false}

          eventPropGetter={
            eventPropGetter
          }

          onSelectEvent={
            handleEventClick
          }

          views={isMobile ? ["month", "day", "agenda"] : ["month", "week", "day", "agenda"]}

          defaultView="month"

        />

      </div>


      {/* ================================================= */}
      {/* EVENT DETAILS */}
      {/* ================================================= */}

      {selectedEvent && (

        <div
          className="
            fixed
            inset-0
            bg-black/30
            backdrop-blur-sm
            flex
            items-center
            justify-center
            z-[100]
            p-4
          "
          onClick={() =>
            setSelectedEvent(null)
          }
        >

          <div
            className="
              bg-white
              dark:bg-slate-800
              rounded-2xl
              shadow-2xl
              w-full
              max-w-md
              p-6
            "
            onClick={
              e =>
                e.stopPropagation()
            }
          >

            <div
              className="
                flex
                justify-between
                items-center
                mb-5
              "
            >

              <h2
                className="
                  text-xl
                  font-bold
                  text-slate-800
                  dark:text-white
                "
              >
                Event Details
              </h2>

              <button
                onClick={() =>
                  setSelectedEvent(
                    null
                  )
                }
                className="
                  text-slate-400
                  hover:text-red-500
                "
              >

                <X size={20} />

              </button>

            </div>


            <div
              className="
                space-y-4
              "
            >

              <div>

                <p
                  className="
                    text-xs
                    text-slate-400
                  "
                >
                  Employee
                </p>

                <p
                  className="
                    font-semibold
                    text-slate-800
                    dark:text-white
                  "
                >
                  {
                    selectedEvent.employeeName
                    ||
                    selectedEvent.title
                  }
                </p>

              </div>


              <div
                className="
                  grid
                  grid-cols-2
                  gap-4
                "
              >

                <div>

                  <p
                    className="
                      text-xs
                      text-slate-400
                    "
                  >
                    Start Date
                  </p>

                  <p
                    className="
                      font-medium
                      text-slate-700
                      dark:text-slate-200
                    "
                  >
                    {format(
                      selectedEvent.start,
                      "dd MMM yyyy"
                    )}
                  </p>

                </div>


                <div>

                  <p
                    className="
                      text-xs
                      text-slate-400
                    "
                  >
                    End Date
                  </p>

                  <p
                    className="
                      font-medium
                      text-slate-700
                      dark:text-slate-200
                    "
                  >
                    {format(
                      selectedEvent.end,
                      "dd MMM yyyy"
                    )}
                  </p>

                </div>

              </div>


              {selectedEvent.leaveType && (

                <div>

                  <p
                    className="
                      text-xs
                      text-slate-400
                    "
                  >
                    Leave Type
                  </p>

                  <span
                    className="
                      inline-block
                      mt-1
                      px-3
                      py-1
                      rounded-full
                      bg-violet-100
                      text-violet-700
                      text-sm
                      font-medium
                    "
                  >
                    {
                      selectedEvent.leaveType
                    }
                  </span>

                </div>

              )}


              {selectedEvent.reason && (

                <div>

                  <p
                    className="
                      text-xs
                      text-slate-400
                    "
                  >
                    Reason
                  </p>

                  <p
                    className="
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    {
                      selectedEvent.reason
                    }
                  </p>

                </div>

              )}


              {selectedEvent.status && (

                <div>

                  <p
                    className="
                      text-xs
                      text-slate-400
                    "
                  >
                    Status
                  </p>

                  <p
                    className="
                      font-medium
                      text-slate-700
                      dark:text-slate-200
                    "
                  >
                    {
                      selectedEvent.status
                    }
                  </p>

                </div>

              )}

            </div>


            <button
              onClick={() =>
                setSelectedEvent(
                  null
                )
              }
              className="
                mt-6
                w-full
                bg-violet-600
                hover:bg-violet-700
                text-white
                py-3
                rounded-xl
                font-medium
              "
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>

  );

}