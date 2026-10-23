import api from "./api";

const profileService = {

  getProfile() {

    return api.get(
      "/profile"
    );
  },

  updateProfile(data) {

    return api.put(
      "/profile",
      data
    );
  },

  uploadPhoto(formData) {

    return api.post(
      "/profile/upload-photo",
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

export default profileService;