import DashboardLayout from "../components/DashboardLayout";
import LeaveForm from "../components/LeaveForm";
import GreetingHeader from "../components/dashboard/GreetingHeader";

export default function ManagerApplyLeave() {

  return (
    <DashboardLayout>

      <GreetingHeader />

      <div className="mt-6">

        <div
          className="
            bg-white
            dark:bg-slate-800
            rounded-2xl
            shadow-sm
            p-6
          "
        >

          <div className="mb-6">

            <h2
              className="
                text-xl
                font-semibold
                text-slate-900
                dark:text-white
              "
            >
              Apply Leave
            </h2>

            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
                mt-1
              "
            >
              Submit your leave request for approval.
            </p>

          </div>

     <LeaveForm
  managerMode={true}
/>

        </div>

      </div>

    </DashboardLayout>
  );
}