import { useEffect, useState } from "react";
import {
    Plus,
    Send,
    Pencil,
    Trash2,
    Target,
    CalendarDays,
    User,
    Loader2,
    AlertCircle,
    TrendingUp
} from "lucide-react";

import {
    getMyAppraisals,
    getGoalsByAppraisal,
    createGoal,
    updateGoal,
    deleteGoal,
    submitGoals,
    startSelfReview
} from "../services/appraisalService";

import { useNavigate } from "react-router-dom";

import AppraisalStatusBadge from "../components/AppraisalStatusBadge";
import GoalForm from "../components/GoalForm";

import AppraisalDocuments from "../components/AppraisalDocuments";



const EmployeeAppraisal = () => {

    const [appraisals, setAppraisals] = useState([]);
    const [selectedAppraisal, setSelectedAppraisal] = useState(null);
    const [goals, setGoals] = useState([]);

    const [loading, setLoading] = useState(true);
    const [goalsLoading, setGoalsLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [showGoalForm, setShowGoalForm] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadAppraisals();
    }, []);

    const loadAppraisals = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMyAppraisals();

            setAppraisals(data || []);

            if (data && data.length > 0) {
                await selectAppraisal(data[0]);
            }

        } catch (err) {
            console.error(err);

            setError(
                err?.response?.data?.message ||
                "Unable to load appraisal details."
            );

        } finally {
            setLoading(false);
        }
    };

    const navigate = useNavigate();
   const handleStartSelfReview = async () => {
    if (!selectedAppraisal) {
        return;
    }

    try {
        setError("");
        setSuccess("");

        await startSelfReview(selectedAppraisal.id);

        setSuccess("Self review started successfully.");

        await loadAppraisals();
    } catch (err) {
        console.error(err);

        setError(
            err?.response?.data?.message ||
            "Unable to start self review."
        );
    }
};

    const selectAppraisal = async (appraisal) => {

        try {
            setSelectedAppraisal(appraisal);
            setGoalsLoading(true);
            setError("");

            const data = await getGoalsByAppraisal(
                appraisal.id
            );

            setGoals(data || []);

        } catch (err) {
            console.error(err);

            setError(
                err?.response?.data?.message ||
                "Unable to load appraisal goals."
            );

        } finally {
            setGoalsLoading(false);
        }
    };

    const handleSaveGoal = async (goalData) => {

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            if (editingGoal) {

                await updateGoal(
                    editingGoal.id,
                    goalData
                );

                setSuccess(
                    "Goal updated successfully."
                );

            } else {

                await createGoal({
                    ...goalData,
                    appraisalId:
                        selectedAppraisal.id
                });

                setSuccess(
                    "Goal added successfully."
                );
            }

            setShowGoalForm(false);
            setEditingGoal(null);

            await selectAppraisal(
                selectedAppraisal
            );

        } catch (err) {
            console.error(err);

            setError(
                err?.response?.data?.message ||
                "Unable to save goal."
            );

        } finally {
            setSaving(false);
        }
    };

    const handleDeleteGoal = async (goalId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this goal?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setError("");
            setSuccess("");

            await deleteGoal(goalId);

            setSuccess(
                "Goal deleted successfully."
            );

            await selectAppraisal(
                selectedAppraisal
            );

        } catch (err) {
            console.error(err);

            setError(
                err?.response?.data?.message ||
                "Unable to delete goal."
            );
        }
    };

    const handleSubmitGoals = async () => {

        if (!selectedAppraisal) {
            return;
        }

        if (goals.length === 0) {
            setError(
                "Please add at least one goal before submitting."
            );
            return;
        }

        const totalWeight = goals.reduce(
            (sum, goal) =>
                sum + Number(goal.weight || 0),
            0
        );

        if (Math.abs(totalWeight - 100) > 0.01) {
            setError(
                `Goal weight must equal 100%. Current total: ${totalWeight}%`
            );
            return;
        }

        const confirmed = window.confirm(
            "Once submitted, your goals will be sent to your manager for review. Continue?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setSaving(true);
            setError("");
            setSuccess("");

            await submitGoals(
                selectedAppraisal.id
            );

            setSuccess(
                "Goals submitted successfully."
            );

            await loadAppraisals();

        } catch (err) {
            console.error(err);

            setError(
                err?.response?.data?.message ||
                "Unable to submit goals."
            );

        } finally {
            setSaving(false);
        }
    };

    const totalWeight = goals.reduce(
        (sum, goal) =>
            sum + Number(goal.weight || 0),
        0
    );

    const canEditGoals =
        selectedAppraisal &&
        (
            selectedAppraisal.status === "DRAFT" ||
            selectedAppraisal.status === "GOALS_REVISION_REQUIRED"
        );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Performance Appraisal
                    </h1>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage your performance goals and appraisal.
                    </p>
                </div>

                {selectedAppraisal && (
                    <AppraisalStatusBadge
                        status={selectedAppraisal.status}
                    />
                )}

            </div>


            {/* Error */}
            {error && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                </div>
            )}


            {/* Success */}
            {success && (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300">
                    {success}
                </div>
            )}


            {/* Cycle selector */}
            {appraisals.length > 1 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">

                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Appraisal Cycle
                    </label>

                    <select
                        value={selectedAppraisal?.id || ""}
                        onChange={(e) => {
                            const appraisal =
                                appraisals.find(
                                    item =>
                                        item.id ===
                                        Number(e.target.value)
                                );

                            if (appraisal) {
                                selectAppraisal(appraisal);
                            }
                        }}
                        className="w-full md:w-96 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        {appraisals.map(appraisal => (
                            <option
                                key={appraisal.id}
                                value={appraisal.id}
                            >
                                {appraisal.cycleName}
                            </option>
                        ))}
                    </select>

                </div>
            )}


            {selectedAppraisal && (
                <>
                    {/* Appraisal summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">

                            <div className="flex items-center gap-3">

                                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Appraisal Cycle
                                    </p>

                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {selectedAppraisal.cycleName}
                                    </p>
                                </div>

                            </div>

                        </div>


                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">

                            <div className="flex items-center gap-3">

                                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                    <CalendarDays className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Status
                                    </p>

                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {selectedAppraisal.status}
                                    </p>
                                </div>

                            </div>

                        </div>


                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">

                            <div className="flex items-center gap-3">

                                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                                    <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Manager
                                    </p>

                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {selectedAppraisal.managerName ||
                                            "Assigned Manager"}
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>


                    {/* Goals */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-5 border-b border-gray-200 dark:border-gray-700">

                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Performance Goals
                                </h2>

                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Define measurable goals for this appraisal cycle.
                                </p>
                            </div>

                            {canEditGoals && (
                                <button
                                    onClick={() => {
                                        setEditingGoal(null);
                                        setShowGoalForm(true);
                                    }}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Goal
                                </button>
                            )}

                        </div>

                        {selectedAppraisal &&
    (
        selectedAppraisal.status === "GOALS_APPROVED" ||
        selectedAppraisal.status === "IN_PROGRESS"
    ) && (

        <div className="flex justify-end">
<button
    type="button"
    onClick={() =>
        navigate(
            `/employee/appraisal/${selectedAppraisal.id}/progress`
        )
    }
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium"
            >

                <TrendingUp className="w-4 h-4" />

                Update Goal Progress

            </button>

        </div>


    )}

  {selectedAppraisal?.status === "IN_PROGRESS" && (
    <div className="flex justify-end mt-3">
        <button
            type="button"
            onClick={handleStartSelfReview}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium"
        >
            <TrendingUp className="w-4 h-4" />
            Start Self Review
        </button>
    </div>
)}

{selectedAppraisal?.status === "SELF_REVIEW" && (
    <div className="flex justify-end mt-3">
        <button
            type="button"
            onClick={() =>
                navigate(
                    `/employee/appraisal/${selectedAppraisal.id}/self-review`
                )
            }
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium"
        >
            <TrendingUp className="w-4 h-4" />
            Complete Self Review
        </button>
    </div>
)}


                        {/* Goal table */}
                        <div className="overflow-x-auto">

                            {goalsLoading ? (

                                <div className="flex justify-center p-10">
                                    <Loader2 className="w-7 h-7 animate-spin" />
                                </div>

                            ) : goals.length === 0 ? (

                                <div className="text-center py-12">

                                    <Target className="w-12 h-12 mx-auto text-gray-400" />

                                    <p className="mt-3 text-gray-500 dark:text-gray-400">
                                        No goals added yet.
                                    </p>

                                    {canEditGoals && (
                                        <button
                                            onClick={() => {
                                                setEditingGoal(null);
                                                setShowGoalForm(true);
                                            }}
                                            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            Add your first goal
                                        </button>
                                    )}

                                </div>

                            ) : (

                                <table className="w-full">

                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-700 text-left">

                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                                Goal
                                            </th>

                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                                Category
                                            </th>

                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                                Weight
                                            </th>

                                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                                Status
                                            </th>

                                            {canEditGoals && (
                                                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase text-right">
                                                    Actions
                                                </th>
                                            )}

                                        </tr>
                                    </thead>

                                    <tbody>

                                        {goals.map(goal => (

                                            <tr
                                                key={goal.id}
                                                className="border-b last:border-b-0 border-gray-100 dark:border-gray-700"
                                            >

                                                <td className="px-5 py-4">

                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {goal.title}
                                                    </div>

                                                    {goal.description && (
                                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
                                                            {goal.description}
                                                        </div>
                                                    )}

                                                </td>

                                                <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                    {goal.category || "-"}
                                                </td>

                                                <td className="px-5 py-4">

                                                    <span className="font-semibold text-gray-900 dark:text-white">
                                                        {goal.weight}%
                                                    </span>

                                                </td>

                                                <td className="px-5 py-4">

                                                    <AppraisalStatusBadge
                                                        status={goal.status}
                                                    />

                                                </td>

                                                {canEditGoals && (
                                                    <td className="px-5 py-4">

                                                        <div className="flex items-center justify-end gap-2">

                                                            <button
                                                                onClick={() => {
                                                                    setEditingGoal(goal);
                                                                    setShowGoalForm(true);
                                                                }}
                                                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                                                                title="Edit"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteGoal(goal.id)
                                                                }
                                                                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>

                                                        </div>

                                                    </td>
                                                )}

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>
                            )}

                        </div>


                        {/* Weight footer */}
                        {goals.length > 0 && (
                            <div className="p-5 border-t border-gray-200 dark:border-gray-700">

                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                                    <div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Total Goal Weight
                                        </span>

                                        <span className="ml-2 font-bold text-gray-900 dark:text-white">
                                            {totalWeight}%
                                        </span>
                                    </div>

                                    <div
                                        className={`text-sm font-medium ${
                                            Math.abs(totalWeight - 100) < 0.01
                                                ? "text-green-600"
                                                : "text-orange-600"
                                        }`}
                                    >
                                        {Math.abs(totalWeight - 100) < 0.01
                                            ? "Weight is balanced"
                                            : "Weight must total 100%"}
                                    </div>

                                </div>

                            </div>
                        )}

                    </div>


                    {/* Supporting Documents */}
                    <AppraisalDocuments
                        appraisalId={selectedAppraisal.id}
                        title="Supporting Documents"
                    />
                    
                    {/* Submit */}
                    {canEditGoals && goals.length > 0 && (
                        <div className="flex justify-end">

                            <button
                                onClick={handleSubmitGoals}
                                disabled={
                                    saving ||
                                    Math.abs(totalWeight - 100) > 0.01
                                }
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium"
                            >

                                {saving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}

                                Submit Goals
                            </button>

                        </div>
                    )}

                </>
            )}


            {/* Goal modal */}
            {showGoalForm && (
                <GoalForm
                    goal={editingGoal}
                    onSave={handleSaveGoal}
                    onClose={() => {
                        setShowGoalForm(false);
                        setEditingGoal(null);
                    }}
                    saving={saving}
                />
            )}

        </div>
    );
};

export default EmployeeAppraisal;