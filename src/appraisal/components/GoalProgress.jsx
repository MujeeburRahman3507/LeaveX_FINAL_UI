import { useState } from "react";

import {
    X,
    Save,
    Loader2,
    TrendingUp
} from "lucide-react";

import {
    updateGoalProgress
} from "../services/appraisalService";

const GoalProgress = ({
    goal,
    onClose,
    onUpdated
}) => {

const [progressPercentage, setProgressPercentage] =
    useState(Number(goal?.progressPercentage || 0));

const [status, setStatus] =
    useState(
        goal?.progressStatus || "IN_PROGRESS"
    );

const [employeeComment, setEmployeeComment] =
    useState(
        goal?.latestEmployeeComment || ""
    );

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    // useEffect(() => {
    //     loadData();
    // }, [goal.id]);

   

    const handleSave = async (e) => {

        e.preventDefault();

        setError("");

        if (
            progressPercentage < 0 ||
            progressPercentage > 100
        ) {
            setError(
                "Progress must be between 0% and 100%."
            );
            return;
        }

        if (
            progressPercentage === 100 &&
            status !== "COMPLETED"
        ) {
            setError(
                "Please select Completed when progress reaches 100%."
            );
            return;
        }

        if (
            progressPercentage < 100 &&
            status === "COMPLETED"
        ) {
            setError(
                "A completed goal must have 100% progress."
            );
            return;
        }

        try {

            setSaving(true);

            const updated =
                await updateGoalProgress(
                    goal.id,
                    {
                        progressPercentage:
                            Number(
                                progressPercentage
                            ),
                        status,
                        employeeComment:
                            employeeComment.trim()
                    }
                );

            onUpdated?.(updated);

            onClose();

        } catch (err) {

            console.error(err);

            setError(
                err?.response?.data?.message ||
                "Unable to update goal progress."
            );

        } finally {

            setSaving(false);

        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">

                    <div className="flex items-center gap-3">

                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">

                            <TrendingUp
                                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                            />

                        </div>

                        <div>

                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Update Goal Progress
                            </h2>

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {goal.title}
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                    >
                        <X className="w-5 h-5" />
                    </button>

                </div>


                    <form
                        onSubmit={handleSave}
                        className="p-4 sm:p-5 space-y-5"
                    >

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 text-sm">
                                {error}
                            </div>
                        )}


                        {/* Goal information */}
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">

                            <div className="grid grid-cols-2 gap-4">

                                <div>

                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Weight
                                    </p>

                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {goal.weight}%
                                    </p>

                                </div>


                                <div>

                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Target
                                    </p>

                                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                                        {goal.target || "-"}
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* Progress */}
                        <div>

                            <div className="flex items-center justify-between mb-2">

                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Progress
                                </label>

                                <span className="font-bold text-blue-600 dark:text-blue-400">
                                    {progressPercentage}%
                                </span>

                            </div>


                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={progressPercentage}
                                onChange={(e) =>
                                    setProgressPercentage(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                                className="w-full"
                            />


                            <div className="flex justify-between text-xs text-gray-400 mt-1">

                                <span>0%</span>
                                <span>25%</span>
                                <span>50%</span>
                                <span>75%</span>
                                <span>100%</span>

                            </div>

                        </div>


                        {/* Status */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Status
                            </label>

                            <select
                                value={status}
                                onChange={(e) =>
                                    setStatus(
                                        e.target.value
                                    )
                                }
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >

                                <option value="NOT_STARTED">
                                    Not Started
                                </option>

                                <option value="IN_PROGRESS">
                                    In Progress
                                </option>

                                <option value="COMPLETED">
                                    Completed
                                </option>

                                <option value="CANCELLED">
                                    Cancelled
                                </option>

                            </select>

                        </div>


                        {/* Comment */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Employee Comment
                            </label>

                            <textarea
                                value={employeeComment}
                                onChange={(e) =>
                                    setEmployeeComment(
                                        e.target.value
                                    )
                                }
                                rows={4}
                                placeholder="Describe your progress, achievements, challenges, or evidence..."
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />

                        </div>


                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">

                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium"
                            >

                                {saving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}

                                Save Progress

                            </button>

                        </div>

                    </form>


            </div>

        </div>
    )   
};

export default GoalProgress;