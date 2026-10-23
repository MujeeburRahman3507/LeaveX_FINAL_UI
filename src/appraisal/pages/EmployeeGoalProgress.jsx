import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    ArrowLeft,
    TrendingUp,
    Loader2,
    AlertCircle
} from "lucide-react";

import {
    getAppraisal,
    getGoalsByAppraisal
} from "../services/appraisalService";

import AppraisalStatusBadge from "../components/AppraisalStatusBadge";
import GoalProgress from "../components/GoalProgress";

const EmployeeGoalProgress = () => {

    // const appraisalId =
    //     Number(
    //         window.location.pathname.split("/").pop()
    //     );

    const { appraisalId: appraisalIdParam } = useParams();

const appraisalId = Number(appraisalIdParam);
    const [appraisal, setAppraisal] =
        useState(null);

    const [goals, setGoals] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [selectedGoal, setSelectedGoal] =
        useState(null);

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

        } catch (err) {

            console.error(err);

            setError(
                err?.response?.data?.message ||
                "Unable to load appraisal goals."
            );

        } finally {

            setLoading(false);

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

    const totalProgress =
        goals.length > 0
            ? goals.reduce(
                (sum, goal) =>
                    sum +
                    Number(
                        goal.progressPercentage || 0
                    ) *
                    Number(goal.weight || 0),
                0
            ) / 100
            : 0;

    const canUpdateProgress =
        appraisal.status === "GOALS_APPROVED" ||
        appraisal.status === "IN_PROGRESS";

    return (
        <div className="p-0 sm:p-6 space-y-4 sm:space-y-6">

            {/* Back */}
            <button
                onClick={() => {
                    window.location.href =
                        "/employee/appraisal";
                }}
                className="hidden inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-violet-600"
            >
                <ArrowLeft className="w-4 h-4" />

                Back to Appraisal
            </button>


            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        Goal Progress
                    </h1>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Track your progress against approved performance goals.
                    </p>

                </div>

                <AppraisalStatusBadge
                    status={appraisal.status}
                />

            </div>


            {/* Error */}
            {error && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">

                    <AlertCircle className="w-5 h-5" />

                    {error}

                </div>
            )}


            {/* Overall progress */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5">

                <div className="flex items-center justify-between mb-3">

                    <div className="flex items-center gap-3">

                        <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">

                            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />

                        </div>

                        <div>

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Overall Goal Progress
                            </p>

                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {totalProgress.toFixed(1)}%
                            </p>

                        </div>

                    </div>

                </div>


                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">

                    <div
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{
                            width: `${Math.min(
                                totalProgress,
                                100
                            )}%`
                        }}
                    />

                </div>

            </div>


            {/* Goals */}
            <div className="space-y-4">

                {goals.map(goal => (

                    <div
                        key={goal.id}
                        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5"
                    >

                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                            <div className="flex-1">

                                <div className="flex items-center gap-3">

                                    <h2 className="font-semibold text-gray-900 dark:text-white">
                                        {goal.title}
                                    </h2>

                                    <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                                        {goal.weight}%
                                    </span>

                                </div>


                                {goal.description && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        {goal.description}
                                    </p>
                                )}

                            </div>


                            <AppraisalStatusBadge
                                status={
                                    goal.status
                                }
                            />

                        </div>


                        {/* Progress bar */}
                        <div className="mt-5">

                            <div className="flex justify-between text-sm mb-2">

                                <span className="text-gray-500 dark:text-gray-400">
                                    Progress
                                </span>

                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {goal.progressPercentage || 0}%
                                </span>

                            </div>


                            <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">

                                <div
                                    className="h-full bg-blue-600 rounded-full"
                                    style={{
                                        width: `${Math.min(
                                            Number(
                                                goal.progressPercentage ||
                                                0
                                            ),
                                            100
                                        )}%`
                                    }}
                                />

                            </div>

                        </div>


                        {goal.latestEmployeeComment && (
                            <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">

                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                    Latest Update
                                </p>

                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                    {goal.latestEmployeeComment}
                                </p>

                            </div>
                        )}


                        {canUpdateProgress && (
                            <div className="flex justify-end mt-4">

                                <button
                                    onClick={() =>
                                        setSelectedGoal(
                                            goal
                                        )
                                    }
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium"
                                >

                                    <TrendingUp className="w-4 h-4" />

                                    Update Progress

                                </button>

                            </div>
                        )}

                    </div>

                ))}

            </div>


            {/* Progress modal */}
            {selectedGoal && (
                <GoalProgress
                    goal={selectedGoal}
                    onClose={() =>
                        setSelectedGoal(null)
                    }
                    onUpdated={(updatedProgress) => {
    setGoals((currentGoals) =>
        currentGoals.map((currentGoal) =>
            currentGoal.id === selectedGoal.id
                ? {
                    ...currentGoal,
                    progressPercentage:
                        Number(
                            updatedProgress?.progressPercentage || 0
                        ),
                    progressStatus:
                        updatedProgress?.status ||
                        "IN_PROGRESS",
                    latestEmployeeComment:
                        updatedProgress?.employeeComment ||
                        ""
                }
                : currentGoal
        )
    );

    setSelectedGoal(null);
}}
                />
            )}

        </div>
    );
};

export default EmployeeGoalProgress;