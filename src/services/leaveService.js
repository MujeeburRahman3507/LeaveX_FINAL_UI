import api from "./api";

const leaveService = {

  // =========================================================
  // EMPLOYEE
  // =========================================================

  cancelLeave(id) {

    return api.put(
      `/employee/leave/${id}/cancel`
    );
  },


  checkConflict(payload) {

    return api.post(
      "/ai/check-conflict",
      payload
    );
  },


  getNotifications() {

    return api.get(
      "/notifications"
    );
  },


  getNotificationCount() {

    return api.get(
      "/notifications/count"
    );
  },


  markNotificationRead(id) {

    return api.put(
      `/notifications/${id}/read`
    );
  },


  getDashboardMetrics() {

    return api.get(
      "/employee/dashboard"
    );
  },


  getBalance() {

    return api.get(
      "/employee/balance"
    );
  },


  getMyLeaves() {

    return api.get(
      "/employee/leave/history"
    );
  },


  applyLeave(payload) {

    return api.post(
      "/employee/leave/apply",
      payload
    );
  },


  getUpcomingHolidays() {

    return api.get(
      "/employee/upcoming-holidays"
    );
  },

getEmployeeBackupPersons() {
    return api.get("/employee/leave/backup-persons");
},

  calculateDays(
    startDate,
    endDate,
    durationType = "FULL_DAY"
  ) {

    return api.get(
      `/employee/calculate-days?startDate=${startDate}&endDate=${endDate}&durationType=${durationType}`
    );

    

  },


  // =========================================================
  // MANAGER
  // =========================================================

  getManagerLeaveSummary() {

    return api.get(
      "/manager/leave/summary"
    );
  },


  getManagerMyLeaves() {

    return api.get(
      "/manager/leave/history"
    );
  },


  applyManagerLeave(payload) {

    return api.post(
      "/manager/leave/apply",
      payload
    );
  },


  cancelManagerLeave(id) {

    return api.put(
      `/manager/leave/${id}/cancel`
    );
  },


  getManagerBirthday() {

    return api.get(
      "/manager/leave/birthday"
    );
  },


  getManagerBackupPersons() {
    return api.get("/manager/leave/backup-persons");
},

  // =========================================================
  // MANAGER APPROVALS
  // =========================================================

  getEmployeesOnLeaveToday() {

    return api.get(
      "/manager/employees-on-leave"
    );
  },


  getPendingRequests() {

    return api.get(
      "/manager/pending"
    );
  },


  approveLeave(data) {

    return api.post(
      "/manager/approve",
      {
        requestId: data.requestId,
        status: "APPROVED",
        managerComments:
          data.managerComments
      }
    );
  },


  rejectLeave(data) {

    return api.post(
      "/manager/reject",
      {
        requestId: data.requestId,
        status: "REJECTED",
        managerComments:
          data.managerComments
      }
    );
  },


  getCalendarEvents() {

    return api.get(
      "/manager/calendar"
    );
  },

  getManagerUpcomingHolidays() {

  return api.get(
    "/manager/leave/upcoming-holidays"
  );
},

calculateManagerDays(
  startDate,
  endDate,
  durationType = "FULL_DAY"
) {

  return api.get(
    `/manager/leave/calculate-days?startDate=${startDate}&endDate=${endDate}&durationType=${durationType}`
  );
},

  // =========================================================
  // ADMIN APPROVALS
  // =========================================================

  getAdminPendingApprovals() {

    return api.get(
      "/admin/approvals"
    );
  },


  approveAdminLeave(data) {

    return api.post(
      "/admin/approvals/approve",
      {
        requestId: data.requestId,
        status: "APPROVED",
        managerComments:
          data.managerComments
      }
    );
  },


  rejectAdminLeave(data) {

    return api.post(
      "/admin/approvals/reject",
      {
        requestId: data.requestId,
        status: "REJECTED",
        managerComments:
          data.managerComments
      }
    );
  },


  // =========================================================
  // ADMIN / COMMON
  // =========================================================

  getPolicies() {

    return api.get(
      "/admin/leave-policy"
    );
  }

};

export default leaveService;