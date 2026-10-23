import api from "./api";

const holidayService = {

  getAll() {

    return api.get(
      "/admin/holidays"
    );
  },

  create(data) {

    return api.post(
      "/admin/holidays",
      data
    );
  },

  update(id, data) {

    return api.put(
      `/admin/holidays/${id}`,
      data
    );
  },

  delete(id) {

    return api.delete(
      `/admin/holidays/${id}`
    );
  },

  previewImport(formData) {

    return api.post(
      "/admin/holidays/import/preview",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data"
        }
      }
    );
  },

  importHolidays(formData) {

    return api.post(
      "/admin/holidays/import",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data"
        }
      }
    );
  }

};

export default holidayService;