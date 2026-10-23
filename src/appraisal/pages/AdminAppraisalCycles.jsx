import React, { useEffect, useState } from "react";
import DataGrid from "../../components/DataGrid";
import {
  getAppraisalCycles,
  createAppraisalCycle,
  updateAppraisalCycle,
  updateAppraisalCycleStatus,
} from "../services/appraisalService";

const emptyForm = {
  name: "",
  description: "",
  appraisalStartDate: "",
  appraisalEndDate: "",
  goalSettingStartDate: "",
  goalSettingEndDate: "",
  selfReviewStartDate: "",
  selfReviewEndDate: "",
  managerReviewStartDate: "",
  managerReviewEndDate: "",
  hrReviewStartDate: "",
  hrReviewEndDate: "",
};

const AdminAppraisalCycles = () => {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingCycle, setEditingCycle] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadCycles = async () => {
    try {
      setLoading(true);

      const data = await getAppraisalCycles();

      setCycles(data || []);
    } catch (error) {
      console.error("Failed to load appraisal cycles:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to load appraisal cycles."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCycles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openCreateForm = () => {
    setEditingCycle(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (cycle) => {
    document.querySelector(".page-scroll")?.scrollTo({ top: 0, behavior: "smooth" });

    setEditingCycle(cycle);

    setForm({
      name: cycle.name || "",
      description: cycle.description || "",
      appraisalStartDate:
        cycle.appraisalStartDate || "",
      appraisalEndDate:
        cycle.appraisalEndDate || "",
      goalSettingStartDate:
        cycle.goalSettingStartDate || "",
      goalSettingEndDate:
        cycle.goalSettingEndDate || "",
      selfReviewStartDate:
        cycle.selfReviewStartDate || "",
      selfReviewEndDate:
        cycle.selfReviewEndDate || "",
      managerReviewStartDate:
        cycle.managerReviewStartDate || "",
      managerReviewEndDate:
        cycle.managerReviewEndDate || "",
      hrReviewStartDate:
        cycle.hrReviewStartDate || "",
      hrReviewEndDate:
        cycle.hrReviewEndDate || "",
    });

    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingCycle(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter the appraisal cycle name.");
      return;
    }

    if (!form.appraisalStartDate) {
      alert("Please select the appraisal start date.");
      return;
    }

    if (!form.appraisalEndDate) {
      alert("Please select the appraisal end date.");
      return;
    }

    if (
      new Date(form.appraisalEndDate) <
      new Date(form.appraisalStartDate)
    ) {
      alert(
        "Appraisal end date cannot be before the start date."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        appraisalStartDate:
          form.appraisalStartDate,
        appraisalEndDate:
          form.appraisalEndDate,
        goalSettingStartDate:
          form.goalSettingStartDate || null,
        goalSettingEndDate:
          form.goalSettingEndDate || null,
        selfReviewStartDate:
          form.selfReviewStartDate || null,
        selfReviewEndDate:
          form.selfReviewEndDate || null,
        managerReviewStartDate:
          form.managerReviewStartDate || null,
        managerReviewEndDate:
          form.managerReviewEndDate || null,
        hrReviewStartDate:
          form.hrReviewStartDate || null,
        hrReviewEndDate:
          form.hrReviewEndDate || null,
      };

      if (editingCycle) {
        await updateAppraisalCycle(
          editingCycle.id,
          payload
        );

        alert(
          "Appraisal cycle updated successfully."
        );
      } else {
        await createAppraisalCycle(payload);

        alert(
          "Appraisal cycle created successfully."
        );
      }

      closeForm();
      await loadCycles();
    } catch (error) {
      console.error(
        "Failed to save appraisal cycle:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to save appraisal cycle."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (
    cycle,
    status
  ) => {
    try {
      await updateAppraisalCycleStatus(
        cycle.id,
        status
      );

      await loadCycles();

      alert(
        `Cycle status changed to ${status}.`
      );
    } catch (error) {
      console.error(
        "Failed to update cycle status:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to update cycle status."
      );
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-green-100 text-green-700";

      case "GOAL_SETTING":
        return "bg-blue-100 text-blue-700";

      case "SELF_REVIEW":
        return "bg-purple-100 text-purple-700";

      case "MANAGER_REVIEW":
        return "bg-yellow-100 text-yellow-700";

      case "HR_REVIEW":
        return "bg-indigo-100 text-indigo-700";

      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "CLOSED":
        return "bg-gray-200 text-gray-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const dateValue = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(
      `${value}T00:00:00`
    ).toLocaleDateString("en-GB");
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-0 sm:p-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Appraisal Cycles
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create and manage performance appraisal cycles.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="w-full sm:w-auto rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Create Appraisal Cycle
        </button>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <div className="rounded-xl border bg-white p-4 sm:p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingCycle
                  ? "Edit Appraisal Cycle"
                  : "Create Appraisal Cycle"}
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Configure the appraisal period and review stages.
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              disabled={saving}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Cancel
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cycle Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. 2027 Annual Performance Appraisal"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>

                <textarea
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter appraisal cycle description..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Appraisal Period */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Appraisal Start Date
                </label>

                <input
                  type="date"
                  name="appraisalStartDate"
                  value={form.appraisalStartDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Appraisal End Date
                </label>

                <input
                  type="date"
                  name="appraisalEndDate"
                  value={form.appraisalEndDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Goal Setting */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                Goal Setting Period
              </h3>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm text-gray-600 dark:text-gray-400">
                    Start Date
                  </label>

                  <input
                    type="date"
                    name="goalSettingStartDate"
                    value={form.goalSettingStartDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-600 dark:text-gray-400">
                    End Date
                  </label>

                  <input
                    type="date"
                    name="goalSettingEndDate"
                    value={form.goalSettingEndDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

              </div>
            </div>

            {/* Self Review */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                Employee Self Review Period
              </h3>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm text-gray-600 dark:text-gray-400">
                    Start Date
                  </label>

                  <input
                    type="date"
                    name="selfReviewStartDate"
                    value={form.selfReviewStartDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-600 dark:text-gray-400">
                    End Date
                  </label>

                  <input
                    type="date"
                    name="selfReviewEndDate"
                    value={form.selfReviewEndDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

              </div>
            </div>

            {/* Manager Review */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                Manager Review Period
              </h3>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm text-gray-600 dark:text-gray-400">
                    Start Date
                  </label>

                  <input
                    type="date"
                    name="managerReviewStartDate"
                    value={form.managerReviewStartDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-600 dark:text-gray-400">
                    End Date
                  </label>

                  <input
                    type="date"
                    name="managerReviewEndDate"
                    value={form.managerReviewEndDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

              </div>
            </div>

            {/* HR Review */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                HR Review Period
              </h3>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm text-gray-600 dark:text-gray-400">
                    Start Date
                  </label>

                  <input
                    type="date"
                    name="hrReviewStartDate"
                    value={form.hrReviewStartDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-600 dark:text-gray-400">
                    End Date
                  </label>

                  <input
                    type="date"
                    name="hrReviewEndDate"
                    value={form.hrReviewEndDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

              </div>
            </div>

            {/* Save */}
            <div className="flex justify-end gap-3 border-t pt-5 dark:border-gray-700">

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingCycle
                  ? "Update Cycle"
                  : "Create Cycle"}
              </button>

            </div>

          </form>
        </div>
      )}

      {/* Cycle List */}
      {loading ? (
        <div className="rounded-xl border bg-white p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800">
          Loading appraisal cycles...
        </div>
      ) : (
        <DataGrid
          rows={cycles}
          searchPlaceholder="Search cycle, status, date..."
          defaultSort={{ key: "name", dir: "asc" }}
          chipsKey="status"
          actionWidth={190}
          emptyText="No appraisal cycles found."
          renderActions={(cycle) => (
            <>
              <button
                type="button"
                onClick={() => openEditForm(cycle)}
                className="rounded-md bg-blue-500 hover:bg-blue-600 px-3 py-1.5 text-[13px] font-medium text-white"
              >
                Edit
              </button>
              <select
                value={cycle.status}
                onChange={(e) => handleStatusChange(cycle, e.target.value)}
                className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-1.5 py-1.5 text-xs dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {["DRAFT","OPEN","GOAL_SETTING","SELF_REVIEW","MANAGER_REVIEW","HR_REVIEW","COMPLETED","CLOSED"].map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </>
          )}
          columns={[
            { key: "name", label: "Cycle", width: 200, filter: "text", get: (c) => c.name || "" },
            { key: "period", label: "Appraisal Period", width: 190, filter: "text",
              get: (c) => `${dateValue(c.appraisalStartDate)} - ${dateValue(c.appraisalEndDate)}` },
            { key: "goal", label: "Goal Setting", width: 190, filter: "text",
              get: (c) => `${dateValue(c.goalSettingStartDate)} - ${dateValue(c.goalSettingEndDate)}` },
            { key: "self", label: "Self Review", width: 190, filter: "text",
              get: (c) => `${dateValue(c.selfReviewStartDate)} - ${dateValue(c.selfReviewEndDate)}` },
            { key: "manager", label: "Manager Review", width: 190, filter: "text",
              get: (c) => `${dateValue(c.managerReviewStartDate)} - ${dateValue(c.managerReviewEndDate)}` },
            { key: "hr", label: "HR Review", width: 190, filter: "text",
              get: (c) => `${dateValue(c.hrReviewStartDate)} - ${dateValue(c.hrReviewEndDate)}` },
            { key: "status", label: "Status", width: 160, filter: "select", get: (c) => c.status || "",
              render: (c) => (
                <span className={`inline-flex rounded-full px-3 py-0.5 text-xs font-medium ${getStatusClass(c.status)}`}>
                  {c.status}
                </span>
              ) },
          ]}
        />
      )}
</div>
  );
};

export default AdminAppraisalCycles;