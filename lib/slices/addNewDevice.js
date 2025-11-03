import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  device: {},
};

export const addNewDevice = createSlice({
  name: "addNewDevice",
  initialState,
  reducers: {
    addDevice: (state, action) => {
      state.device = action.payload;
    },
  },
});

export const { addDevice } = addNewDevice.actions;
export default addNewDevice.reducer;