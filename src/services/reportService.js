import api from "./api";
import { saveBlob } from "../utils/fileDownload";

const reportService = {
  async downloadExcel(filters = {}) {
    const response = await api.get("/reports/download/excel", {
      params: filters,
      responseType: "blob",
    });

    await saveBlob(
      new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "boit-leave-report.xlsx"
    );
  },

  async downloadPdf(filters = {}) {
    const response = await api.get("/reports/download/pdf", {
      params: filters,
      responseType: "blob",
    });

    await saveBlob(
      new Blob([response.data], { type: "application/pdf" }),
      "boit-leave-report.pdf"
    );
  },
};

export default reportService;
