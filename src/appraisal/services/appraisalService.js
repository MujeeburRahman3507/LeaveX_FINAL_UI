import api from "../../services/api";

/*
 * ============================================================
 * APPRAISAL CYCLE APIs
 * ============================================================
 */

export const startSelfReview = (appraisalId) =>
    api.post(`/appraisal/${appraisalId}/start-self-review`);

export const getAppraisalCycles = async () => {
    const response = await api.get("/appraisal/cycles");
    return response.data;
};

export const getAppraisalCycle = async (cycleId) => {
    const response = await api.get(
        `/appraisal/cycles/${cycleId}`
    );
    return response.data;
};

export const createAppraisalCycle = async (data) => {
    const response = await api.post(
        "/appraisal/cycles",
        data
    );
    return response.data;
};

export const updateAppraisalCycle = async (
    cycleId,
    data
) => {
    const response = await api.put(
        `/appraisal/cycles/${cycleId}`,
        data
    );
    return response.data;
};

export const updateAppraisalCycleStatus = async (
    cycleId,
    status
) => {
    const response = await api.patch(
        `/appraisal/cycles/${cycleId}/status`,
        null,
        {
            params: {
                status
            }
        }
    );

    return response.data;
};


/*
 * ============================================================
 * EMPLOYEE APPRAISAL APIs
 * ============================================================
 */

export const createEmployeeAppraisal = async (
    cycleId,
    employeeId
) => {
    const response = await api.post(
        `/appraisal/cycles/${cycleId}/employees/${employeeId}`
    );

    return response.data;
};

export const getMyAppraisals = async () => {
    const response = await api.get(
        "/appraisal/my"
    );

    return response.data;
};

export const getMyAppraisal = async (
    cycleId
) => {
    const response = await api.get(
        `/appraisal/cycles/${cycleId}/my`
    );

    return response.data;
};

export const getAppraisal = async (
    appraisalId
) => {
    const response = await api.get(
        `/appraisal/${appraisalId}`
    );

    return response.data;
};

export const getTeamAppraisals = async () => {
    const response = await api.get(
        "/appraisal/team"
    );

    return response.data;
};

export const getAllAppraisals = async () => {
    const response = await api.get(
        "/appraisal/all"
    );

    return response.data;
};


/*
 * ============================================================
 * GOAL APIs
 * ============================================================
 */

export const getGoalsByAppraisal = async (
    appraisalId
) => {
    const response = await api.get(
        `/appraisal/goals/appraisal/${appraisalId}`
    );

    return response.data;
};

export const getGoal = async (
    goalId
) => {
    const response = await api.get(
        `/appraisal/goals/${goalId}`
    );

    return response.data;
};

export const createGoal = async (
    data
) => {
    const response = await api.post(
        "/appraisal/goals",
        data
    );

    return response.data;
};

export const updateGoal = async (
    goalId,
    data
) => {
    const response = await api.put(
        `/appraisal/goals/${goalId}`,
        data
    );

    return response.data;
};

export const deleteGoal = async (
    goalId
) => {
    const response = await api.delete(
        `/appraisal/goals/${goalId}`
    );

    return response.data;
};


/*
 * ============================================================
 * GOAL WORKFLOW APIs
 * ============================================================
 */

export const submitGoals = async (
    appraisalId
) => {
    const response = await api.post(
        `/appraisal/${appraisalId}/submit-goals`
    );

    return response.data;
};

export const approveGoals = async (
    appraisalId
) => {
    const response = await api.post(
        `/appraisal/${appraisalId}/approve-goals`
    );

    return response.data;
};

export const requestGoalRevision = async (
    appraisalId
) => {
    const response = await api.post(
        `/appraisal/${appraisalId}/request-goal-revision`
    );

    return response.data;
};


/*
 * ============================================================
 * GOAL PROGRESS APIs
 * ============================================================
 */

export const updateGoalProgress = async (
    goalId,
    data
) => {
    const response = await api.post(
        `/appraisal/goals/${goalId}/progress`,
        data
    );

    return response.data;
};

export const getLatestGoalProgress = async (
    goalId
) => {
    const response = await api.get(
        `/appraisal/goals/${goalId}/progress`
    );

    return response.data;
};

export const getGoalProgressHistory = async (
    goalId
) => {
    const response = await api.get(
        `/appraisal/goals/${goalId}/progress/history`
    );

    return response.data;
};


/*
 * ============================================================
 * EMPLOYEE SELF REVIEW APIs
 * ============================================================
 */

export const getEmployeeReview = async (
    appraisalId
) => {
    const response = await api.get(
        `/appraisal/employee-review/${appraisalId}`
    );

    return response.data;
};

export const saveEmployeeReview = async (
    data
) => {
    const response = await api.post(
        "/appraisal/employee-review",
        data
    );

    return response.data;
};

export const submitEmployeeReview = async (
    appraisalId
) => {
    const response = await api.post(
        `/appraisal/employee-review/${appraisalId}/submit`
    );

    return response.data;
};


/*
 * ============================================================
 * MANAGER REVIEW APIs
 * ============================================================
 */

export const getManagerReview = async (
    appraisalId
) => {
    const response = await api.get(
        `/appraisal/manager-review/${appraisalId}`
    );

    return response.data;
};

export const saveManagerReview = async (
    data
) => {
    const response = await api.post(
        "/appraisal/manager-review",
        data
    );

    return response.data;
};

export const submitManagerReview = async (
    appraisalId
) => {
    const response = await api.post(
        `/appraisal/manager-review/${appraisalId}/submit`
    );

    return response.data;
};

export const startManagerReview = async (
    appraisalId
) => {

    const response = await api.post(
        `/appraisal/manager-review/${appraisalId}/start`
    );

    return response.data;
};


/*
 * ============================================================
 * HR / ADMIN REVIEW APIs
 * ============================================================
 */

export const getHrReview = async (
    appraisalId
) => {
    const response = await api.get(
        `/appraisal/hr-review/${appraisalId}`
    );

    return response.data;
};

export const saveHrReview = async (
    data
) => {
    const response = await api.post(
        "/appraisal/hr-review",
        data
    );

    return response.data;
};

export const submitHrReview = async (
    appraisalId
) => {
    const response = await api.post(
        `/appraisal/hr-review/${appraisalId}/submit`
    );

    return response.data;
};

export const finalizeHrReview  = async (
    appraisalId
) => {
    const response = await api.post(
        `/appraisal/hr-review/${appraisalId}/finalize`
    );

    return response.data;
};

export const startHrReview = async (appraisalId) => {
  const response = await api.post(
    `/appraisal/hr-review/${appraisalId}/start`
  );

  return response.data;
};

/*
 * ============================================================
 * DOCUMENT APIs
 * ============================================================
 */

export const uploadAppraisalDocument = async ({
    appraisalId,
    goalId,
    file,
    documentType,
    remarks
}) => {

    const formData = new FormData();

    formData.append(
        "appraisalId",
        appraisalId
    );

    if (goalId) {
        formData.append(
            "goalId",
            goalId
        );
    }

    formData.append(
        "file",
        file
    );

    if (documentType) {
        formData.append(
            "documentType",
            documentType
        );
    }

    if (remarks) {
        formData.append(
            "remarks",
            remarks
        );
    }

    const response = await api.post(
        "/appraisal/documents/upload",
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data"
            }
        }
    );

    return response.data;
};

export const getAppraisalDocuments = async (
    appraisalId
) => {
    const response = await api.get(
        `/appraisal/documents/appraisal/${appraisalId}`
    );

    return response.data;
};

export const getGoalDocuments = async (
    goalId
) => {
    const response = await api.get(
        `/appraisal/documents/goal/${goalId}`
    );

    return response.data;
};

export const deleteAppraisalDocument = async (
    documentId
) => {
    const response = await api.delete(
        `/appraisal/documents/${documentId}`
    );

    return response.data;
};


