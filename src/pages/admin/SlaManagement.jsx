import { useEffect, useState } from "react";
import { Clock, Save } from "lucide-react";
import api from "../../services/api";

export default function SlaManagement() {

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [message, setMessage] = useState("");
const [error, setError] = useState("");
  const [slaDuration, setSlaDuration] = useState(3);
  const [slaUnit, setSlaUnit] = useState("DAYS");
  const [calculationType, setCalculationType] =
    useState("WORKING_DAYS");
  const [warningBefore, setWarningBefore] = useState(1);
  const [tokenExpirySameAsSla, setTokenExpirySameAsSla] =
    useState(true);

    useEffect(() => {
  loadConfiguration();
}, []);

const loadConfiguration = async () => {

  try {

    setLoading(true);
    setError("");

    const response = await api.get("/admin/sla");

    const data = response.data;

    setSlaDuration(data.slaDuration);
    setSlaUnit(data.slaUnit);
    setCalculationType(data.calculationType);
    setWarningBefore(data.warningBefore);
    setTokenExpirySameAsSla(
      data.tokenExpirySameAsSla
    );

  } catch (err) {

    console.error(
      "Failed to load SLA configuration:",
      err
    );

    setError(
      err.response?.data?.message ||
      "Failed to load SLA configuration."
    );

  } finally {

    setLoading(false);

  }
};

const handleSave = async () => {

  try {

    setSaving(true);
    setMessage("");
    setError("");

    const payload = {
      slaDuration: Number(slaDuration),
      slaUnit,
      calculationType,
      warningBefore: Number(warningBefore),
      tokenExpirySameAsSla
    };

    const response = await api.put(
      "/admin/sla",
      payload
    );

    const data = response.data;

    setSlaDuration(data.slaDuration);
    setSlaUnit(data.slaUnit);
    setCalculationType(data.calculationType);
    setWarningBefore(data.warningBefore);
    setTokenExpirySameAsSla(
      data.tokenExpirySameAsSla
    );

    setMessage(
      "SLA configuration saved successfully."
    );

  } catch (err) {

    console.error(
      "Failed to save SLA configuration:",
      err
    );

    setError(
      err.response?.data?.message ||
      "Failed to save SLA configuration."
    );

  } finally {

    setSaving(false);

  }
};

if (loading) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-sm text-slate-500 dark:text-slate-400">
        Loading SLA configuration...
      </div>
    </div>
  );
}             
  return (

    <div className="space-y-6">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3">

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
            <Clock
              size={22}
              className="text-violet-600"
            />
          </div>

          {message && (
  <div
    className="
      rounded-xl
      border
      border-green-200
      bg-green-50
      px-4
      py-3
      text-sm
      text-green-700
      dark:border-green-800
      dark:bg-green-900/20
      dark:text-green-400
    "
  >
    {message}
  </div>
)}

{error && (
  <div
    className="
      rounded-xl
      border
      border-red-200
      bg-red-50
      px-4
      py-3
      text-sm
      text-red-700
      dark:border-red-800
      dark:bg-red-900/20
      dark:text-red-400
    "
  >
    {error}
  </div>
)}

          <div>
            <h1
              className="
                text-xl sm:text-2xl
                font-bold
                text-slate-800
                dark:text-white
              "
            >
              SLA Management
            </h1>

            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Configure manager approval SLA settings
            </p>
          </div>

        </div>
      </div>


      {/* Configuration Card */}
      <div
        className="
          bg-white
          dark:bg-slate-800
          rounded-2xl
          border
          border-slate-200
          dark:border-slate-700
          shadow-sm
          p-4 sm:p-6
        "
      >

        <h2
          className="
            text-lg
            font-semibold
            text-slate-800
            dark:text-white
            mb-6
          "
        >
          Manager Approval SLA
        </h2>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* SLA Duration */}
          <div>
            <label
              className="
                block
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-300
                mb-2
              "
            >
              SLA Duration
            </label>

            <div className="flex gap-3">

              <input
                type="number"
                min="1"
                value={slaDuration}
                onChange={(e) =>
                  setSlaDuration(e.target.value)
                }
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  border
                  border-slate-300
                  dark:border-slate-600
                  bg-white
                  dark:bg-slate-700
                  text-slate-800
                  dark:text-white
                  outline-none
                  focus:ring-2
                  focus:ring-violet-500
                "
              />

              <select
                value={slaUnit}
                onChange={(e) =>
                  setSlaUnit(e.target.value)
                }
                className="
                  px-4
                  py-3
                  rounded-xl
                  border
                  border-slate-300
                  dark:border-slate-600
                  bg-white
                  dark:bg-slate-700
                  text-slate-800
                  dark:text-white
                  outline-none
                "
              >
                <option value="DAYS">
                  Days
                </option>

                <option value="HOURS">
                  Hours
                </option>
              </select>

            </div>
          </div>


          {/* SLA Calculation */}
          <div>
            <label
              className="
                block
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-300
                mb-2
              "
            >
              SLA Calculation
            </label>

            <select
              value={calculationType}
              onChange={(e) =>
                setCalculationType(e.target.value)
              }
              className="
                w-full
                px-4
                py-3
                rounded-xl
                border
                border-slate-300
                dark:border-slate-600
                bg-white
                dark:bg-slate-700
                text-slate-800
                dark:text-white
                outline-none
              "
            >
              <option value="WORKING_DAYS">
                Working Days
              </option>

              <option value="CALENDAR_DAYS">
                Calendar Days
              </option>
            </select>
          </div>


          {/* Warning */}
          <div>
            <label
              className="
                block
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-300
                mb-2
              "
            >
              Send Warning Before SLA
            </label>

            <div className="flex items-center gap-3">

              <input
                type="number"
                min="0"
                value={warningBefore}
                onChange={(e) =>
                  setWarningBefore(e.target.value)
                }
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  border
                  border-slate-300
                  dark:border-slate-600
                  bg-white
                  dark:bg-slate-700
                  text-slate-800
                  dark:text-white
                  outline-none
                  focus:ring-2
                  focus:ring-violet-500
                "
              />

              <span
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Day(s) before
              </span>

            </div>
          </div>


          {/* Token Expiry */}
          <div>

            <label
              className="
                block
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-300
                mb-2
              "
            >
              Email Action Token
            </label>

            <label
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                border
                border-slate-200
                dark:border-slate-600
                bg-slate-50
                dark:bg-slate-700/50
                cursor-pointer
              "
            >

              <input
                type="checkbox"
                checked={tokenExpirySameAsSla}
                onChange={(e) =>
                  setTokenExpirySameAsSla(
                    e.target.checked
                  )
                }
                className="
                  w-4
                  h-4
                  accent-violet-600
                "
              />

              <span
                className="
                  text-sm
                  text-slate-700
                  dark:text-slate-300
                "
              >
                Token expires at SLA deadline
              </span>

            </label>

          </div>

        </div>


        {/* Save */}
        <div
          className="
            mt-8
            flex
            justify-end
          "
        >

        <button
  onClick={handleSave}
  disabled={saving || loading}
            className="
              flex
              items-center
              gap-2
              px-5
              py-3
              rounded-xl
              bg-violet-600
              text-white
              font-medium
              hover:bg-violet-700
              transition
              shadow-sm
            "
          >

<Save size={18} />

{saving
  ? "Saving..."
  : "Save Configuration"}

          </button>

        </div>

      </div>


      {/* Current Configuration */}
      <div
        className="
          bg-white
          dark:bg-slate-800
          rounded-2xl
          border
          border-slate-200
          dark:border-slate-700
          shadow-sm
          p-4 sm:p-6
        "
      >

        <h2
          className="
            text-lg
            font-semibold
            text-slate-800
            dark:text-white
            mb-4
          "
        >
          Current Configuration
        </h2>

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-4
          "
        >

          <div
            className="
              rounded-xl
              bg-slate-50
              dark:bg-slate-700/50
              p-4
            "
          >
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Approval SLA
            </p>

            <p className="mt-1 font-semibold text-slate-800 dark:text-white">
              {slaDuration} {slaUnit.toLowerCase()}
            </p>
          </div>


          <div
            className="
              rounded-xl
              bg-slate-50
              dark:bg-slate-700/50
              p-4
            "
          >
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calculation
            </p>

            <p className="mt-1 font-semibold text-slate-800 dark:text-white">
              {calculationType === "WORKING_DAYS"
                ? "Working Days"
                : "Calendar Days"}
            </p>
          </div>


          <div
            className="
              rounded-xl
              bg-slate-50
              dark:bg-slate-700/50
              p-4
            "
          >
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Warning
            </p>

            <p className="mt-1 font-semibold text-slate-800 dark:text-white">
              {warningBefore} day before
            </p>
          </div>


          <div
            className="
              rounded-xl
              bg-slate-50
              dark:bg-slate-700/50
              p-4
            "
          >
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Status
            </p>

            <p className="mt-1 font-semibold text-green-600">
              Active
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}