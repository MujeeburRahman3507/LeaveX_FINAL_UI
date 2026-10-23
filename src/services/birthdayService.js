import api from "./api";

const birthdayService = {

    // Birthday popup - logged-in employee
    getBirthdayGreeting() {
        return api.get("/employee/birthday");
    },

    // Birthday popup - logged-in manager
    getManagerBirthdayGreeting() {
        return api.get("/manager/leave/birthday");
    },

    // Birthday widget - all employees
    getTodaysBirthdays() {
        return api.get("/employee/birthdays/today");
    }

};

export default birthdayService;