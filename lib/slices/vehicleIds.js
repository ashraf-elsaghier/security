import { createSlice } from "@reduxjs/toolkit";

export const vehicleIds = createSlice({
  name: "vehicleIds",
  initialState: [],
  reducers: {
    add: (state, action) => {
      !state.includes(action.payload) && state.push(action.payload);
    },
    empty: () => {
      return [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { add, empty } = vehicleIds.actions;

export default vehicleIds.reducer;
