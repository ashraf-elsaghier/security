import { createSlice } from "@reduxjs/toolkit";

export const simCard = createSlice({
  name: "simCard",
  initialState: [],
  reducers: {
    add: (state, action) => {
      !state.filter(
        (item) => item.SImCardSerialNumber == action.payload.SImCardSerialNumber
      ).length > 0 && state.push(action.payload);
    },
    empty: (state) => {
      state = [...state];
    },
  },
});

// Action creators are generated for each case reducer function
export const { add, empty } = simCard.actions;

export default simCard.reducer;
