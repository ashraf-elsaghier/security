import { createSlice } from "@reduxjs/toolkit";

export const ToggleZoomAuto = createSlice({
  name: "ToggleZoomAuto",
  initialState: {
    value: false,
  },
  reducers: {
    ToggleZoom: (state) => {
      state.value = !state.value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { ToggleZoom } = ToggleZoomAuto.actions;

export default ToggleZoomAuto.reducer;
