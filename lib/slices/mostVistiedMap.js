
import { createSlice } from "@reduxjs/toolkit";

export const mostVistiedMap = createSlice({
  name: "MostVistiedMap",
  initialState: {
    mostVistiedMap: null, // Initial state should be an object with the expected structure
  },
  reducers: {
    setmostVistiedMap: (state, action) => {
        state.mostVistiedMap = null;
        state.mostVistiedMap = action.payload;
      }
}});

export const { setmostVistiedMap } = mostVistiedMap.actions;



export default mostVistiedMap.reducer;
