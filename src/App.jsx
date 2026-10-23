
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeMyLeaves from "./pages/EmployeeMyLeaves";
import EmployeeApplyLeave from "./pages/EmployeeApplyLeave";
import ManagerApprovals from "./pages/ManagerApprovals";
import ManagerDocumentReview from "./pages/ManagerDocumentReview";
import GlobalAiAssistant from "./components/GlobalAiAssistant";
import ManagerDashboard from "./pages/ManagerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ForgotPassword
from "./pages/ForgotPassword";

import VerifyOtp
from "./pages/VerifyOtp";

import ResetPassword
from "./pages/ResetPassword";

import ChangePassword
from "./pages/ChangePassword";

import Profile
from "./pages/Profile";

import Reports from "./pages/Reports";

import HolidayManagement
from "./pages/HolidayManagement";

import Employees from "./pages/Employees";
import AuditLogs from "./pages/AuditLogs";
import ManagerCalendar from "./pages/ManagerCalendar";

import LeavePolicyPage
from "./pages/LeavePolicyPage";

import EmployeeAppraisal from "./appraisal/pages/EmployeeAppraisal";

import ManagerAppraisals from "./appraisal/pages/ManagerAppraisals";

import ManagerAppraisalReview from "./appraisal/pages/ManagerAppraisalReview";

import EmployeeGoalProgress from "./appraisal/pages/EmployeeGoalProgress";

import AdminAppraisalReview from "./appraisal/pages/AdminAppraisalReview";

import EmployeeSelfReview
    from "./appraisal/pages/EmployeeSelfReview";

    import AdminAppraisals
  from "./appraisal/pages/AdminAppraisals";

  import AdminAppraisalCycles
  from "./appraisal/pages/AdminAppraisalCycles";

  import NotificationTemplates from "./pages/admin/NotificationTemplates";

  import SlaManagement
  from "./pages/admin/SlaManagement";

  import LeaveActionPage from "./pages/LeaveActionPage";

  import BackdatedLeaveManagement from "./pages/admin/BackdatedLeaveManagement";

  import ManagerApplyLeave
  from "./pages/ManagerApplyLeave";

import ManagerMyLeaves
  from "./pages/ManagerMyLeaves";

  import AdminApprovalRequests
    from "./pages/admin/AdminApprovalRequests";

import AdminDocumentReview
    from "./pages/admin/AdminDocumentReview";

import EnterpriseLayout from "./layouts/EnterpriseLayout";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

                  <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

<Route
  path="/verify-otp"
  element={<VerifyOtp />}
/>

<Route
  path="/reset-password"
  element={<ResetPassword />}
/>

  <Route
    path="/change-password"
    element={
      <ProtectedRoute
        roles={[
          "ADMIN",
          "MANAGER",
          "EMPLOYEE"
        ]}
      >   <EnterpriseLayout>
        <ChangePassword />
        </EnterpriseLayout>
      </ProtectedRoute>
    }
  />

  <Route
  path="/manager/calendar"
  element={
        <ProtectedRoute
      roles={["MANAGER"]}>
      <EnterpriseLayout>
    <ManagerCalendar />
          </EnterpriseLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/employees"
  element={
    <ProtectedRoute roles={["ADMIN"]}>
      <Employees />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/audit-logs"
  element={
    <ProtectedRoute roles={["ADMIN"]}>
      <AuditLogs />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/reports"
  element={
    <ProtectedRoute roles={["ADMIN"]}>
      <Reports />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/holidays"
  element={
    <ProtectedRoute
      roles={["ADMIN"]}
    >
      <HolidayManagement />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/sla-management"
  element={
    <ProtectedRoute roles={["ADMIN"]}>
      <EnterpriseLayout>
        <SlaManagement />
      </EnterpriseLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/leave-policies"
  element={
    <ProtectedRoute
      roles={["ADMIN"]}
    >
      <LeavePolicyPage />
    </ProtectedRoute>
  }
/>

  <Route
 path="/profile"
 element={
   <ProtectedRoute
     roles={[
       "ADMIN",
       "MANAGER",
       "EMPLOYEE"
     ]}
   >
     <Profile />
   </ProtectedRoute>
 }
/>

        <Route
  path="/employee"
  element={
    <ProtectedRoute
      roles={["EMPLOYEE"]}
    >
      <EmployeeDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/employee/apply-leave"
  element={
    <ProtectedRoute
      roles={["EMPLOYEE"]}
    >
      <EmployeeApplyLeave />
    </ProtectedRoute>
  }
/>

<Route
  path="/employee/my-leaves"
  element={
    <ProtectedRoute
      roles={["EMPLOYEE"]}
    >
      <EmployeeMyLeaves />
    </ProtectedRoute>
  }
/>

<Route
    path="/employee/appraisal"
    element={
        <ProtectedRoute
      roles={["EMPLOYEE"]}>
          <>
<EnterpriseLayout>
            <EmployeeAppraisal />
          </EnterpriseLayout>
</>
    </ProtectedRoute>}
/>

<Route
    path="/employee/appraisal/:appraisalId/progress"
    element={        <ProtectedRoute
      roles={["EMPLOYEE"]}><EnterpriseLayout><EmployeeGoalProgress /></EnterpriseLayout></ProtectedRoute>}
/>

<Route
    path="/employee/appraisal/:appraisalId/self-review"
    element={<ProtectedRoute roles={["EMPLOYEE"]}><EnterpriseLayout><EmployeeSelfReview /></EnterpriseLayout></ProtectedRoute>}
/>



<Route
  path="/manager"
  element={
    <ProtectedRoute
      roles={["MANAGER"]}
    >
      <ManagerDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/manager/apply-leave"
  element={
    <ProtectedRoute roles={["MANAGER"]}>
      <ManagerApplyLeave />
    </ProtectedRoute>
  }
/>

<Route
  path="/manager/approvals"
  element={
    <ProtectedRoute roles={["MANAGER"]}>
      <ManagerApprovals />
    </ProtectedRoute>
  }
/>

<Route
  path="/manager/document-review"
  element={
    <ProtectedRoute roles={["MANAGER"]}>
      <ManagerDocumentReview />
    </ProtectedRoute>
  }
/>

<Route
  path="/manager/my-leaves"
  element={
    <ProtectedRoute roles={["MANAGER"]}>
      <ManagerMyLeaves />
    </ProtectedRoute>
  }
/>

<Route
    path="/manager/appraisals"
    element={    <ProtectedRoute
      roles={["MANAGER"]}>
            <EnterpriseLayout>
    <ManagerAppraisals />
    </EnterpriseLayout>
    </ProtectedRoute>}
/>

<Route
    path="/manager/appraisal/:appraisalId"
    element={<ProtectedRoute roles={["MANAGER"]}><EnterpriseLayout><ManagerAppraisalReview /></EnterpriseLayout></ProtectedRoute>}
/>

<Route
    path="/leave-action"
    element={<LeaveActionPage />}
/>

<Route
  path="/admin"
  element={
    <ProtectedRoute
      roles={["ADMIN"]}
    >
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/appraisals"
  element={
    <ProtectedRoute roles={["ADMIN"]}>
      <EnterpriseLayout>
        <AdminAppraisals />
      </EnterpriseLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/appraisal/:appraisalId"
  element={
    <ProtectedRoute roles={["ADMIN"]}>
      <EnterpriseLayout>
        <AdminAppraisalReview />
      </EnterpriseLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/appraisal-cycles"
  element={
    <ProtectedRoute roles={["ADMIN"]}>
      <EnterpriseLayout>
        <AdminAppraisalCycles />
      </EnterpriseLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/backdated-leave"
  element={
    <ProtectedRoute roles={["ADMIN"]}>
      <BackdatedLeaveManagement />
    </ProtectedRoute>
  }
/>

<Route
    path="/admin/document-review"
    element={
        <ProtectedRoute roles={["ADMIN"]}>
            <AdminDocumentReview />
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/approvals"
    element={
        <ProtectedRoute roles={["ADMIN"]}>
            <AdminApprovalRequests />
        </ProtectedRoute>
    }
/>

<Route
  path="/admin/notification-templates"
  element={
    <ProtectedRoute roles={["ADMIN"]}>
      <EnterpriseLayout>
        <NotificationTemplates />
      </EnterpriseLayout>
    </ProtectedRoute>
  }
/>
        </Routes>

        <GlobalAiAssistant />
      </BrowserRouter>
    </AuthProvider>
  );

}