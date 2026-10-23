import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAppraisal,
  getGoalsByAppraisal,
  getEmployeeReview,
  getManagerReview,
  getHrReview,
  startHrReview,
  saveHrReview,
  submitHrReview,
  finalizeHrReview,
} from "../services/appraisalService";
import HrReviewForm from "../components/HrReviewForm";

import AppraisalDocuments
    from "../components/AppraisalDocuments";

const AdminAppraisalReview = () => {
  const { appraisalId } = useParams();
  const navigate = useNavigate();

  const [appraisal, setAppraisal] = useState(null);
  const [goals, setGoals] = useState([]);
  const [employeeReview, setEmployeeReview] = useState(null);
  const [managerReview, setManagerReview] = useState(null);
  const [hrReview, setHrReview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [finalizing, setFinalizing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const appraisalData = await getAppraisal(appraisalId);
      setAppraisal(appraisalData);

      const goalsData = await getGoalsByAppraisal(appraisalId);
      setGoals(goalsData || []);

      try {
        const employeeData =
          await getEmployeeReview(appraisalId);
        setEmployeeReview(employeeData);
      } catch {
        setEmployeeReview(null);
      }

      try {
        const managerData =
          await getManagerReview(appraisalId);
        setManagerReview(managerData);
      } catch {
        setManagerReview(null);
      }

      if (
        appraisalData.status === "HR_REVIEW" ||
        appraisalData.status === "HR_SUBMITTED" ||
        appraisalData.status === "FINALIZED"
      ) {
        await loadHrReview();
      }
    } catch (error) {
      console.error(
        "Failed to load appraisal:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to load appraisal."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadHrReview = async () => {
    try {
      setReviewLoading(true);

      const data = await getHrReview(appraisalId);

      setHrReview(data);
    } catch (error) {
      console.error(
        "Failed to load HR review:",
        error
      );

      setHrReview(null);
    } finally {
      setReviewLoading(false);
    }
  };

  useEffect(() => {
    if (appraisalId) {
      loadData();
    }
  }, [appraisalId]);

  const handleStartHrReview = async () => {
    try {
      setReviewLoading(true);

      await startHrReview(appraisalId);

      await loadData();
    } catch (error) {
      console.error(
        "Failed to start HR review:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to start HR review."
      );
    } finally {
      setReviewLoading(false);
    }
  };

  const handleSaveHrReview = async (data) => {
    try {
      setSaving(true);

      await saveHrReview({
        appraisalId: Number(appraisalId),
        finalRating: Number(data.finalRating),
        performanceCategory:
          data.performanceCategory,
        comments: data.comments,
      });

      await loadHrReview();

      alert("HR review draft saved successfully.");
    } catch (error) {
      console.error(
        "Failed to save HR review:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to save HR review."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitHrReview = async (data) => {
    try {
      setSubmitting(true);

      await saveHrReview({
        appraisalId: Number(appraisalId),
        finalRating: Number(data.finalRating),
        performanceCategory:
          data.performanceCategory,
        comments: data.comments,
      });

      await submitHrReview(appraisalId);

      await loadData();

      alert("HR review submitted successfully.");
    } catch (error) {
      console.error(
        "Failed to submit HR review:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to submit HR review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalize = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to finalize this appraisal? This action completes the appraisal."
    );

    if (!confirmed) {
      return;
    }

    try {
      setFinalizing(true);

      await finalizeHrReview(appraisalId);

      await loadData();

      alert("Appraisal finalized successfully.");
    } catch (error) {
      console.error(
        "Failed to finalize appraisal:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to finalize appraisal."
      );
    } finally {
      setFinalizing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 text-gray-600 dark:text-gray-300">
        Loading appraisal...
      </div>
    );
  }

  if (!appraisal) {
    return (
      <div className="p-4 sm:p-6">
        <p className="text-red-600">
          Appraisal not found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-0 sm:p-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            HR / Admin Appraisal Review
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Final appraisal review and completion
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/admin/appraisals")
          }
          className="hidden rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Back
        </button>
      </div>

      {/* Employee Information */}
      <div className="rounded-xl border bg-white p-4 sm:p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Employee Information
        </h2>

        <div className="appr-summary grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 keep-grid">

          <div>
            <p className="text-xs text-gray-500">
              Employee
            </p>

            <p className="font-medium text-gray-900 dark:text-white">
              {appraisal.employeeName ||
                appraisal.employeeId}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Manager
            </p>

            <p className="font-medium text-gray-900 dark:text-white">
              {appraisal.managerName ||
                appraisal.managerId ||
                "Not assigned"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Status
            </p>

            <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              {appraisal.status}
            </span>
          </div>

        </div>
      </div>

      {/* Goals */}
      <div className="rounded-xl border bg-white p-4 sm:p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Employee Goals
        </h2>

        {goals.length === 0 ? (
          <p className="text-sm text-gray-500">
            No goals found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="px-3 py-3 text-left">
                    Goal
                  </th>

                  <th className="px-3 py-3 text-left">
                    Category
                  </th>

                  <th className="px-3 py-3 text-left">
                    Weight
                  </th>

                  <th className="px-3 py-3 text-left">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {goals.map((goal) => (
                  <tr
                    key={goal.id}
                    className="border-b dark:border-gray-700"
                  >
                    <td className="px-3 py-3">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {goal.title}
                      </p>

                      {goal.description && (
                        <p className="mt-1 text-xs text-gray-500">
                          {goal.description}
                        </p>
                      )}
                    </td>

                    <td className="px-3 py-3">
                      {goal.category || "-"}
                    </td>

                    <td className="px-3 py-3">
                      {goal.weight ?? 0}%
                    </td>

                    <td className="px-3 py-3">
                      {goal.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Employee Review */}
      <div className="rounded-xl border bg-white p-4 sm:p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Employee Self Review
        </h2>

        {employeeReview ? (
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">
                Rating
              </p>

              <p className="font-medium text-gray-900 dark:text-white">
                {employeeReview.overallRating ?? "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Comments
              </p>

              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {employeeReview.overallComments ||
                  "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Status
              </p>

              <p className="font-medium">
                {employeeReview.status}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Employee review not available.
          </p>
        )}
      </div>

      {/* Manager Review */}
      <div className="rounded-xl border bg-white p-4 sm:p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Manager Review
        </h2>

        {managerReview ? (
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">
                Rating
              </p>

              <p className="font-medium text-gray-900 dark:text-white">
                {managerReview.overallRating ?? "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Comments
              </p>

              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {managerReview.overallComments ||
                  "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Status
              </p>

              <p className="font-medium">
                {managerReview.status}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Manager review not available.
          </p>
        )}
      </div>

<AppraisalDocuments
  appraisalId={appraisalId}
  canUpload={false}
  canDelete={false}
/>

      {/* HR Review */}
      {reviewLoading ? (
        <div className="rounded-xl border bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
          Loading HR review...
        </div>
      ) : appraisal.status === "MANAGER_SUBMITTED" ? (
        <div className="rounded-xl border bg-white p-4 sm:p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            HR / Admin Review
          </h2>

          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            The manager has submitted the appraisal. Start the
            HR review to continue.
          </p>

          <button
            type="button"
            onClick={handleStartHrReview}
            disabled={reviewLoading}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {reviewLoading
              ? "Starting..."
              : "Start HR Review"}
          </button>
        </div>
      ) : (
        <HrReviewForm
          review={hrReview}
          onSave={handleSaveHrReview}
          onSubmit={handleSubmitHrReview}
          onFinalize={handleFinalize}
          saving={saving}
          submitting={submitting}
          finalizing={finalizing}
        />
      )}

    </div>
  );
};

export default AdminAppraisalReview;