import { createSlice } from "@reduxjs/toolkit";

export const dashboardReports = createSlice({
  name: "dashboardReports",
  initialState: {
    api: "",
    reportName: "",
    isFromDashboard: false,
  },
  reducers: {
    updateReportData: (state, { payload }) => {
      state.api = payload.api;
      state.reportName = payload.reportName;
      state.isFromDashboard = payload.isFromDashboard;
    },
    resetReportData: (state) => {
      state.api = "";
      state.reportName = "";
      state.isFromDashboard = false;
    },
  },
});

export const { updateReportData, resetReportData } = dashboardReports.actions;
export default dashboardReports.reducer;
