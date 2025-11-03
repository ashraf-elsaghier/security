import { createSlice } from "@reduxjs/toolkit";

export const geoSearch = createSlice({
  name: "geoSearch",
  initialState: { show: false, searchControl: null },
  reducers: {
    toggle: (state) => {
      state.show = !state.show;
    },
    removeMarkers: (state, action) => {
      state.searchControl = action.payload;
    },
    removeBar: (state) => {
      state.searchControl?.remove();
    }

  },
});

// Action creators are generated for each case reducer function
export const { toggle, removeMarkers , removeBar } = geoSearch.actions;

export default geoSearch.reducer;
