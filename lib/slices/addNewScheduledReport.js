import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  scheduledReport: [],
};

export const addNewScheduledReport = createSlice({
  name: "addNewScheduledReport",
  initialState,
  reducers: {
    addReport: (state, action) => {
      state.scheduledReport.push(action.payload);
    },
  },
});

export const { addReport } = addNewScheduledReport.actions;
export default addNewScheduledReport.reducer;
