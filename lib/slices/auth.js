import { createSlice } from "@reduxjs/toolkit";

export const fetchUserSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
  },
  reducers: {
    getUser: (state, action) => {
      state.user = action.payload;
    },
    getNewToken: (state, action) => {
      state?.user?.new_token = action.payload;
    }
  },
});

export const { getUser , getNewToken } = fetchUserSlice.actions;
export default fetchUserSlice.reducer;
