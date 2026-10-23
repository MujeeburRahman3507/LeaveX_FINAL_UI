import api from "./api";

const leaveDocumentService = {

    uploadDocument(formData) {

        return api.post(

            "/leave/document/upload",

            formData,

            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }

        );

    },

    getDocuments(leaveRequestId) {

        return api.get(
            `/leave/document/leave/${leaveRequestId}`
        );

    },

    viewDocument(documentId) {

        return `${api.defaults.baseURL}/leave/document/view/${documentId}`;

    },

    downloadDocument(documentId) {

        return `${api.defaults.baseURL}/leave/document/download/${documentId}`;

    },

     async viewDocumentBlob(documentId) {

        return api.get(

            `/leave/document/view/${documentId}`,

            {

                responseType: "blob"

            }

        );

    },

    async downloadDocumentBlob(documentId) {

        return api.get(

            `/leave/document/download/${documentId}`,

            {

                responseType: "blob"

            }

        );

    },
    
    analyzeDocument(documentId) {
  return api.post(`/ai/analyze-document/${documentId}`);
},

getAiAnalysis(documentId) {
    return api.get(`/leave/document/ai-analysis/${documentId}`);
},

};





export default leaveDocumentService;