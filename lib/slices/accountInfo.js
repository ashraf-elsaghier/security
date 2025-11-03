import { createSlice } from "@reduxjs/toolkit";

export const accountInfo = createSlice({
  name: "accountInfo",
  initialState: {
    AddAccountInfo1: {},
    AddAccountInfo2: {},
    AddAccountInfo1And2: {},
    AddAccountInfo3: [],
    AddAccountInfo1And2: {},
    AllData: [],
  },
  reducers: {
    add: (state, action) => {
      if (
        typeof action.payload === "object" &&
        action.payload !== null &&
        action.payload.hasOwnProperty("page")
      ) {
        state.AddAccountInfo1 = action.payload;
      }

      if (
        typeof action.payload === "object" &&
        action.payload !== null &&
        action.payload.hasOwnProperty("lPass")
      ) {
        state.AddAccountInfo2 = action.payload;
        state.AddAccountInfo1And2 = {
          ...state.AddAccountInfo1,
          ...action.payload,
        };
      }

      if (Array.isArray(action.payload)) {
        state.AddAccountInfo3 = action.payload;
      }

      if (
        typeof action.payload === "object" &&
        action.payload !== null &&
        action.payload.hasOwnProperty("Finish")
      ) {
        // AddAccountInfo1And2
        if (state.AllData.length > 0) {
          state.AllData = [
            ...state.AllData,
            {
              ...state.AddAccountInfo1,
              ...state.AddAccountInfo2,
              ...state.AddAccountInfo3,
              AccountID: Math.random().toString(16).slice(0, 10),
            },
          ];
        } else {
          state.AllData = [
            {
              ...state.AddAccountInfo1,
              ...state.AddAccountInfo2,
              ...state.AddAccountInfo3,
              AccountID: Math.random().toString(16).slice(0, 10),
            },
          ];
        }
      }
    },
    empty: (state) => {
      state.AddAccountInfo1 = {};
      state.AddAccountInfo2 = {};
      state.AddAccountInfo3 = [];
      state.AddAccountInfo1And2 = {};
      state.AllData = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { add, empty } = accountInfo.actions;

export default accountInfo.reducer;
