import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vehicle: {},
  device: {},
  sim: {},
};

export const addNewVehicle = createSlice({
  name: "addNewVehicle",
  initialState,
  reducers: {
    addVehicle: (state, action) => {
      state.vehicle = action.payload;
    },
    addDevice: (state, action) => {
      state.device = action.payload;
    },
    addSim: (state, action) => {
      state.sim = action.payload;
    },
    resetData: (state) => {
      state.vehicle = {};
      state.device = {};
      state.sim = {};
    },
  },
});

export const { addVehicle, addDevice, addSim, resetData } = addNewVehicle.actions;
export default addNewVehicle.reducer;