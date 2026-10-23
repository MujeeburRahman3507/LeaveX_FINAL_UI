import { useEffect, useState } from "react";
import adminService from "../services/adminService";
import MetricCard from "./MetricCard";

export default function AdminStats() {

  const [stats, setStats] =
    useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {

    try {

      const response =
        await adminService
          .getStatistics();

      setStats(
        response.data.data
      );

    } catch (error) {

      console.error(error);
    }
  };

  if (!stats) {
    return <div>Loading statistics...</div>;
  }

  return (

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

      <MetricCard
        title="Employees"
        value={stats.totalEmployees}
      />

      <MetricCard
        title="Managers"
        value={stats.totalManagers}
      />

      <MetricCard
        title="Pending Leaves"
        value={stats.pendingLeaves}
      />

      <MetricCard
        title="Approved Leaves"
        value={stats.approvedLeaves}
      />

    </div>
  );
}