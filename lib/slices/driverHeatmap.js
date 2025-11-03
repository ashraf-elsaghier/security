import { createSlice } from "@reduxjs/toolkit";

export const driverHeatMap = createSlice({
  name: "drvierHeatMap",
  initialState: {
    driverHeatMap: null,
  },
  reducers: {
    setDriverHeatMap: (state, action) => {
      state.driverHeatMap = null;
      state.driverHeatMap = action.payload;
    },
    updateMapMarkers: (state, { payload }) => {
      const getLayers = state.driverHeatMap?.activeGroup()?.getLayers();
      let filteredGetLayers = Object.values(getLayers.reduce((acc, cur) => Object.assign(acc, { [cur.id]: cur }), {}))
      filteredGetLayers.forEach((v) => {
        const updateVehicle = payload?.find((vf) => vf.SerialNumber == v?.options?.locInfo?.SerialNumber);
        updateVehicle && state.driverHeatMap?.UpdateMarker(updateVehicle);
      });


    },
    
  },
});

// Action creators are generated for each case reducer function
export const { setDriverHeatMap, updateMapMarkers } = driverHeatMap.actions;


export const DHeatMap = (state) => state.driverHeatMap.driverHeatMap 

export default driverHeatMap.reducer;
