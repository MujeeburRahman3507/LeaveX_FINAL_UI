import api from "./api";

const leavePolicyService = {

  getPolicies() {

    return api.get(
      "/admin/leave-policy"
    );
  },

  createPolicy(data) {

    return api.post(
      "/admin/leave-policy",
      data
    );
  },

  updatePolicy(
    id,
    data
  ) {

    return api.put(
      `/admin/leave-policy/${id}`,
      data
    );
  },

  deletePolicy(id) {

    return api.delete(
      `/admin/leave-policy/${id}`
    );
  }

};

export default leavePolicyService;