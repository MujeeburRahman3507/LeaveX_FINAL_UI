import {
  useEffect,
  useState
} from "react";

import leavePolicyService
from "../services/leavePolicyService";

import {
  Plus,
  Pencil,
  Trash2,
  ShieldCheck
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";

import toast
from "react-hot-toast";

export default function LeavePolicyTable() {

  const { theme } = useTheme();
const isDark = theme === "dark";

const pageTextClass = isDark
  ? "text-slate-100"
  : "text-slate-900";

const mutedTextClass = isDark
  ? "text-slate-400"
  : "text-slate-500";

const cardClass = isDark
  ? "bg-slate-800 border-slate-700"
  : "bg-white border-slate-200";

const fieldClass = `w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
  isDark
    ? "bg-slate-900 border-slate-600 text-slate-100"
    : "bg-white border-slate-300 text-slate-900"
}`;

const labelClass = `block mb-2 font-medium ${
  isDark ? "text-slate-300" : "text-slate-700"
}`;

  const [policies, setPolicies] =
    useState([]);

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] =
    useState({
      policyName: "",
      annualLeave: 18,
      medicalLeave: 14,
      casualLeave: 6,
      earnedLeave: 12
    });

  useEffect(() => {

    loadPolicies();

  }, []);

  const loadPolicies =
    async () => {

      try {

        const response =
          await leavePolicyService
            .getPolicies();

        setPolicies(
          response.data
        );

      } catch {

        toast.error(
          "Failed to load policies"
        );
      }
    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        if (editingId) {

          await leavePolicyService
            .updatePolicy(
              editingId,
              form
            );

          toast.success(
            "Policy Updated Successfully"
          );

        } else {

          await leavePolicyService
            .createPolicy(
              form
            );

          toast.success(
            "Policy Created Successfully"
          );
        }

        resetForm();

        loadPolicies();

      } catch {

        toast.error(
          "Failed to Save Policy"
        );
      }
    };

  const resetForm =
    () => {

      setEditingId(null);

      setForm({
        policyName: "",
        annualLeave: 18,
        medicalLeave: 14,
        casualLeave: 6,
        earnedLeave: 12
      });
    };

  const editPolicy =
    (policy) => {
    document.querySelector(".page-scroll")?.scrollTo({ top: 0, behavior: "smooth" });


      setEditingId(
        policy.id
      );

      setForm(policy);
    };

  const deletePolicy =
    async (id) => {

      if (
        !window.confirm(
          "Delete this policy?"
        )
      ) {
        return;
      }

      try {

        await leavePolicyService
          .deletePolicy(id);

        toast.success(
          "Policy Deleted"
        );

        loadPolicies();

      } catch {

        toast.error(
          "Delete Failed"
        );
      }
    };

  return (

    <div className="space-y-6">

      {/* Header Card */}

      <div className="
      bg-gradient-to-r
      from-violet-600
      to-purple-700
      text-white
      rounded-2xl
      p-4 sm:p-6
      shadow-lg
      ">

        <div className="
        flex
        items-center
        gap-3
        ">

          <ShieldCheck size={32} />

          <div>

            <h2 className="
            text-xl sm:text-2xl
            font-bold
            ">
              Leave Policy Management
            </h2>

            <p className="opacity-90">
              Configure leave entitlement policies
            </p>

          </div>

        </div>

      </div>

      {/* Form Card */}

      <div className={`rounded-2xl shadow border p-4 sm:p-6 ${cardClass}`}>

    <form
  onSubmit={handleSubmit}
  className="
  grid
  grid-cols-1
  md:grid-cols-2
  gap-6
  items-end
  "
>

          {/* Policy Type */}

          <div>

            <label className="
            block
            mb-2
            font-medium
            ">
              Policy Type
            </label>

            <select
              value={form.policyName}
              onChange={(e) =>
                setForm({
                  ...form,
                  policyName:
                    e.target.value
                })
              }
className={fieldClass}
            >

              <option value="">
                Select Policy
              </option>

              <option value="Employee Policy">
                Employee Policy
              </option>

              <option value="Manager Policy">
                Manager Policy
              </option>

              <option value="Director Policy">
                Director Policy
              </option>

              <option value="Contractor Policy">
                Contractor Policy
              </option>

            </select>

          </div>

          {/* Annual */}

          <div>

            <label className="
            block
            mb-2
            font-medium
            ">
              Annual Leave
            </label>

            <input
              type="number"
              value={form.annualLeave}
              onChange={(e) =>
                setForm({
                  ...form,
                  annualLeave:
                    e.target.value
                })
              }
className={`w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
  isDark
    ? "bg-slate-900 border-slate-600 text-white placeholder-slate-400"
    : "bg-white border-slate-300 text-slate-900"
}`}
            />

          </div>

          {/* Medical */}

          <div>

            <label className="
            block
            mb-2
            font-medium
            ">
              Medical Leave
            </label>

            <input
              type="number"
              value={form.medicalLeave}
              onChange={(e) =>
                setForm({
                  ...form,
                  medicalLeave:
                    e.target.value
                })
              }
className={`w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
  isDark
    ? "bg-slate-900 border-slate-600 text-white placeholder-slate-400"
    : "bg-white border-slate-300 text-slate-900"
}`}
            />

          </div>

          {/* Casual */}

          <div>

            <label className="
            block
            mb-2
            font-medium
            ">
              Casual Leave
            </label>

            <input
              type="number"
              value={form.casualLeave}
              onChange={(e) =>
                setForm({
                  ...form,
                  casualLeave:
                    e.target.value
                })
              }
className={`w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
  isDark
    ? "bg-slate-900 border-slate-600 text-white placeholder-slate-400"
    : "bg-white border-slate-300 text-slate-900"
}`}
            />

          </div>

          {/* Earned */}

          <div>

            <label className="
            block
            mb-2
            font-medium
            ">
              Earned Leave
            </label>

            <input
              type="number"
              value={form.earnedLeave}
              onChange={(e) =>
                setForm({
                  ...form,
                  earnedLeave:
                    e.target.value
                })
              }
className={`w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
  isDark
    ? "bg-slate-900 border-slate-600 text-white placeholder-slate-400"
    : "bg-white border-slate-300 text-slate-900"
}`}
            />

          </div>

      <div className="flex items-end h-full">

       <button
  type="submit"
  className="
  w-full
  h-[56px]
  bg-violet-600
  hover:bg-violet-700
  text-white
  rounded-xl
  font-semibold
  flex
  items-center
  justify-center
  gap-2
  transition-all
  "
>

              <Plus size={18} />

              {
                editingId
                  ? "Update Policy"
                  : "Create Policy"
              }

            </button>

          </div>

        </form>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 keep-grid">

  <div className={`p-4 rounded-xl ${
  isDark
    ? "bg-blue-950/50 text-blue-200"
    : "bg-blue-50 text-slate-900"
}`}>
    <p>Total Policies</p>
    <h3 className="text-xl sm:text-2xl font-bold">
      {policies.length}
    </h3>
  </div>

  <div className={`p-4 rounded-xl ${
  isDark
    ? "bg-green-950/50 text-green-200"
    : "bg-green-50 text-slate-900"
}`}>
    <p>Employee Policies</p>
    <h3 className="text-xl sm:text-2xl font-bold text-green-600">
      {
        policies.filter(p =>
          p.policyName?.includes("Employee")
        ).length
      }
    </h3>
  </div>

  <div className={`p-4 rounded-xl ${
  isDark
    ? "bg-purple-950/50 text-purple-200"
    : "bg-purple-50 text-slate-900"
}`}>
    <p>Manager Policies</p>
    <h3 className="text-xl sm:text-2xl font-bold text-purple-600">
      {
        policies.filter(p =>
          p.policyName?.includes("Manager")
        ).length
      }
    </h3>
  </div>

  <div className={`p-4 rounded-xl ${
  isDark
    ? "bg-orange-950/50 text-orange-200"
    : "bg-orange-50 text-slate-900"
}`}>
    <p>Director Policies</p>
    <h3 className="text-xl sm:text-2xl font-bold text-orange-600">
      {
        policies.filter(p =>
          p.policyName?.includes("Director")
        ).length
      }
    </h3>
  </div>

</div>

 {/* Policy Cards */}

<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

  {policies.map((policy) => (

    <div
      key={policy.id}
className={`rounded-2xl shadow border hover:shadow-lg transition-all ${
  isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-slate-100"
}`}
    >

      <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-4 rounded-t-2xl text-white flex items-center justify-between gap-3">
          <h3 className="font-bold text-lg min-w-0 break-words">{policy.policyName}</h3>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => editPolicy(policy)}
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm"
            >
              <Pencil size={15} /> Edit
            </button>
            <button
              type="button"
              onClick={() => deletePolicy(policy.id)}
              className="flex items-center gap-1 bg-red-500/90 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm"
            >
              <Trash2 size={15} /> Delete
            </button>
          </div>
        </div>

      <div className="p-4 sm:p-5">

        <div className="
        grid
        grid-cols-2
        gap-4
        ">

          <div className="
          bg-blue-50
          rounded-xl
          p-3
          text-center
          ">
            <p className="text-sm text-slate-500">
              Annual
            </p>
            <h4 className="
            text-xl
            font-bold
            text-blue-600
            ">
              {policy.annualLeave}
            </h4>
          </div>

          <div className="
          bg-green-50
          rounded-xl
          p-3
          text-center
          ">
            <p className="text-sm text-slate-500">
              Medical
            </p>
            <h4 className="
            text-xl
            font-bold
            text-green-600
            ">
              {policy.medicalLeave}
            </h4>
          </div>

          <div className="
          bg-orange-50
          rounded-xl
          p-3
          text-center
          ">
            <p className="text-sm text-slate-500">
              Casual
            </p>
            <h4 className="
            text-xl
            font-bold
            text-orange-600
            ">
              {policy.casualLeave}
            </h4>
          </div>

          <div className="
          bg-purple-50
          rounded-xl
          p-3
          text-center
          ">
            <p className="text-sm text-slate-500">
              Earned
            </p>
            <h4 className="
            text-xl
            font-bold
            text-purple-600
            ">
              {policy.earnedLeave}
            </h4>
          </div>

        </div>

        

      </div>

    </div>

  ))}

</div>

    </div>
  );
}