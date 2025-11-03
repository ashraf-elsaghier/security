import { createSlice } from "@reduxjs/toolkit";

export const tour = createSlice({
  name: "tour",
  initialState: {run: false},
  reducers: {
    toggle: (state) => {
      state.run = !state.run
    },
    disableTour: (state) => {
      state.run = false;
    },
    enableTour: (state) => {
      state.run = true;
    },
     handleJoyrideCallback : (state,action) => {
      if( action.payload.action === 'close' || action.payload.action === 'reset') {
        state.run = false;
      }
    }
  },
});

// Action creators are generated for each case reducer function
export const { toggle,handleJoyrideCallback, enableTour, disableTour } = tour.actions;

export default tour.reducer;
