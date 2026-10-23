import api from "./api";

const notificationTemplateService = {

  getAllTemplates: async () => {
    const response = await api.get(
      "/admin/notification-templates"
    );

    return response.data;
  },

  getTemplate: async (id) => {
    const response = await api.get(
      `/admin/notification-templates/${id}`
    );

    return response.data;
  },

  createTemplate: async (data) => {
    const response = await api.post(
      "/admin/notification-templates",
      data
    );

    return response.data;
  },

  updateTemplate: async (id, data) => {
    const response = await api.put(
      `/admin/notification-templates/${id}`,
      data
    );

    return response.data;
  },

  toggleActive: async (id) => {
    const response = await api.patch(
      `/admin/notification-templates/${id}/toggle`
    );

    return response.data;
  },
};

export default notificationTemplateService;