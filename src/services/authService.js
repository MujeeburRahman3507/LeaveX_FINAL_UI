import api from "./api";

const authService = {

  async login(credentials) {

    const response = await api.post(
      "/auth/login",
      credentials
    );

    return response.data;
  },

  changePassword(data) {

  return api.post(
    "/auth/change-password",
    data
  );
},

  async register(userData) {

    const response = await api.post(
      "/auth/register",
      userData
    );

    return response.data;
  },

  forgotPassword(email) {

    return api.post(
      "/auth/forgot-password",
      { email }
    );
  },

  verifyOtp(email, otp) {

    return api.post(
      "/auth/verify-otp",
      {
        email,
        otp
      }
    );
  },

  resetPassword(
    email,
    otp,
    newPassword
  ) {

    return api.post(
      "/auth/reset-password",
      {
        email,
        otp,
        newPassword
      }
    );
  },

  logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("roles");
  }

};



export default authService;