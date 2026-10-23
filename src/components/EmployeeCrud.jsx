import { useEffect, useState } from "react";
import DataGrid from "./DataGrid";
import adminService from "../services/adminService";
import countryService
from "../services/countryService";
import leavePolicyService
from "../services/leavePolicyService";
import { useTheme } from "../context/ThemeContext";

export default function EmployeeCrud() {

  const { theme } = useTheme();
const isDark = theme === "dark";

const fieldClass = `w-full border p-3 rounded-lg ${
  isDark
    ? "bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-400"
    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
}`;

const selectClass = `w-full border p-3 rounded-lg ${
  isDark
    ? "bg-slate-800 border-slate-600 text-slate-100"
    : "bg-white border-slate-300 text-slate-900"
}`;

const labelClass = `block mb-1 text-sm font-medium ${
  isDark ? "text-slate-300" : "text-gray-700"
}`;

  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [admins, setAdmins] = useState([]);

  const [showForm, setShowForm] =
    useState(false);

  const [editingId,
    setEditingId] =
    useState(null);

    const [countries,
setCountries] =
useState([]);

const [policies,
  setPolicies] =
  useState([]);

const loadCountries =
async () => {

  try {

    const response =
      await countryService
        .getCountries();

    setCountries(
      response.data
    );

  } catch(error) {

    console.error(error);

  }
};

  const [form,
    setForm] =
    useState({
      employeeCode: "",
      fullName: "",
      email: "",
      password: "",
      role: "EMPLOYEE",
      managerId: "",
      active: true,
      department: "",
      leavePolicyId: "",
      countryIds: [],
          dateOfBirth: "",
           approvalLevels: 1,
  level1ApproverId: "",
  level2ApproverId: "",
    });

useEffect(() => {

  loadEmployees();
  
    leavePolicyService
    .getPolicies()
    .then(response => {

      setPolicies(
        response.data
      );

          });
  loadManagers();
  loadAdmins();
  loadCountries();

}, []);

  const loadEmployees =
    async () => {

      const response =
        await adminService
          .getEmployees();

      setEmployees(
        response.data.data
      );
    };

const loadManagers = async () => {
  try {
    const response =
      await adminService.getManagers();

    console.log("Managers API Response:", response);
    console.log("Managers Data:", response.data);

  setManagers(response.data);

  } catch(err) {
    console.error(err);
  }
};

const loadAdmins =
  async () => {

    const response =
      await adminService.getAdmins();

    setAdmins(response.data);
};

  const handleChange =
    (e) => {

      const {
        name,
        value
      } = e.target;

      setForm({
        ...form,
        [name]: value
      });
    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        if (editingId) {

          await adminService
            .updateEmployee(
              editingId,
              form
            );

        } else {

          await adminService
            .createEmployee(
              form
            );
        }

        resetForm();

        setShowForm(false);

        loadEmployees();

      } catch (err) {

        console.error(err);

      }
    };

    const approvers = [...managers, ...admins].filter(
  (person, index, self) =>
    self.findIndex((item) => item.id === person.id) === index
);

  const editEmployee =
    (emp) => {
      document.querySelector(".page-scroll")?.scrollTo({ top: 0, behavior: "smooth" });


      setEditingId(emp.id);

      setShowForm(true);

      setForm({

        employeeCode:
          emp.employeeCode || "",

        fullName:
          emp.fullName || "",

        email:
          emp.email || "",

        password: "",

        role:
          emp.role || "EMPLOYEE",

        managerId:
          emp.managerId || "",

          department:
  emp.department || "",

  countryIds:
  emp.countryIds || [],

  leavePolicyId:
  emp.leavePolicyId || "",

        active:
          emp.active,

          dateOfBirth:
  emp.dateOfBirth || "",

  approvalLevels: emp.approvalLevels ?? 1,
level1ApproverId: emp.level1ApproverId
  ? String(emp.level1ApproverId)
  : "",
level2ApproverId: emp.level2ApproverId
  ? String(emp.level2ApproverId)
  : "",
      });
    };

  const deleteEmployee =
    async (id) => {

      if (
        !window.confirm(
          "Delete Employee?"
        )
      ) {
        return;
      }

      await adminService
        .deleteEmployee(id);

      loadEmployees();
    };

  const resetForm =
    () => {

      setEditingId(null);

      setForm({

        employeeCode: "",
        fullName: "",
        email: "",
        password: "",
        role: "EMPLOYEE",
        managerId: "",
        countryIds: [],
        active: true,
    dateOfBirth: "",
    approvalLevels: 1,
level1ApproverId: "",
level2ApproverId: "",

      });
    };

    

  return (

   <div
  className={`rounded-xl shadow p-3 sm:p-6 border ${
    isDark
      ? "bg-slate-800 border-slate-700 text-slate-100"
      : "bg-white border-slate-200 text-slate-900"
  }`}
>

      <div className="flex justify-between items-center gap-3 flex-wrap mb-4">

        <h2 className="text-xl font-bold">
          Employee Management
        </h2>

        <button
          onClick={() => {

            resetForm();

            setShowForm(
              !showForm
            );

          }}
          className="
          bg-violet-600
          text-white
          px-4
          py-2
          rounded-lg
          "
        >
          {showForm
            ? "Close"
            : "+ Create Employee"}
        </button>

      </div>

      {showForm && (

        <form
          onSubmit={handleSubmit}
className={`grid md:grid-cols-2 gap-4 mb-8 border p-4 rounded-lg ${
  isDark
    ? "bg-slate-900 border-slate-700"
    : "bg-slate-50 border-slate-200"
}`}
        >

          {!editingId && (

            <>
              <div>

                <label className={labelClass}>
                  Employee Code
                </label>

                <input
                  name="employeeCode"
                  value={form.employeeCode}
                  onChange={handleChange}
                className={fieldClass}
                  required
                />

              </div>

              <div>

                <label className={labelClass}>
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
               className={fieldClass}
                  required
                />

              </div>
            </>
          )}

          <div>

            <label className={labelClass}>
              Full Name
            </label>

            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
       className={fieldClass}
              required
            />

          </div>

          <div>

            <label className={labelClass}>
              Email
            </label>

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
             className={fieldClass}
              required
            />

          </div>

          <div>

            <label className={labelClass}>
              Role
            </label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
         className={fieldClass}
            >

              <option value="EMPLOYEE">
                Employee
              </option>

              <option value="MANAGER">
                Manager
              </option>

              <option value="ADMIN">
                Admin
              </option>

            </select>

          </div>

{
  form.role !== "ADMIN" && (

    <div>

      <label className={labelClass}>

        {
          form.role === "EMPLOYEE"
            ? "Reporting Manager"
            : "Reporting Admin"
        }

      </label>

      <select
        name="managerId"
        value={form.managerId}
        onChange={handleChange}
   className={fieldClass}
      >

        <option value="">

          {
            form.role === "EMPLOYEE"
              ? "Select Manager"
              : "Select Admin"
          }

        </option>

        {
          form.role === "EMPLOYEE" &&

          managers.map(manager => (

            <option
              key={manager.id}
              value={manager.id}
            >
              {manager.fullName}
            </option>

          ))
        }

        {
          form.role === "MANAGER" &&

          admins.map(admin => (

            <option
              key={admin.id}
              value={admin.id}
            >
              {admin.fullName}
            </option>

          ))
        }

      </select>

    </div>

  )
}


{form.role !== "ADMIN" && (
<div
  className={`col-span-full rounded-xl border p-5 ${
    isDark
      ? "border-indigo-800 bg-indigo-950/40"
      : "border-indigo-200 bg-indigo-50/50"
  }`}
>
    <h3 className="mb-4 text-lg font-semibold text-indigo-900">
      Leave Approval Flow
    </h3>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Number of Approval Levels
        </label>

        <select
          name="approvalLevels"
          value={form.approvalLevels}
          onChange={(e) => {
            const levels = Number(e.target.value);

            setForm((prev) => ({
              ...prev,
              approvalLevels: levels,
              level2ApproverId:
                levels === 1 ? "" : prev.level2ApproverId,
            }));
          }}
         className={selectClass}
          required
        >
          <option value={1}>1 Level</option>
          <option value={2}>2 Levels</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Level 1 Approver
        </label>

        <select
          name="level1ApproverId"
          value={form.level1ApproverId}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              level1ApproverId: e.target.value,
            }))
          }
        className={selectClass}
          required
        >
          <option value="">Select Level 1 Approver</option>

          {approvers.map((person) => (
            <option key={person.id} value={person.id}>
              {person.fullName} ({person.role})
            </option>
          ))}
        </select>
      </div>

      {form.approvalLevels === 2 && (
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Level 2 Approver
          </label>

          <select
            name="level2ApproverId"
            value={form.level2ApproverId}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                level2ApproverId: e.target.value,
              }))
            }
    className={selectClass}
            required
          >
            <option value="">Select Level 2 Approver</option>

            {approvers
              .filter(
                (person) =>
                  String(person.id) !==
                  String(form.level1ApproverId)
              )
              .map((person) => (
                <option key={person.id} value={person.id}>
                  {person.fullName} ({person.role})
                </option>
              ))}
          </select>
        </div>
      )}
    </div>

    <p className="mt-3 text-sm text-gray-600">
      {Number(form.approvalLevels) === 2
        ? "Both approvers must approve the leave request. If either rejects it, the approval process stops."
        : "The leave request requires approval from the Level 1 approver only."}
    </p>
  </div>
)}


<div>

  <label className={labelClass}>
    Department
  </label>

  <select
    name="department"
    value={form.department}
    onChange={handleChange}
   className={`w-full border p-3 rounded ${
  isDark
    ? "bg-slate-800 border-slate-600 text-slate-100"
    : "bg-white border-slate-300 text-slate-900"
}`}
  >

    <option value="">
      Select Department
    </option>

    <option value="IT">
      IT
    </option>

    <option value="HR">
      HR
    </option>

    <option value="FINANCE">
      Finance
    </option>

    <option value="OPERATIONS">
      Operations
    </option>

    <option value="CLAIMS">
      Claims
    </option>

    <option value="SUPPORT">
      Support
    </option>

  </select>

</div>

<div className="md:col-span-2">

  <label
    className="
    block
    mb-2
    text-sm
    font-medium
    "
  >
    Project Countries
  </label>

  <div className="grid grid-cols-3 gap-2">

    {countries.map(country => (

      <label
        key={country.id}
        className="
        flex
        items-center
        gap-2
        "
      >

        <input
          type="checkbox"
          checked={
            form.countryIds?.includes(
              country.id
            )
          }
          onChange={(e) => {

            if(e.target.checked) {

              setForm({

                ...form,

                countryIds: [

                  ...(form.countryIds || []),

                  country.id

                ]
              });

            } else {

              setForm({

                ...form,

                countryIds:
                  form.countryIds
                      .filter(
                        id =>
                          id !==
                          country.id
                      )
              });
            }
          }}
        />

        {country.countryName}

      </label>

    ))}

  </div>

</div>

<div>

  <label
    className="
    block
    mb-2
    text-sm
    font-medium
    "
  >
    Leave Policy
  </label>

  <select
    value={form.leavePolicyId}
    onChange={(e) =>
      setForm({

        ...form,

        leavePolicyId:
          e.target.value

      })
    }
className={selectClass}
  >

    <option value="">
      Select Policy
    </option>

    {policies.map(policy => (

      <option
        key={policy.id}
        value={policy.id}
      >
        {policy.policyName}
      </option>

    ))}

  </select>

</div>

<div>

  <label
    className="
    block
    mb-2
    text-sm
    font-medium
    "
  >
    Date of Birth
  </label>

  <input
    type="date"
    name="dateOfBirth"
    value={form.dateOfBirth}
    onChange={handleChange}
    className={fieldClass}
    required
  />

</div>

          <div className="md:col-span-2">

            <button
              className="
              w-full
              bg-slate-900
              text-white
              p-3
              rounded
              "
            >
              {editingId
                ? "Update Employee"
                : "Create Employee"}
            </button>

          </div>

        </form>

      )}

      <DataGrid
        bare
        rows={employees}
        searchPlaceholder="Search name, email, department, country..."
        defaultSort={{ key: "fullName", dir: "asc" }}
        actionWidth={150}
        renderActions={(emp) => (
          <>
            <button
              type="button"
              onClick={() => editEmployee(emp)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-[13px]"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => deleteEmployee(emp.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-[13px]"
            >
              Delete
            </button>
          </>
        )}
        columns={[
          { key: "fullName", label: "Name", width: 170, filter: "text", get: (e) => e.fullName || "" },
          { key: "email", label: "Email", width: 230, filter: "text", get: (e) => e.email || "" },
          { key: "role", label: "Role", width: 130, filter: "select", get: (e) => e.role || "" },
          { key: "department", label: "Department", width: 140, filter: "text", get: (e) => e.department || "" },
          { key: "dateOfBirth", label: "Date of Birth", width: 130, filter: "text", get: (e) => e.dateOfBirth || "" },
          { key: "leavePolicyName", label: "Leave Policy", width: 170, filter: "select", get: (e) => e.leavePolicyName || "" },
          { key: "countries", label: "Countries", width: 200, filter: "text", get: (e) => e.countryNames?.join(", ") || "" },
          { key: "managerName", label: "Manager", width: 150, filter: "text", get: (e) => e.managerName || "" },
        ]}
      />

    </div>
  );
}