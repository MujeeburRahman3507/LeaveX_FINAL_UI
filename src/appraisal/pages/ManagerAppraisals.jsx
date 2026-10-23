import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ClipboardCheck,
    Eye,
    Loader2,
    AlertCircle,
    Users
} from "lucide-react";

import {
    getTeamAppraisals
} from "../services/appraisalService";

import AppraisalStatusBadge from "../components/AppraisalStatusBadge";

const ManagerAppraisals = () => {
    const navigate = useNavigate();


    const [appraisals, setAppraisals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadAppraisals();
    }, []);

    const loadAppraisals = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getTeamAppraisals();

            setAppraisals(data || []);

        } catch (err) {

            console.error(err);

            setError(
                err?.response?.data?.message ||
                "Unable to load team appraisals."
            );

        } finally {

            setLoading(false);

        }
    };

    const reviewableCount = appraisals.filter(
        appraisal =>
            appraisal.status === "GOALS_SUBMITTED" ||
            appraisal.status === "MANAGER_REVIEW"
    ).length;

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
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Performance Appraisals
                </h1>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Review and manage performance appraisals for your team.
                </p>
            </div>


            {/* Error */}
            {error && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                </div>
            )}


            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">

                    <div className="flex items-center gap-3">

                        <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Team Appraisals
                            </p>

                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {appraisals.length}
                            </p>
                        </div>

                    </div>

                </div>


                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">

                    <div className="flex items-center gap-3">

                        <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                            <ClipboardCheck className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Pending Review
                            </p>

                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {reviewableCount}
                            </p>
                        </div>

                    </div>

                </div>

            </div>


            {/* Appraisal table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">

                <div className="p-5 border-b border-gray-200 dark:border-gray-700">

                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Team Appraisals
                    </h2>

                </div>


                <div className="overflow-x-auto">

                    {appraisals.length === 0 ? (

                        <div className="text-center py-12">

                            <Users className="w-12 h-12 mx-auto text-gray-400" />

                            <p className="mt-3 text-gray-500 dark:text-gray-400">
                                No team appraisals found.
                            </p>

                        </div>

                    ) : (

                        <table className="action-first w-full">

                            <thead>

                                <tr className="border-b border-gray-200 dark:border-gray-700 text-left">

                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                        Employee
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                        Cycle
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                        Status
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                        Employee Rating
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                        Manager Rating
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase text-right">
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {appraisals.map(appraisal => (

                                    <tr
                                        key={appraisal.id}
                                        className="border-b last:border-b-0 border-gray-100 dark:border-gray-700"
                                    >

                                        <td className="px-5 py-4">

                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {appraisal.employeeName ||
                                                    `Employee #${appraisal.employeeId}`}
                                            </div>

                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                ID: {appraisal.employeeId}
                                            </div>

                                        </td>


                                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            {appraisal.cycleName}
                                        </td>


                                        <td className="px-5 py-4">

                                            <AppraisalStatusBadge
                                                status={appraisal.status}
                                            />

                                        </td>


                                        <td className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            {appraisal.overallEmployeeRating ?? "-"}
                                        </td>


                                        <td className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            {appraisal.overallManagerRating ?? "-"}
                                        </td>


                                        <td className="px-5 py-4 text-right">

                                            <button
                                                onClick={() => {
                                                    navigate(`/manager/appraisal/${appraisal.id}`);
                                                }}
                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium"
                                            >

                                                <Eye className="w-4 h-4" />

                                                Review

                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    )}

                </div>

            </div>

        </div>
    );
};

export default ManagerAppraisals;