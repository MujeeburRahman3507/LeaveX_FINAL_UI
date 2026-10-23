import {
  useEffect,
  useState
} from "react";

import leaveService from "../services/leaveService";

export default function EmployeeOnLeaveCard() {

  const [employees,
    setEmployees] =
    useState([]);

  useEffect(() => {

    loadEmployees();

  }, []);

  const loadEmployees =
    async () => {

      const response =
        await leaveService
          .getEmployeesOnLeaveToday();

      setEmployees(
        response.data || []
      );
    };

  return (

    <div
  className="
bg-white
dark:bg-slate-800
rounded-xl
shadow
p-6
border
border-slate-200
dark:border-slate-700
"
    >

 <h3
className="
text-lg
font-bold
mb-4
text-slate-800
dark:text-white
"
>
        Employees On Leave Today
      </h3>

      {

        employees.length === 0

        ?

        (

          <p>
            No Employees On Leave
          </p>

        )

        :

        employees.map(emp => (

          <div
            key={emp.id}
            className="
            flex
            justify-between
            py-2
        border-b
border-slate-200
dark:border-slate-700
            "
          >

            <span>
              {emp.employeeName}
            </span>

            <span
              className="
              text-violet-600
              text-sm
              "
            >
              {emp.leaveType}
            </span>

          </div>

        ))
      }

    </div>
  );
}