import { useEffect, useState } from "react";

import DashboardLayout from "../components/DashboardLayout";
import GreetingHeader from "../components/dashboard/GreetingHeader";
import ModernMetricCard from "../components/dashboard/ModernMetricCard";
import LeaveTable from "../components/LeaveTable";
import { useAuth } from "../context/AuthContext";
import leaveService from "../services/leaveService";



export default function ManagerMyLeaves() {

    const { user } = useAuth();

    const [metrics, setMetrics] = useState({
        annualBalance: 0,
        usedLeave: 0,
        remainingLeave: 0,
        approved: 0,
        rejected: 0,
        pending: 0
    });

    const [refreshKey, setRefreshKey] = useState(0);


    // =========================================================
    // LOAD MANAGER LEAVE SUMMARY
    // =========================================================

    const loadLeaveSummary = async () => {

        try {

            const response =
                await leaveService.getManagerLeaveSummary();

            const data =
                response.data?.data ||
                response.data ||
                {};

            setMetrics({
                annualBalance:
                    data.annualBalance ?? 0,

                usedLeave:
                    data.usedLeave ?? 0,

                remainingLeave:
                    data.remainingLeave ?? 0,

                approved:
                    data.approved ?? 0,

                rejected:
                    data.rejected ?? 0,

                pending:
                    data.pending ?? 0
            });

        } catch (error) {

            console.error(
                "Failed to load manager leave summary:",
                error
            );

        }

    };


    // =========================================================
    // INITIAL LOAD
    // =========================================================

useEffect(() => {

    loadLeaveSummary();

}, []);


    // =========================================================
    // REFRESH AFTER LEAVE ACTION
    // =========================================================

    const handleLeaveSuccess = () => {

        setRefreshKey(
            previous => previous + 1
        );

        loadLeaveSummary();

    };


    return (

        <DashboardLayout>

            {/* =================================================
                GREETING
            ================================================= */}

            <GreetingHeader
                name={user?.username}
            />


            {/* =================================================
                PERSONAL LEAVE SUMMARY
            ================================================= */}

            <div
                className="
                grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 lg:gap-6 mt-4 sm:mt-6 keep-grid
                "
            >

                <ModernMetricCard
                    title="Annual Balance"
                    value={metrics.annualBalance}
                    color="bg-gradient-to-r from-violet-600 to-purple-700"
                    icon="balance"
                />

                <ModernMetricCard
                    title="Used Leave"
                    value={metrics.usedLeave}
                    color="bg-gradient-to-r from-blue-500 to-cyan-600"
                    icon="leave"
                />

                <ModernMetricCard
                    title="Remaining Leave"
                    value={metrics.remainingLeave}
                    color="bg-gradient-to-r from-emerald-500 to-green-600"
                    icon="balance"
                />

                <ModernMetricCard
                    title="Approved"
                    value={metrics.approved}
                    color="bg-gradient-to-r from-green-500 to-emerald-600"
                    icon="approved"
                />

                <ModernMetricCard
                    title="Rejected"
                    value={metrics.rejected}
                    color="bg-gradient-to-r from-red-500 to-rose-600"
                    icon="rejected"
                />

                <ModernMetricCard
                    title="Pending"
                    value={metrics.pending}
                    color="bg-gradient-to-r from-amber-500 to-orange-600"
                    icon="pending"
                />

            </div>


 


            {/* =================================================
                MY LEAVE REQUESTS
            ================================================= */}

            <div className="mt-8">

                <LeaveTable
                    refreshTrigger={refreshKey}
                    managerMode={true}
                />

            </div>


        </DashboardLayout>

    );

}