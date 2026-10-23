import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Loader2,
    Save,
    Send
} from "lucide-react";

import {
    getAppraisal,
    getGoalsByAppraisal,
    getEmployeeReview,
    saveEmployeeReview,
    submitEmployeeReview
} from "../services/appraisalService";

import AppraisalStatusBadge from "../components/AppraisalStatusBadge";

const EmployeeSelfReview = () => {

    const { appraisalId: appraisalIdParam } = useParams();

    const appraisalId = Number(appraisalIdParam);

    const navigate = useNavigate();

    const [appraisal, setAppraisal] = useState(null);
    const [goals, setGoals] = useState([]);

    const [rating, setRating] = useState("");
    const [comments, setComments] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadData();
    }, [appraisalId]);

    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                appraisalData,
                goalsData,
                reviewData
            ] = await Promise.all([
                getAppraisal(appraisalId),
                getGoalsByAppraisal(appraisalId),
                getEmployeeReview(appraisalId)
            ]);

            setAppraisal(appraisalData);
            setGoals(goalsData || []);

            if (reviewData) {

                setRating(
                    reviewData.overallRating
                        ? String(reviewData.overallRating)
                        : ""
                );

                setComments(
                    reviewData.overallComments || ""
                );
            }

        } catch (err) {

            console.error(err);

            setError(
                err?.response?.data?.message ||
                "Unable to load self review."
            );

        } finally {

            setLoading(false);

        }
    };

    const handleSave = async () => {

        if (!rating) {
            setError("Please select an overall rating.");
            return;
        }

        try {

            setSaving(true);
            setError("");
            setSuccess("");

await saveEmployeeReview({
    appraisalId: Number(appraisalId),
    overallRating: Number(rating),
    overallComments: comments.trim()
});

            setSuccess(
                "Self review saved successfully."
            );

        } catch (err) {

            console.error(err);

            setError(
                err?.response?.data?.message ||
                "Unable to save self review."
            );

        } finally {

            setSaving(false);

        }
    };

    const handleSubmit = async () => {

        if (!rating) {
            setError("Please select an overall rating.");
            return;
        }

        if (!comments.trim()) {
            setError("Please enter your overall comments.");
            return;
        }

        const confirmed = window.confirm(
            "Once submitted, your self review will be sent to your manager. Continue?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setSubmitting(true);
            setError("");
            setSuccess("");

await saveEmployeeReview({
    appraisalId: Number(appraisalId),
    overallRating: Number(rating),
    overallComments: comments.trim()
});

            await submitEmployeeReview(
                appraisalId
            );

            setSuccess(
                "Self review submitted successfully."
            );

            await loadData();

        } catch (err) {

            console.error(err);

            setError(
                err?.response?.data?.message ||
                "Unable to submit self review."
            );

        } finally {

            setSubmitting(false);

        }
    };

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
        <div className="p-0 sm:p-6 space-y-4 sm:space-y-6">

            <button
                type="button"
                onClick={() =>
                    navigate("/employee/appraisal")
                }
                className="hidden inline-flex items-center gap-2 text-sm text-gray-600 hover:text-violet-600"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Appraisal
            </button>

            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Self Review
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Complete your performance self-assessment.
                    </p>
                </div>

                <AppraisalStatusBadge
                    status={appraisal.status}
                />

            </div>

            {error && (
                <div className="p-4 rounded-lg bg-red-50 text-red-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-4 rounded-lg bg-green-50 text-green-700">
                    {success}
                </div>
            )}

            {/* Goals Summary */}

            <div className="bg-white rounded-xl border border-gray-200">

                <div className="p-4 sm:p-5 border-b">

                    <h2 className="font-semibold text-gray-900">
                        Performance Goals
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Review your progress before completing the self review.
                    </p>

                </div>

                <div className="divide-y">

                    {goals.map((goal) => (

                        <div
                            key={goal.id}
                            className="p-4 sm:p-5"
                        >

                            <div className="flex justify-between">

                                <div>

                                    <p className="font-medium">
                                        {goal.title}
                                    </p>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {goal.description}
                                    </p>

                                </div>

                                <div className="text-right">

                                    <p className="text-sm font-semibold">
                                        {goal.progressPercentage || 0}%
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Weight {goal.weight}%
                                    </p>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

            {/* Review */}

            <div className="bg-white rounded-xl border border-gray-200">

                <div className="p-4 sm:p-5 border-b">

                    <h2 className="font-semibold text-gray-900">
                        Overall Self Assessment
                    </h2>

                </div>

                <div className="p-4 sm:p-5 space-y-5">

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Overall Rating
                        </label>

                        <select
                            value={rating}
                            onChange={(e) =>
                                setRating(e.target.value)
                            }
                            className="w-full px-3 py-2 border rounded-lg"
                        >

                            <option value="">
                                Select rating
                            </option>

                            <option value="1">
                                1 - Needs Significant Improvement
                            </option>

                            <option value="2">
                                2 - Needs Improvement
                            </option>

                            <option value="3">
                                3 - Meets Expectations
                            </option>

                            <option value="4">
                                4 - Exceeds Expectations
                            </option>

                            <option value="5">
                                5 - Outstanding
                            </option>

                        </select>

                    </div>

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Overall Comments
                        </label>

                        <textarea
                            value={comments}
                            onChange={(e) =>
                                setComments(e.target.value)
                            }
                            rows={6}
                            placeholder="Describe your achievements, contributions, challenges and development areas..."
                            className="w-full px-3 py-2 border rounded-lg"
                        />

                    </div>

                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving || submitting}
                            className="inline-flex items-center gap-2 px-5 py-2.5 border rounded-lg"
                        >
                            <Save className="w-4 h-4" />
                            {saving
                                ? "Saving..."
                                : "Save Draft"}
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={saving || submitting}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-lg"
                        >
                            <Send className="w-4 h-4" />
                            {submitting
                                ? "Submitting..."
                                : "Submit Self Review"}
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default EmployeeSelfReview;