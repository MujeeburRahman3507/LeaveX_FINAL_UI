import { useEffect, useState } from "react";
import { CalendarClock, Save, RefreshCw } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../services/api";
import { useTheme } from "../../context/ThemeContext";

export default function BackdatedLeaveManagement() {

  const { theme } = useTheme();
const isDark = theme === "dark";

const textClass = isDark ? "text-slate-100" : "text-gray-800";
const mutedTextClass = isDark ? "text-slate-400" : "text-gray-500";

const cardClass = isDark
  ? "bg-slate-800 border-slate-700"
  : "bg-white border-gray-200";

const fieldClass = `w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
  isDark
    ? "bg-slate-900 border-slate-600 text-slate-100"
    : "bg-white border-gray-300 text-gray-900"
}`;

const optionClass = isDark
  ? "border-slate-600 bg-slate-800"
  : "border-gray-300 bg-white";
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    id: null,
    maxBackdatedDays: 30,
    medicalDocumentRequired: true,
    active: true,
  });

  const loadConfiguration = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await api.get("/admin/backdated-leave");

      setForm({
        id: response.data.id,
        maxBackdatedDays: response.data.maxBackdatedDays ?? 30,
        medicalDocumentRequired:
          response.data.medicalDocumentRequired ?? true,
        active: response.data.active ?? true,
      });
    } catch (err) {
      console.error("Failed to load backdated leave configuration:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load backdated leave configuration."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfiguration();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (!form.maxBackdatedDays || Number(form.maxBackdatedDays) <= 0) {
        setError("Maximum backdated days must be greater than 0.");
        return;
      }

      const payload = {
        id: form.id,
        maxBackdatedDays: Number(form.maxBackdatedDays),
        medicalDocumentRequired: form.medicalDocumentRequired,
        active: form.active,
      };

      const response = await api.put("/admin/backdated-leave", payload);

      setForm({
        id: response.data.id,
        maxBackdatedDays: response.data.maxBackdatedDays,
        medicalDocumentRequired: response.data.medicalDocumentRequired,
        active: response.data.active,
      });

      setMessage("Backdated leave configuration saved successfully.");
    } catch (err) {
      console.error("Failed to save backdated leave configuration:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to save backdated leave configuration."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[300px]">
<div className={mutedTextClass}>
  Loading configuration...
</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-3">
              <CalendarClock className="text-blue-600" size={28} />

<h1 className={`text-xl sm:text-2xl font-bold ${textClass}`}>
  Backdated Leave Management
</h1>
            </div>

<p className={`${mutedTextClass} mt-1`}>
  Configure the rules for applying backdated medical leave.
</p>
          </div>

          <button
            type="button"
            onClick={loadConfiguration}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${
  isDark
    ? "border-slate-600 text-slate-200 hover:bg-slate-700"
    : "border-gray-300 text-gray-700 hover:bg-gray-50"
}`}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Success Message */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Configuration Card */}
      <div className={`rounded-xl shadow-sm border p-4 sm:p-6 ${cardClass}`}>
          <div className="flex items-center gap-3 mb-6">
            <CalendarClock className="text-blue-600" size={22} />

            <div>
<h2 className={`text-lg font-semibold ${textClass}`}>
  Backdated Leave Configuration
</h2>

<p className={`text-sm ${mutedTextClass}`}>
  These settings control how far back an employee can apply
  for Medical Leave.
</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Maximum Backdated Days */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
  isDark ? "text-slate-300" : "text-gray-700"
}`}>
                Maximum Backdated Days
              </label>

              <input
                type="number"
                min="1"
                value={form.maxBackdatedDays}
                onChange={(e) =>
                  handleChange("maxBackdatedDays", e.target.value)
                }
                className={fieldClass}
              />

              <p className={`text-xs mt-2 ${mutedTextClass}`}>
                Employees can apply for Medical Leave up to this many days
                after the leave end date.
              </p>
            </div>

            {/* Active */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
  isDark ? "text-slate-300" : "text-gray-700"
}`}>
                Configuration Status
              </label>

              <label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer ${
  isDark
    ? "border-slate-600 bg-slate-900"
    : "border-gray-300 bg-white"
}`}>
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    handleChange("active", e.target.checked)
                  }
                  className="w-4 h-4"
                />

<span className={`text-sm ${isDark ? "text-slate-200" : "text-gray-700"}`}>
  Enable Backdated Medical Leave
</span>
              </label>
            </div>

            {/* Medical Document Required */}
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${
  isDark ? "text-slate-300" : "text-gray-700"
}`}>
                Medical Document Requirement
              </label>

              <label className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer ${
  isDark
    ? "border-slate-600 bg-slate-900"
    : "border-gray-300 bg-white"
}`}>
                <input
                  type="checkbox"
                  checked={form.medicalDocumentRequired}
                  onChange={(e) =>
                    handleChange(
                      "medicalDocumentRequired",
                      e.target.checked
                    )
                  }
                  className="w-4 h-4"
                />

                <div>
<div className={`text-sm font-medium ${isDark ? "text-slate-200" : "text-gray-700"}`}>
  Medical document is required
</div>

<div className={`text-xs ${mutedTextClass}`}>
  Employees applying for backdated Medical Leave must provide
  supporting medical documentation.
</div>
                </div>
              </label>
            </div>
          </div>

          {/* Example */}
          <div className={`mt-6 border rounded-lg p-4 ${
  isDark
    ? "bg-blue-950/40 border-blue-800"
    : "bg-blue-50 border-blue-200"
}`}>
<div className={`font-medium ${isDark ? "text-blue-300" : "text-blue-800"}`}>
  Current Rule
</div>

<p className={`text-sm mt-1 ${isDark ? "text-blue-200" : "text-blue-700"}`}>
  Medical Leave can be applied up to{" "}
  <strong>{form.maxBackdatedDays} days</strong> after the
  leave end date.
  {form.medicalDocumentRequired
    ? " A medical document is required."
    : " A medical document is not mandatory."}
</p>
          </div>

          {/* Save */}
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto justify-center flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={17} />

              {saving ? "Saving..." : "Save Configuration"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}