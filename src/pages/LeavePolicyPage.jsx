import DashboardLayout
from "../components/DashboardLayout";

import LeavePolicyTable
from "../components/LeavePolicyTable";

export default function LeavePolicyPage() {

  return (

    <DashboardLayout>

      <h1
        className="
        text-2xl
        font-bold
        mb-6
        "
      >
        Leave Policy Management
      </h1>

      <LeavePolicyTable />

    </DashboardLayout>
  );
}