import api from "./api";

const adminService = {

  getStatistics() {
    return api.get("/admin/statistics");
  },

  getAuditLogs() {

  return api.get(
    "/admin/audit-logs"
  );
},

getDashboard() {
  return api.get(
    "/admin/dashboard"
  );
},

  getEmployees() {
    return api.get("/admin/employees");
  },

  getEmployee(id) {
    return api.get(`/admin/employees/${id}`);
  },

  createEmployee(data) {
    return api.post("/admin/employees", data);
  },

  updateEmployee(id, data) {
    return api.put(`/admin/employees/${id}`, data);
  },

  deleteEmployee(id) {
    return api.delete(`/admin/employees/${id}`);
  },

  updateLeaveBalance(id, data) {
    return api.put(`/admin/employees/${id}/balance`, data);
  },

  getManagers() {
    return api.get("/admin/managers");
  },

  getAdmins() {
    return api.get("/admin/admins");
  },

  getCountryStats() {

  return api.get(
    "/admin/country-stats"
  );

},
};

export default adminService;