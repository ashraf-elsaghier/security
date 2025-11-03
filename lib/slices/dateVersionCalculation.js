import { createSlice } from "@reduxjs/toolkit";

export const dateVersionCalculation = createSlice({
  name: "dateVersionCalculation",
  initialState: {isV5: true},
  reducers: {
    toggle: (state) => {
      state.isV5 = !state.isV5
      
    },

  },
});

// Action creators are generated for each case reducer function
export const { toggle} = dateVersionCalculation.actions;

export default dateVersionCalculation.reducer;
