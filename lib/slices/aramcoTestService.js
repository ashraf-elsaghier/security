import { createSlice } from "@reduxjs/toolkit";

export const AramcoTestService = createSlice({
  name: "AramcoTestService",
  initialState: {},
  reducers: {
    add: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    empty: () => {
      return {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { add, empty } = AramcoTestService.actions;

export default AramcoTestService.reducer;
