import { useState, useEffect } from "react";
import leaveService from "../services/leaveService";
import toast
from "react-hot-toast";
import leaveDocumentService
from "../services/leaveDocumentService";
import {
    Trash2,
    Upload
} from "lucide-react";

export default function LeaveForm({
  onSuccess,
  aiLeaveData,
  managerMode = false
}) {

  const [leavePreview,
setLeavePreview] =
useState(null);

const [documents,
setDocuments] =
useState([]);

const [form, setForm] = useState({
    leaveType: "CASUAL",
    durationType: "FULL_DAY",
    startDate: "",
    endDate: "",
    reason: "",
    backupPersonId: null
});

const [backupPersons, setBackupPersons] = useState([]);
const [backupLoading, setBackupLoading] = useState(false);

  const [loading,
    setLoading] =
    useState(false);

  const [error,
    setError] =
    useState("");

  const [success,
    setSuccess] =
    useState("");

const loadPreview = async () => {

  try {

    const calculationEndDate =
      form.durationType === "FULL_DAY"
        ? form.endDate
        : form.startDate;

    if (!form.startDate || !calculationEndDate) {
      return;
    }

const response =
  managerMode
    ? await leaveService.calculateManagerDays(
        form.startDate,
        calculationEndDate,
        form.durationType
      )
    : await leaveService.calculateDays(
        form.startDate,
        calculationEndDate,
        form.durationType
      );

    setLeavePreview(
      response.data
    );

  } catch (error) {

    console.error(error);

  }
};

  const handleChange =
    (e) => {

      setForm({
        ...form,
        [e.target.name]:
          e.target.value
      });
    };

//    const handleDocumentChange = (e) => {

//     const files =

//         Array.from(
//             e.target.files
//         ).map(file => ({

//             file,

//             documentType:
//                 "OTHER"

//         }));

//     setDocuments(files);

// };

const handleDurationChange = (e) => {

    const durationType = e.target.value;

    setForm(prev => ({
        ...prev,

        durationType,

        endDate:
            durationType === "FULL_DAY"
                ? prev.endDate
                : prev.startDate
    }));
};

const getDefaultDocumentType = () => {

    switch (form.leaveType) {

        case "MEDICAL":
            return "MEDICAL_CERTIFICATE";

        case "CASUAL":
            return "OTHER";

        case "EARNED":
            return "OTHER";

        default:
            return "OTHER";

    }

};

const handleDocumentChange = (e) => {

    const defaultType =
        getDefaultDocumentType();

    const newFiles =

        Array.from(e.target.files).map(file => ({

            file,

            documentType: defaultType

        }));

    setDocuments(prev => [

        ...prev,

        ...newFiles

    ]);

    e.target.value = "";

};
const updateDocumentType = (

    index,

    type

) => {

    const updated =

        [...documents];

    updated[index].documentType =

        type;

    setDocuments(updated);

};

const removeDocument = (index) => {

    const updated = [...documents];

    updated.splice(index, 1);

    setDocuments(updated);

};

useEffect(() => {

    const loadBackupPersons = async () => {

        try {

            setBackupLoading(true);

            const response = managerMode
                ? await leaveService.getManagerBackupPersons()
                : await leaveService.getEmployeeBackupPersons();

            setBackupPersons(
                response?.data?.data || []
            );

        } catch (error) {

            console.error(
                "Failed to load backup persons:",
                error
            );

            setBackupPersons([]);

        } finally {

            setBackupLoading(false);

        }

    };

    loadBackupPersons();

}, [managerMode]);

    // useEffect(() => {

useEffect(() => {

  if (!form.startDate) {
    return;
  }

  if (
    form.durationType === "FULL_DAY" &&
    !form.endDate
  ) {
    return;
  }

  loadPreview();

}, [
  form.startDate,
  form.endDate,
  form.durationType
]);
useEffect(() => {

    if (!aiLeaveData) {
        return;
    }

    setForm(prev => ({
        ...prev,

        leaveType:
            aiLeaveData.leaveType ||
            prev.leaveType,

        durationType:
            aiLeaveData.durationType ||
            prev.durationType,

        startDate:
            aiLeaveData.startDate ||
            prev.startDate,

        endDate:
            aiLeaveData.endDate ||
            prev.endDate,

        reason:
            aiLeaveData.reason ||
            prev.reason
    }));

}, [aiLeaveData]);

const handleSubmit =
  async (e) => {

    e.preventDefault();

    try {

      setLoading(true);
      setError("");

      const submitData = {
        ...form,
            backupPersonId:
        form.backupPersonId || null,
        endDate:
          form.durationType === "FULL_DAY"
            ? form.endDate
            : form.startDate
      };

      const conflict =
        await leaveService.checkConflict(submitData);

      if (conflict.data.conflict) {

        toast.error(
          `${conflict.data.employeesOnLeave}
           employees from
           ${conflict.data.department}
           already on leave`
        );

        setLoading(false);
        return;
      }

const response =
  managerMode
    ? await leaveService.applyManagerLeave(submitData)
    : await leaveService.applyLeave(submitData);

      const leaveRequestId =
        response.data.data.id;

      // Upload Documents
      for (const doc of documents) {

        const formData =
          new FormData();

        formData.append(
          "leaveRequestId",
          leaveRequestId
        );

        formData.append(
          "documentType",
          doc.documentType
        );

        formData.append(
          "remarks",
          ""
        );

        formData.append(
          "file",
          doc.file
        );

        await leaveDocumentService
          .uploadDocument(formData);
      }

      setSuccess(
        "Leave request submitted successfully."
      );

      toast.success(
        "Leave Request Submitted"
      );

setForm({
    leaveType: "CASUAL",
    durationType: "FULL_DAY",
    startDate: "",
    endDate: "",
    reason: "",
    backupPersonId: null
});

      if (onSuccess) {
        onSuccess();
      }

    } catch (err) {

      setError(
        err?.response?.data?.message ||
        "Failed to submit leave request."
      );

      toast.error(
        "Failed to submit leave request"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl shadow p-6 border border-transparent dark:border-gray-700">

      <h2 className="text-xl font-semibold mb-4">
        Apply Leave
      </h2>

      {error && (
        <div className="bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 p-3 rounded mb-4">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <div>

          <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">
            Leave Type
          </label>

          <select
            name="leaveType"
            value={form.leaveType}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="CASUAL">
              Casual Leave
            </option>

            <option value="MEDICAL">
              Medical Leave
            </option>

            <option value="EARNED">
              Earned Leave
            </option>
          </select>

        </div>

        <div>
    <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">
        Leave Duration
    </label>

<select
    name="durationType"
    value={form.durationType}
    onChange={handleDurationChange}
    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
    required
>
        <option value="FULL_DAY">
            Full Day
        </option>

        <option value="FIRST_HALF">
            First Half (Morning)
        </option>

        <option value="SECOND_HALF">
            Second Half (Afternoon)
        </option>
    </select>
</div>

        <div className="grid md:grid-cols-2 gap-4">

          <div>

            <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">
              Start Date
            </label>

            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />

          </div>

          <div>

            <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">
              End Date
            </label>

            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
           className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
              disabled={form.durationType !== "FULL_DAY"}
            />

          </div>

          {
leavePreview && (

<div
className="bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 rounded-xl p-4 mt-4 text-gray-800 dark:text-gray-200"
>

<h3
className="font-semibold text-violet-700 dark:text-violet-300 mb-2"
>
Leave Summary
</h3>

<p>
    Total Leave Days: {
        form.durationType === "FIRST_HALF" ||
        form.durationType === "SECOND_HALF"
            ? "0.5"
            : leavePreview?.totalLeaveDays
    }
</p>

{
leavePreview.excludedDays
?.length > 0 && (

<>

<p className="mt-3">
Excluded Days:
</p>

<ul
className="
list-disc
ml-6
text-sm
"
>

{
leavePreview.excludedDays
.map(day => (

<li key={day}>
{day}
</li>

))
}

</ul>

</>

)
}

</div>

)
}

        </div>

        <div>

          <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">
            Reason
          </label>

          <textarea
            name="reason"
            rows="4"
            value={form.reason}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />

                  {/* Backup Person */}

        <div>

          <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">
            Backup Person
            <span className="text-gray-500 text-sm ml-1">
              (Optional)
            </span>
          </label>

          <select
            name="backupPersonId"
            value={form.backupPersonId || ""}
            onChange={(e) =>
              setForm(prev => ({
                ...prev,
                backupPersonId:
                  e.target.value
                    ? Number(e.target.value)
                    : null
              }))
            }
           className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            disabled={backupLoading}
          >

            <option value="">
              {backupLoading
                ? "Loading backup persons..."
                : "Select Backup Person"}
            </option>

            {backupPersons.map(person => (

              <option
                key={person.id}
                value={person.id}
              >
                {person.fullName}
                {person.email
                  ? ` (${person.email})`
                  : ""}
              </option>

            ))}

          </select>

          {!backupLoading &&
            backupPersons.length === 0 && (

              <p className="text-sm text-gray-500 mt-1">
                No eligible backup persons available.
              </p>

          )}

        </div>

          <div className="mt-6">

    <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">

        Supporting Documents
        <span className="text-gray-500 text-sm">
            {" "}
            (Optional)
        </span>

    </label>

    {/* <input

        type="file"

        multiple

        accept=".pdf,.jpg,.jpeg,.png"

        onChange={handleDocumentChange}

        className="
        w-full
        border
        rounded-lg
        p-3
        "

    /> */}

    <label
className="flex items-center justify-center gap-3 border-2 border-dashed border-violet-300 dark:border-violet-700 rounded-xl p-6 cursor-pointer hover:bg-violet-50 dark:hover:bg-violet-950/40 transition"
>

    <Upload
        size={22}
       className="font-semibold text-violet-700 dark:text-violet-300"
    />

    <div>

        <p className="font-semibold text-violet-700 dark:text-violet-300">

            Click to Upload Documents

        </p>

        <p className="font-semibold text-violet-700 dark:text-violet-300">

            PDF, JPG, PNG

        </p>

    </div>

    <input

        type="file"

        multiple

        accept=".pdf,.jpg,.jpeg,.png"

        onChange={handleDocumentChange}

        className="hidden"

    />

</label>

    <p
className="font-semibold text-violet-700 dark:text-violet-300"
    >

        Upload Medical Certificate,
        Prescription,
        Hospital Bill,
        Lab Report etc.

    </p>

    {

        documents.length > 0 && (

            <div
className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-slate-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >

                <p
className="font-semibold mb-3 text-gray-800 dark:text-gray-100"
                >

                    Selected Documents

                </p>

                {

                documents.map((doc,index) => (

                   <div
key={index}
className="
flex
justify-between
items-center
border-b
py-4
"
>

    <div className="flex-1">

<p className="font-medium text-gray-800 dark:text-gray-100">
  📄 {doc.file.name}
</p>

<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
  {(doc.file.size / 1024).toFixed(1)} KB
</p>

    </div>

    <div className="flex items-center gap-3">

        <select

            value={doc.documentType}

            onChange={(e)=>

                updateDocumentType(

                    index,

                    e.target.value

                )

            }

           className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        >

            <option value="OTHER">Other</option>
            <option value="MEDICAL_CERTIFICATE">Medical Certificate</option>
            <option value="PRESCRIPTION">Prescription</option>
            <option value="HOSPITAL_BILL">Hospital Bill</option>
            <option value="LAB_REPORT">Lab Report</option>
            <option value="DEATH_CERTIFICATE">Death Certificate</option>
            <option value="MATERNITY_DOCUMENT">Maternity Document</option>
            <option value="TRAVEL_DOCUMENT">Travel Document</option>

        </select>

        <button

            type="button"

            onClick={() => removeDocument(index)}

            className="bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 rounded-lg p-2 transition"

            title="Remove Document"

        >

            <Trash2 size={18}/>

        </button>

    </div>

</div>

                        )

                    )

                }

            </div>

        )

    }

</div>

        </div>

        <button
          disabled={loading}
          className="bg-slate-900 dark:bg-violet-600 hover:bg-slate-700 dark:hover:bg-violet-500 text-white px-5 py-3 rounded-lg disabled:opacity-50 transition"
        >
          {loading
            ? "Submitting..."
            : "Submit Leave"}
        </button>

      </form>

    </div>
  );
}