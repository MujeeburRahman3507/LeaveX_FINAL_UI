import api from "./api";

const timelineService = {

    getLeaveTimeline(leaveRequestId) {

        return api.get(

            `/audit/leave/${leaveRequestId}`

        );

    }

};

export default timelineService;