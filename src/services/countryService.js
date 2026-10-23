import api from "./api";

const countryService = {

  getCountries() {

    return api.get(
      "/countries"
    );
  }
};

export default countryService;