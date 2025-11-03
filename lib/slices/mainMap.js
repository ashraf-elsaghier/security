import { createSlice } from "@reduxjs/toolkit";

export const mainMap = createSlice({
  name: "mainMap",
  initialState: {
    myMap: null,
  },
  reducers: {
    setMap: (state, action) => {
      state.myMap = null;
      state.myMap = action?.payload;
    },
    updateMapMarkers: (state, { payload }) => {
      const getLayers = state.myMap?.activeGroup()?.getLayers();
      let filteredGetLayers = Object.values(
        getLayers.reduce(
          (acc, cur) => Object.assign(acc, { [cur.id]: cur }),
          {}
        )
      );
      filteredGetLayers.forEach((v) => {
        const updateVehicle = payload?.find(
          (vf) => vf.SerialNumber == v?.options?.locInfo?.SerialNumber
        );
        updateVehicle && state.myMap?.UpdateMarker(updateVehicle);
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const { setMap, updateMapMarkers } = mainMap.actions;

export default mainMap.reducer;
