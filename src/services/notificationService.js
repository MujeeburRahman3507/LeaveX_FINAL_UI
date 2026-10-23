import api from "./api";

const getNotifications = () =>
  api.get("/notifications");

const getUnreadCount = () =>
  api.get("/notifications/count");

const markAsRead = (id) =>
  api.put(`/notifications/${id}/read`);

const markAllAsRead = () =>
  api.put("/notifications/read-all");

export default {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead
};