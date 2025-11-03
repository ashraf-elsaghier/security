import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchDevices = createAsyncThunk("FetchAllDevices", async () => {
  const { data } = await axios.get(`dashboard/management/devices`);
  return data;
});

export const addDevicesInfo = createSlice({
  name: "addDevicesInfo",
  initialState: {
    loading: false,
    error: {
      error: null,
      message: null,
    },
    devicesInfo: {},
    devicesInfo2: {},
    allDevicesInfo: [],
  },
  reducers: {
    add: (state, action) => {
      if (action.payload.hasOwnProperty("serialNumber")) {
        state.devicesInfo = { ...action.payload };
      }
      if (action.payload.hasOwnProperty("serialSIMCard")) {
        state.devicesInfo2 = {
          ...state.devicesInfo2,
          ...action.payload,
        };
        state.allDevicesInfo.push({
          ...state.devicesInfo,
          ...state.devicesInfo2,
        });
      }
      if (action.payload.hasOwnProperty("Skip")) {
        state.allDevicesInfo.push({
          ...state.devicesInfo,
        });
      }
    },
    empty: (state) => {
      state.devicesInfo = {};
      state.devicesInfo2 = {};
      state.devicesInfo1And2 = {};
    },
    AddDevices: (state, { payload }) => {
      state.allDevicesInfo = payload;
    },
  },
  extraReducers: {
    // Devices
    [fetchDevices.pending]: (state) => {
      state.loading = true;
    },
    [fetchDevices.fulfilled]: (state, { payload }) => {
      state.allDevicesInfo = payload.result;
      state.loading = false;
    },
    [fetchDevices.rejected]: (state, { payload }) => {
      state.error.error = payload?.error;
      state.error.message = payload?.message;
      state.loading = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { add, empty, AddDevices } = addDevicesInfo.actions;

export default addDevicesInfo.reducer;
