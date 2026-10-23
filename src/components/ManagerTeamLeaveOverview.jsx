import { useEffect, useState } from "react";

import {
  Clock,
  Users,
  CalendarDays,
  ArrowRight,
  RefreshCw
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import leaveService from "../services/leaveService";

export default function ManagerTeamLeaveOverview() {

  const navigate = useNavigate();

  const [pendingCount, setPendingCount] =
    useState(0);

  const [onLeaveToday, setOnLeaveToday] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  /* ===================================================== */
  /* EXTRACT ARRAY SAFELY */
  /* ===================================================== */

  const extractArray = (response) => {

    /*
     * Case 1:
     * Axios response containing ApiResponse
     *
     * response.data.data
     */

    if (
      response?.data &&
      Array.isArray(response.data.data)
    ) {

      return response.data.data;

    }


    /*
     * Case 2:
     * Axios response containing direct List
     *
     * response.data
     */

    if (
      response?.data &&
      Array.isArray(response.data)
    ) {

      return response.data;

    }


    /*
     * Case 3:
     * Service already returned the List
     */

    if (
      Array.isArray(response)
    ) {

      return response;

    }


    /*
     * Case 4:
     * Direct object containing data
     */

    if (
      response?.data?.data &&
      Array.isArray(response.data.data)
    ) {

      return response.data.data;

    }


    return [];

  };


  /* ===================================================== */
  /* LOAD TEAM OVERVIEW */
  /* ===================================================== */

  const loadOverview = async () => {

    try {

      setLoading(true);


      /*
       * Load both APIs
       */

      const [
        pendingResponse,
        todayResponse
      ] = await Promise.all([

       leaveService.
       getPendingRequests(),

        leaveService
          .getEmployeesOnLeaveToday()

      ]);


      console.log(
        "Manager Pending Response:",
        pendingResponse
      );

      console.log(
        "Employees On Leave Response:",
        todayResponse
      );


      /* ================================================= */
      /* PENDING REQUESTS */
      /* ================================================= */

      const pendingRequests =
        extractArray(
          pendingResponse
        );

      setPendingCount(
        pendingRequests.length
      );


      /* ================================================= */
      /* EMPLOYEES ON LEAVE TODAY */
      /* ================================================= */

      const todayEmployees =
        extractArray(
          todayResponse
        );

      setOnLeaveToday(
        todayEmployees
      );


    } catch (error) {

      console.error(
        "Unable to load Team Leave Overview:",
        error
      );

      setPendingCount(0);

      setOnLeaveToday([]);

    } finally {

      setLoading(false);

    }

  };


  /* ===================================================== */
  /* INITIAL LOAD */
  /* ===================================================== */

  useEffect(() => {

    loadOverview();

  }, []);


  return (

    <div
      className="
        bg-white
        dark:bg-slate-800
        rounded-xl
        shadow
        border
        border-slate-200
        dark:border-slate-700
        p-6
        h-full
      "
    >

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div
        className="
          flex
          items-center
          justify-between
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
              w-11
              h-11
              rounded-xl
              bg-violet-100
              dark:bg-violet-900/30
              flex
              items-center
              justify-center
            "
          >

            <CalendarDays
              size={22}
              className="
                text-violet-600
                dark:text-violet-400
              "
            />

          </div>


          <div>

            <h2
              className="
                text-lg
                font-semibold
                text-slate-800
                dark:text-white
              "
            >
              Team Leave Overview
            </h2>

            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Quick team availability
            </p>

          </div>

        </div>


        {/* Refresh */}

        <button
          onClick={loadOverview}
          disabled={loading}
          className="
            p-2
            rounded-lg
            hover:bg-slate-100
            dark:hover:bg-slate-700
            text-slate-500
            transition
          "
          title="Refresh"
        >

          <RefreshCw
            size={17}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

        </button>

      </div>


      {/* ================================================= */}
      {/* STATISTICS */}
      {/* ================================================= */}

      <div
        className="
          grid
          grid-cols-2
          gap-4
          mb-6
        "
      >

        {/* Pending */}

        <div
          className="
            rounded-xl
            bg-orange-50
            dark:bg-orange-900/20
            border
            border-orange-100
            dark:border-orange-800
            p-4
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              mb-2
            "
          >

            <span
              className="
                text-sm
                text-orange-700
                dark:text-orange-300
                font-medium
              "
            >
              Pending
            </span>

            <Clock
              size={18}
              className="
                text-orange-500
              "
            />

          </div>


          <p
            className="
              text-2xl
              font-bold
              text-slate-800
              dark:text-white
            "
          >

            {loading
              ? "..."
              : pendingCount}

          </p>


          <p
            className="
              text-xs
              text-slate-500
              dark:text-slate-400
              mt-1
            "
          >
            Approval requests
          </p>

        </div>


        {/* On Leave Today */}

        <div
          className="
            rounded-xl
            bg-blue-50
            dark:bg-blue-900/20
            border
            border-blue-100
            dark:border-blue-800
            p-4
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              mb-2
            "
          >

            <span
              className="
                text-sm
                text-blue-700
                dark:text-blue-300
                font-medium
              "
            >
              On Leave Today
            </span>

            <Users
              size={18}
              className="
                text-blue-500
              "
            />

          </div>


          <p
            className="
              text-2xl
              font-bold
              text-slate-800
              dark:text-white
            "
          >

            {loading
              ? "..."
              : onLeaveToday.length}

          </p>


          <p
            className="
              text-xs
              text-slate-500
              dark:text-slate-400
              mt-1
            "
          >
            Team members
          </p>

        </div>

      </div>


      {/* ================================================= */}
      {/* TODAY'S AVAILABILITY */}
      {/* ================================================= */}

      <div>

        <div
          className="
            flex
            items-center
            justify-between
            mb-3
          "
        >

          <h3
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            Today's Availability
          </h3>


          <span
            className="
              text-xs
              text-slate-400
            "
          >
            {loading
              ? "..."
              : `${onLeaveToday.length} away`}
          </span>

        </div>


        {/* Loading */}

        {loading && (

          <div
            className="
              py-6
              text-center
              text-sm
              text-slate-400
            "
          >

            Loading team availability...

          </div>

        )}


        {/* Nobody on leave */}

        {!loading &&
          onLeaveToday.length === 0 && (

          <div
            className="
              rounded-xl
              border
              border-dashed
              border-slate-300
              dark:border-slate-600
              p-5
              text-center
            "
          >

            <Users
              size={22}
              className="
                mx-auto
                mb-2
                text-emerald-500
              "
            />

            <p
              className="
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-200
              "
            >
              Everyone is available
            </p>

            <p
              className="
                text-xs
                text-slate-400
                mt-1
              "
            >
              No team members are on leave today.
            </p>

          </div>

        )}


        {/* Employees */}

        {!loading &&
          onLeaveToday.length > 0 && (

          <div
            className="
              space-y-2
              max-h-32
              overflow-y-auto
              pr-1
            "
          >

            {onLeaveToday
              .slice(0, 4)
              .map((employee, index) => {

                const employeeName =
                  employee?.employeeName ??
                  employee?.fullName ??
                  employee?.name ??
                  "Employee";


                const leaveType =
                  employee?.leaveType ??
                  employee?.type ??
                  "LEAVE";


                return (

                  <div
                    key={
                      employee?.id ??
                      employee?.employeeId ??
                      index
                    }
                    className="
                      flex
                      items-center
                      justify-between
                      rounded-lg
                      bg-slate-50
                      dark:bg-slate-700/50
                      px-3
                      py-2
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        min-w-0
                      "
                    >

                      <div
                        className="
                          w-8
                          h-8
                          rounded-full
                          bg-violet-100
                          dark:bg-violet-900/40
                          flex
                          items-center
                          justify-center
                          text-xs
                          font-semibold
                          text-violet-600
                          dark:text-violet-300
                          shrink-0
                        "
                      >

                        {employeeName
                          .charAt(0)
                          .toUpperCase()}

                      </div>


                      <div
                        className="
                          min-w-0
                        "
                      >

                        <p
                          className="
                            text-sm
                            text-slate-700
                            dark:text-slate-200
                            truncate
                          "
                        >
                          {employeeName}
                        </p>

                        <p
                          className="
                            text-[10px]
                            text-slate-400
                            uppercase
                          "
                        >
                          {leaveType}
                        </p>

                      </div>

                    </div>


                    <span
                      className="
                        text-[10px]
                        px-2
                        py-1
                        rounded-full
                        bg-blue-100
                        dark:bg-blue-900/40
                        text-blue-600
                        dark:text-blue-300
                        shrink-0
                      "
                    >
                      On Leave
                    </span>

                  </div>

                );

              })}

          </div>

        )}

      </div>


      {/* ================================================= */}
      {/* VIEW TEAM CALENDAR */}
      {/* ================================================= */}

      <button
        onClick={() =>
          navigate("/manager/calendar")
        }
        className="
          w-full
          mt-5
          flex
          items-center
          justify-center
          gap-2
          bg-violet-50
          dark:bg-violet-900/20
          hover:bg-violet-100
          dark:hover:bg-violet-900/40
          text-violet-600
          dark:text-violet-300
          font-medium
          text-sm
          py-3
          rounded-xl
          transition
        "
      >

        View Team Calendar

        <ArrowRight size={16} />

      </button>

    </div>

  );

}