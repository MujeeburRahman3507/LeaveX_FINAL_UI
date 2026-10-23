import api from "./api";

const documentRequestService = {

    requestDocument(data) {

        return api.post(
            "/leave/document-request",
            data
        );

    },

    // getLeaveRequests(leaveRequestId) {

    //     return api.get(
    //         `/leave/document-request/${leaveRequestId}`
    //     );

    // },

    getPendingByLeave(leaveRequestId) {

        return api.get(
            `/leave/document-request/pending/${leaveRequestId}`
        );

    },

    getEmployeePendingRequests() {

        return api.get(
            "/leave/document-request/pending"
        );

    },

    getRequests(leaveRequestId) {

    return api.get(
        `/leave/document-request/${leaveRequestId}`
    );

},

verifyDocument(requestId) {

    return api.put(
        `/leave/document-request/verify/${requestId}`
    );

},

rejectDocument(requestId, data) {

    return api.put(
        `/leave/document-request/reject/${requestId}`,
        data
    );

},

getEmployeeActions() {

    return api.get(

        "/leave/document-request/employee-actions"

    );

},

getManagerActions(){

    return api.get(

        "/leave/document-request/manager-actions"

    );

},

getManagerPendingActions() {

    return api.get(
        "/leave/document-request/manager-pending-actions"
    );

},

getAdminActions() {

    return api.get(
        "/leave/document-request/admin-actions"
    );

},

};



export default documentRequestService;