import { useEffect, useState } from "react";
import {
    ArrowLeft,
    CheckCircle,
    AlertTriangle,
    Target,
    Loader2,
    User,
    CalendarDays
} from "lucide-react";

import {
    getAppraisal,
    getGoalsByAppraisal,
    approveGoals,
    requestGoalRevision,
    getManagerReview,
    saveManagerReview,
    submitManagerReview,
    startManagerReview
} from "../services/appraisalService";

import AppraisalDocuments
    from "../components/AppraisalDocuments";
import ManagerReviewForm
    from "../components/ManagerReviewForm";

import AppraisalStatusBadge from "../components/AppraisalStatusBadge";

const ManagerAppraisalReview = () => {

    const appraisalId =
        Number(
            window.location.pathname.split("/").pop()
        );

    const [appraisal, setAppraisal] = useState(null);
    const [goals, setGoals] = useState([]);

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [managerReview, setManagerReview] = useState(null);
const [reviewLoading, setReviewLoading] = useState(false);
const [reviewSaving, setReviewSaving] = useState(false);
const [reviewSubmitting, setReviewSubmitting] = useState(false);

const loadManagerReview = async () => {
    if (!appraisalId) {
        return;
    }

    try {
        setReviewLoading(true);

        const data = await getManagerReview(
            Number(appraisalId)
        );

        setManagerReview(data);

    } catch (err) {
        console.error(err);

        // A review may not exist yet.
        setManagerReview(null);

    } finally {
        setReviewLoading(false);
    }
};


const handleStartManagerReview = async () => {

    try {

        setError("");
        setSuccess("");

        await startManagerReview(
            Number(appraisalId)
        );

        setSuccess(
            "Manager review started successfully."
        );

    await loadData();

    } catch (err) {

        console.error(err);

        setError(
            err?.response?.data?.message ||
            "Unable to start manager review."
        );
    }
};

const handleSaveManagerReview = async (data) => {

    try {

        setReviewSaving(true);
        setError("");
        setSuccess("");

        const saved = await saveManagerReview({
            appraisalId: Number(appraisalId),
            overallRating: Number(data.overallRating),
            overallComments: data.overallComments
        });

        setManagerReview(saved);

        setSuccess(
            "Manager review saved successfully."
        );

    } catch (err) {

        console.error(err);

        setError(
            err?.response?.data?.message ||
            "Unable to save manager review."
        );

    } finally {

        setReviewSaving(false);
    }
};

const handleSubmitManagerReview = async (data) => {

    if (!window.confirm(
        "Once submitted, the manager review cannot be edited. Continue?"
    )) {
        return;
    }

    try {

        setReviewSubmitting(true);
        setError("");
        setSuccess("");

        // Save latest values first
        await saveManagerReview({
            appraisalId: Number(appraisalId),
            overallRating: Number(data.overallRating),
            overallComments: data.overallComments
        });

        await submitManagerReview(
            Number(appraisalId)
        );

        setSuccess(
            "Manager review submitted successfully."
        );

       await loadData();

        await loadManagerReview();

    } catch (err) {

        console.error(err);

        setError(
            err?.response?.data?.message ||
            "Unable to submit manager review."
        );

    } finally {

        setReviewSubmitting(false);
    }
};

    useEffect(() => {
        loadData();
    }, [appraisalId]);

    const loadData = async () => {

    try {

        setLoading(true);
        setError("");

        const [
            appraisalData,
            goalsData
        ] = await Promise.all([
            getAppraisal(appraisalId),
            getGoalsByAppraisal(appraisalId)
        ]);

        setAppraisal(appraisalData);
        setGoals(goalsData || []);

        // Load existing manager review if available
        if (
            appraisalData.status === "MANAGER_REVIEW" ||
            appraisalData.status === "MANAGER_SUBMITTED"
        ) {
            await loadManagerReview();
        }

    } catch (err) {

        console.error(err);

        setError(
            err?.response?.data?.message ||
            "Unable to load appraisal."
        );

    } finally {

        setLoading(false);
    }
};

    const handleApprove = async () => {

        const confirmed = window.confirm(
            "Are you sure you want to approve these goals?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setProcessing(true);
            setError("");
            setSuccess("");

            await approveGoals(appraisalId);

            setSuccess(
                "Goals approved successfully."
            );

            await loadData();

        } catch (err) {

            console.error(err);

            setError(
                err?.response?.data?.message ||
                "Unable to approve goals."
            );

        } finally {

            setProcessing(false);

        }
    };

    const handleRevision = async () => {

        const confirmed = window.confirm(
            "Send these goals back to the employee for revision?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setProcessing(true);
            setError("");
            setSuccess("");

            await requestGoalRevision(
                appraisalId
            );

            setSuccess(
                "Goal revision has been requested."
            );

            await loadData();

        } catch (err) {

            console.error(err);

            setError(
                err?.response?.data?.message ||
                "Unable to request goal revision."
            );

        } finally {

            setProcessing(false);

        }
    };

    const totalWeight = goals.reduce(
        (sum, goal) =>
            sum + Number(goal.weight || 0),
        0
    );

    const canReview =
        appraisal?.status === "GOALS_SUBMITTED";

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (!appraisal) {
        return (
            <div className="p-4 sm:p-6">

                <div className="p-4 sm:p-5 rounded-xl bg-red-50 text-red-700">
                    Appraisal not found.
                </div>

            </div>
        );
    }

    return (
        <div className="p-0 sm:p-6 flex flex-col gap-4 sm:gap-6">

            {/* Back */}
            <button
                onClick={() => {
                    window.location.href =
                        "/manager/appraisals";
                }}
                className="hidden order-[-3] self-start inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-violet-600"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Appraisals
            </button>


            {/* Header */}
            <div className="order-[-3] flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        Appraisal Review
                    </h1>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Review employee goals and provide your decision.
                    </p>

                </div>

                <div className="self-start"><AppraisalStatusBadge status={appraisal.status} /></div>

            </div>


            {/* Messages */}
            {error && (
                <div className="order-[-3] flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">

                    <AlertTriangle className="w-5 h-5" />

                    {error}

                </div>
            )}

            {success && (
                <div className="order-[-3] flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300">

                    <CheckCircle className="w-5 h-5" />

                    {success}

                </div>
            )}


            {/* Employee / cycle information */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-semibold">
            {(appraisal.employeeName || "E")
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((w) => w[0].toUpperCase())
              .join("")}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">Employee</p>
            <p className="font-semibold text-gray-900 dark:text-white truncate">
              {appraisal.employeeName || `Employee #${appraisal.employeeId}`}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <CalendarDays className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{appraisal.cycleName}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4 keep-grid">
          <div className="rounded-xl bg-purple-50 dark:bg-purple-900/20 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-300">
              Goals
            </p>
            <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
              {goals.length}
            </p>
          </div>
          <div className="rounded-xl bg-green-50 dark:bg-green-900/20 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-green-600 dark:text-green-300">
              Goal Weight
            </p>
            <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
              {totalWeight}%
            </p>
          </div>
        </div>
      </div>

      {/* Goals */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">

                <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">

                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Employee Goals
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Review the goals submitted by the employee.
                    </p>

                </div>


                {goals.length === 0 ? (

                    <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                        No goals found.
                    </div>

                ) : (

                    <div className="p-3 sm:p-5 space-y-3">
            {goals.map((goal, index) => (
              <div
                key={goal.id}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 text-sm font-semibold">
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white break-words">
                      {goal.title}
                    </h3>
                    {goal.description && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 break-words">
                        {goal.description}
                      </p>
                    )}
                  </div>

                  <span className="shrink-0 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-semibold">
                    {goal.weight}%
                  </span>
                </div>

                <div className="mt-3">
                  <div className="inline-block">
                    <AppraisalStatusBadge status={goal.status} />
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 keep-grid">
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-700/40 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Target
                    </p>
                    <p className="mt-1 text-sm text-gray-800 dark:text-gray-200 break-words">
                      {goal.target || "-"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-700/40 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Measurement / KPI
                    </p>
                    <p className="mt-1 text-sm text-gray-800 dark:text-gray-200 break-words">
                      {goal.measurement || "-"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

                )}

            </div>

                        {/* Employee Supporting Documents */}
<AppraisalDocuments
  appraisalId={appraisalId}
  canUpload={false}
  canDelete={false}
/>

            {/* Manager Review */}

{appraisal?.status === "EMPLOYEE_SUBMITTED" && (
    <div className="order-[-2] bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Manager Review
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Employee has submitted the self-review. Start your manager assessment.
                </p>
            </div>

            <button
                onClick={handleStartManagerReview}
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium"
            >
                Start Manager Review
            </button>

        </div>

    </div>
)}

{appraisal?.status === "MANAGER_REVIEW" && (
    <div>

        <ManagerReviewForm
            review={managerReview}
            onSave={handleSaveManagerReview}
            onSubmit={handleSubmitManagerReview}
            saving={reviewSaving}
            submitting={reviewSubmitting}
        />

    </div>
)}

{appraisal?.status === "MANAGER_SUBMITTED" && (
    <div className="order-[-2] bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 sm:p-5">

        <h2 className="text-lg font-semibold text-green-800 dark:text-green-300">
            Manager Review Submitted
        </h2>

        <p className="text-sm text-green-700 dark:text-green-400 mt-1">
            The manager review has been submitted and is now ready for HR review.
        </p>

    </div>
)}


            {/* Decision */}
            {canReview && (
                <div className="order-[-2] bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5">

                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Manager Decision
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Choose whether to approve the goals or request changes.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-5">

                        <button
                            onClick={handleRevision}
                            disabled={processing}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900/20 disabled:opacity-50"
                        >

                            {processing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <AlertTriangle className="w-4 h-4" />
                            )}

                            Request Revision

                        </button>


                        <button
                            onClick={handleApprove}
                            disabled={processing}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400"
                        >

                            {processing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <CheckCircle className="w-4 h-4" />
                            )}

                            Approve Goals

                        </button>

                    </div>

                </div>
            )}

        </div>
    );
};

export default ManagerAppraisalReview;