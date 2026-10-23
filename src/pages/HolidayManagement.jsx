import {
  useEffect,
  useState
} from "react";

import DashboardLayout
from "../components/DashboardLayout";
import DataGrid from "../components/DataGrid";

import holidayService
from "../services/holidayService";

import countryService
from "../services/countryService";

import { useTheme } from "../context/ThemeContext";

import toast
from "react-hot-toast";

export default function HolidayManagement() {

  const { theme } = useTheme();
const isDark = theme === "dark";

const textClass = isDark ? "text-slate-100" : "text-gray-900";
const mutedTextClass = isDark ? "text-slate-400" : "text-slate-500";

const cardClass = isDark
  ? "bg-slate-800 border-slate-700"
  : "bg-white border-gray-200";

const fieldClass = `w-full border p-3 rounded ${
  isDark
    ? "bg-slate-900 border-slate-600 text-slate-100 placeholder-slate-400"
    : "bg-white border-gray-300 text-slate-900 placeholder-slate-400"
}`;

const tableHeaderClass = isDark
  ? "bg-slate-700 text-slate-100"
  : "bg-slate-100 text-slate-800";

const tableRowClass = isDark
  ? "border-t border-slate-700 text-slate-200"
  : "border-t border-gray-200 text-slate-700";

  const [holidays,
    setHolidays] =
    useState([]);

  const [countries,
    setCountries] =
    useState([]);

  const [editingId,
    setEditingId] =
    useState(null);

  const [form,
    setForm] =
    useState({

      holidayName: "",

      holidayDate: "",

      holidayType: "PUBLIC",

      countryId: "",

      isGlobal: false,

      description: ""

    });

    //NEW//

      const [importCountryId,
    setImportCountryId] =
    useState("");

  const [importYear,
    setImportYear] =
    useState(new Date().getFullYear());

  const [importMode,
    setImportMode] =
    useState("ADD");

  const [importFile,
    setImportFile] =
    useState(null);

  const [importPreview,
    setImportPreview] =
    useState(null);

  const [importLoading,
    setImportLoading] =
    useState(false);

  const [importMessage,
    setImportMessage] =
    useState("");

  const [importError,
    setImportError] =
    useState("");

  useEffect(() => {

    loadHolidays();
    loadCountries();

  }, []);

  const loadHolidays =
    async () => {

      const response =
        await holidayService
          .getAll();

      setHolidays(
        response.data
      );
    };

  const loadCountries =
    async () => {

      const response =
        await countryService
          .getCountries();

      setCountries(
        response.data
      );
    };

  const handleChange =
    (e) => {

      const {
        name,
        value,
        type,
        checked
      } = e.target;

      setForm({

        ...form,

        [name]:
          type === "checkbox"
            ? checked
            : value
      });
    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        if(editingId) {

          await holidayService
            .update(
              editingId,
              form
            );

          toast.success(
            "Holiday Updated"
          );

        } else {

          await holidayService
            .create(
              form
            );

          toast.success(
            "Holiday Added"
          );
        }

        resetForm();

        loadHolidays();

      } catch(error) {

        console.error(error);

      }
    };

  const editHoliday =
    (holiday) => {
      document.querySelector(".page-scroll")?.scrollTo({ top: 0, behavior: "smooth" });


      setEditingId(
        holiday.id
      );

      setForm({

        holidayName:
          holiday.holidayName,

        holidayDate:
          holiday.holidayDate,

        holidayType:
          holiday.holidayType,

        countryId:
          holiday.countryId || "",

        isGlobal:
          holiday.isGlobal,

        description:
          holiday.description
      });
    };

    //NEW//

      const handleHolidayImportPreview =
    async () => {

      if (!importCountryId) {

        setImportError(
          "Please select a country."
        );

        return;
      }

      if (!importYear) {

        setImportError(
          "Please enter the holiday year."
        );

        return;
      }

      if (!importFile) {

        setImportError(
          "Please select a CSV file."
        );

        return;
      }

      setImportLoading(true);
      setImportError("");
      setImportMessage("");
      setImportPreview(null);

      try {

        const formData =
          new FormData();

        formData.append(
          "countryId",
          importCountryId
        );

        formData.append(
          "year",
          importYear
        );

        formData.append(
          "importMode",
          importMode
        );

        formData.append(
          "file",
          importFile
        );

        const response =
          await holidayService
            .previewImport(
              formData
            );

        setImportPreview(
          response.data
        );

      } catch(error) {

        console.error(
          "Holiday CSV preview failed:",
          error
        );

        setImportError(
          error.response?.data?.message ||
          "Failed to preview CSV file."
        );

      } finally {

        setImportLoading(false);
      }
    };

      const handleHolidayImport =
    async () => {

      if (!importCountryId) {

        setImportError(
          "Please select a country."
        );

        return;
      }

      if (!importFile) {

        setImportError(
          "Please select a CSV file."
        );

        return;
      }

      if (
        importPreview &&
        importPreview.errorRows > 0
      ) {

        setImportError(
          "Please fix the CSV errors before importing."
        );

        return;
      }

      if (
        importMode === "REPLACE"
      ) {

        const confirmed =
          window.confirm(
            `This will replace all existing holidays for ${importPreview?.countryName || "the selected country"} in ${importYear}. Do you want to continue?`
          );

        if (!confirmed) {
          return;
        }
      }

      setImportLoading(true);
      setImportError("");
      setImportMessage("");

      try {

        const formData =
          new FormData();

        formData.append(
          "countryId",
          importCountryId
        );

        formData.append(
          "year",
          importYear
        );

        formData.append(
          "importMode",
          importMode
        );

        formData.append(
          "file",
          importFile
        );

        await holidayService
          .importHolidays(
            formData
          );

        toast.success(
          "Holidays imported successfully"
        );

        setImportMessage(
          "Holidays imported successfully."
        );

        setImportPreview(null);
        setImportFile(null);

        loadHolidays();

      } catch(error) {

        console.error(
          "Holiday CSV import failed:",
          error
        );

        setImportError(
          error.response?.data?.message ||
          "Failed to import holidays."
        );

      } finally {

        setImportLoading(false);
      }
    };

  const deleteHoliday =
    async (id) => {

      if(
        !window.confirm(
          "Delete Holiday?"
        )
      ) {
        return;
      }

      await holidayService
        .delete(id);

      toast.success(
        "Holiday Deleted"
      );

      loadHolidays();
    };

  const resetForm =
    () => {

      setEditingId(null);

      setForm({

        holidayName: "",

        holidayDate: "",

        holidayType: "PUBLIC",

        countryId: "",

        isGlobal: false,

        description: ""

      });
    };

  return (

    <DashboardLayout>

<div className={`rounded-xl shadow p-3 sm:p-6 border ${cardClass} ${textClass}`}>

<h1 className={`text-2xl font-bold mb-6 ${textClass}`}>
  Holiday Management
</h1>

        {/* CSV IMPORT */}

      <div
  className={`mb-6 sm:mb-8 border rounded-xl p-4 sm:p-5 ${
    isDark
      ? "bg-slate-900 border-slate-700"
      : "bg-slate-50 border-gray-200"
  }`}
>

<h2 className={`text-lg font-semibold mb-4 ${textClass}`}>
  Import Holidays from CSV
</h2>

          <div className="grid md:grid-cols-4 gap-4">

            {/* COUNTRY */}

            <select
              value={importCountryId}
              onChange={(e) => {
                setImportCountryId(
                  e.target.value
                );

                setImportPreview(null);
                setImportError("");
                setImportMessage("");
              }}
     className={fieldClass}
            >

              <option value="">
                Select Country
              </option>

              {countries.map(
                country => (

                  <option
                    key={country.id}
                    value={country.id}
                  >
                    {country.countryName}
                  </option>

                )
              )}

            </select>

            {/* YEAR */}

            <input
              type="number"
              value={importYear}
              onChange={(e) => {
                setImportYear(
                  e.target.value
                );

                setImportPreview(null);
                setImportError("");
                setImportMessage("");
              }}
              min="2000"
              max="2100"
         className={fieldClass}
              placeholder="Year"
            />

            {/* IMPORT MODE */}

            <select
              value={importMode}
              onChange={(e) => {
                setImportMode(
                  e.target.value
                );

                setImportPreview(null);
                setImportError("");
                setImportMessage("");
              }}
         className={fieldClass}
            >

              <option value="ADD">
                Add - Keep Existing
              </option>

              <option value="REPLACE">
                Replace - Selected Country & Year
              </option>

            </select>

            {/* FILE */}

            <input
              type="file"
              accept=".csv"
              onChange={(e) => {

                setImportFile(
                  e.target.files?.[0] || null
                );

                setImportPreview(null);
                setImportError("");
                setImportMessage("");

              }}
className={fieldClass}
            />

          </div>

          {/* HELP TEXT */}

<p className={`text-sm mt-3 ${mutedTextClass}`}>

            CSV columns:
            <span className="font-medium">
              {" "}
              holidayName, holidayDate,
              holidayType, description
            </span>

          </p>

          {/* REPLACE WARNING */}

          {importMode === "REPLACE" && (

            <div className={`mt-4 p-3 rounded border text-sm ${
  isDark
    ? "bg-amber-950/40 border-amber-800 text-amber-200"
    : "bg-amber-50 border-amber-200 text-amber-800"
}`}>

              <strong>
                Replace mode:
              </strong>{" "}

              Existing holidays for the selected
              country and year will be removed before
              the CSV holidays are imported.

            </div>

          )}

          {/* ERROR */}

          {importError && (

            <div cclassName={`mt-4 p-3 rounded border ${
  isDark
    ? "bg-red-950/40 border-red-800 text-red-200"
    : "bg-red-50 border-red-200 text-red-700"
}`}>

              {importError}

            </div>

          )}

          {/* SUCCESS */}

          {importMessage && (

            <div className={`mt-4 p-3 rounded border ${
  isDark
    ? "bg-green-950/40 border-green-800 text-green-200"
    : "bg-green-50 border-green-200 text-green-700"
}`}>

              {importMessage}

            </div>

          )}

          {/* PREVIEW BUTTON */}

          <div className="mt-4">

            <button
              type="button"
              onClick={
                handleHolidayImportPreview
              }
              disabled={importLoading}
              className="
                bg-violet-600
                text-white
                px-5
                py-2
                rounded
                disabled:opacity-50
              "
            >

              {importLoading
                ? "Processing..."
                : "Preview CSV"}

            </button>

          </div>

        </div>

                {/* CSV PREVIEW */}

        {importPreview && (

<div className={`mb-6 sm:mb-8 border rounded-xl p-4 sm:p-5 ${cardClass}`}>

            <div className="flex items-center justify-between mb-4">

              <div>

<h2 className={`text-lg font-semibold ${textClass}`}>
  CSV Import Preview
</h2>

<p className={`text-sm ${mutedTextClass}`}>
  {importPreview.countryName}
  {" - "}
  {importPreview.year}
  {" - "}
  {importPreview.importMode}
</p>

              </div>

            </div>

            {/* SUMMARY */}

            <div className="
              grid
              grid-cols-2
              md:grid-cols-4
              gap-4
              mb-5
            ">

<div
  className={`rounded-lg p-4 ${
    isDark ? "bg-slate-700" : "bg-slate-100"
  }`}
>
  <p className={`text-sm ${mutedTextClass}`}>
    Total Rows
  </p>

  <p className={`text-2xl font-bold ${textClass}`}>
    {importPreview.totalRows}
  </p>
</div>

              <div className={`rounded-lg p-4 ${
  isDark
    ? "bg-green-950/40 border border-green-900"
    : "bg-green-50"
}`}>

                <p className="text-sm text-green-700">
                  Valid
                </p>

                <p className="text-2xl font-bold text-green-700">
                  {importPreview.validRows}
                </p>

              </div>

              <div className={`rounded-lg p-4 ${
  isDark
    ? "bg-amber-950/40 border border-amber-900"
    : "bg-amber-50"
}`}>

                <p className="text-sm text-amber-700">
                  Duplicate
                </p>

                <p className="text-2xl font-bold text-amber-700">
                  {importPreview.duplicateRows}
                </p>

              </div>

              <div className={`rounded-lg p-4 ${
  isDark
    ? "bg-red-950/40 border border-red-900"
    : "bg-red-50"
}`}>

                <p className="text-sm text-red-700">
                  Errors
                </p>

                <p className="text-2xl font-bold text-red-700">
                  {importPreview.errorRows}
                </p>

              </div>

            </div>

            {/* ROW DETAILS */}

            <div className={`overflow-x-auto border rounded-lg ${
  isDark ? "border-slate-700" : "border-gray-200"
}`}>

              <table className="w-full text-sm">

                <thead>

               <tr className={tableHeaderClass}>

                    <th className="p-3 text-left">
                      Row
                    </th>

                    <th className="p-3 text-left">
                      Holiday
                    </th>

                    <th className="p-3 text-left">
                      Date
                    </th>

                    <th className="p-3 text-left">
                      Type
                    </th>

                    <th className="p-3 text-left">
                      Status
                    </th>

                    <th className="p-3 text-left">
                      Message
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {importPreview.rows?.map(
                    (row) => (

                      <tr
                        key={row.rowNumber}
                     className={tableRowClass}
                      >

                        <td className="p-3">
                          {row.rowNumber}
                        </td>

                        <td className="p-3">
                          {row.holidayName}
                        </td>

                        <td className="p-3">
                          {row.holidayDate}
                        </td>

                        <td className="p-3">
                          {row.holidayType}
                        </td>

                        <td className="p-3">

                          <span
                            className={
                              row.status === "VALID"
                                ? "text-green-700 font-semibold"
                                : row.status === "DUPLICATE"
                                ? "text-amber-700 font-semibold"
                                : "text-red-700 font-semibold"
                            }
                          >
                            {row.status}
                          </span>

                        </td>

                        <td className="p-3">
                          {row.message}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

 {/* IMPORT BUTTON */}

            {importPreview.errorRows === 0 && (
              <div className="mt-5 flex justify-end">

                <button
                  type="button"
                  onClick={handleHolidayImport}
                  disabled={importLoading}
                  className="
                    bg-green-600
                    text-white
                    px-5
                    py-2
                    rounded
                    disabled:opacity-50
                  "
                >

                  {importLoading
                    ? "Importing..."
                    : "Import Holidays"}

                </button>

              </div>
            )}
          </div>

        )}
           
        
        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-4 mb-8"
        >

          <input
            name="holidayName"
            placeholder="Holiday Name"
            value={form.holidayName}
            onChange={handleChange}
          className={fieldClass}
            required
          />

          <input
            type="date"
            name="holidayDate"
            value={form.holidayDate}
            onChange={handleChange}
     className={fieldClass}
            required
          />

          <select
            name="holidayType"
            value={form.holidayType}
            onChange={handleChange}
       className={fieldClass}
          >

            <option value="PUBLIC">
              Public
            </option>

            <option value="BANK">
              Bank
            </option>

          </select>

          {!form.isGlobal && (

            <select
              name="countryId"
              value={form.countryId}
              onChange={handleChange}
        className={fieldClass}
            >

              <option value="">
                Select Country
              </option>

              {countries.map(
                country => (

                <option
                  key={country.id}
                  value={country.id}
                >
                  {country.countryName}
                </option>

              ))}

            </select>

          )}

          <div className="md:col-span-2">

       <label
  className={`flex gap-2 ${
    isDark ? "text-slate-200" : "text-slate-800"
  }`}
>

              <input
                type="checkbox"
                name="isGlobal"
                checked={form.isGlobal}
                onChange={handleChange}
              />

              Global Holiday

            </label>

          </div>

          <textarea
            rows="3"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
           className={`${fieldClass} md:col-span-2`}
          />

          <button
            className="
            bg-violet-600
            text-white
            p-3
            rounded
            "
          >
            {editingId
              ? "Update Holiday"
              : "Add Holiday"}
          </button>

        </form>

        {/* TABLE */}

        <DataGrid
        bare
        rows={holidays}
        searchPlaceholder="Search holiday, date, country..."
        defaultSort={{ key: "holidayDate", dir: "asc" }}
        actionWidth={150}
        renderActions={(holiday) => (
          <>
            <button
              type="button"
              onClick={() => editHoliday(holiday)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-[13px]"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => deleteHoliday(holiday.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-[13px]"
            >
              Delete
            </button>
          </>
        )}
        columns={[
          { key: "holidayName", label: "Holiday", width: 220, filter: "text", get: (h) => h.holidayName || "" },
          { key: "holidayDate", label: "Date", width: 130, filter: "text", get: (h) => h.holidayDate || "" },
          { key: "holidayType", label: "Type", width: 120, filter: "select", get: (h) => h.holidayType || "" },
          { key: "countryName", label: "Country", width: 150, filter: "select", get: (h) => h.countryName || "" },
          { key: "isGlobal", label: "Global", width: 100, filter: "select", get: (h) => (h.isGlobal ? "Yes" : "No") },
        ]}
      />

      </div>

    </DashboardLayout>
  );
}