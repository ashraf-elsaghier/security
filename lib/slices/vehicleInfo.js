import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchVehicles = createAsyncThunk(
  "FetchAllVehicles",
  async (props) => {
    const { data } = await axios.get(
      `dashboard/vehicles${props.id ? `?accountId=${props.id}` : ""}`
    );
    return data;
  }
);
export const vehicleInfo = createSlice({
  name: "vehicleInfo",
  initialState: {
    AddVehicleInfo: {},
    AddVehicleInfo2: {},
    AddVehicleInfo3: {},
    AddVehicleInfo4: {},
    AllData: [],
    loading: false,
    error: {
      error: null,
      message: null,
    },
  },
  reducers: {
    add: (state, action) => {
      if (
        typeof action.payload === "object" &&
        action.payload !== null &&
        action.payload.hasOwnProperty("fullName")
      ) {
        state.AddVehicleInfo = action.payload;
        !state.AllData.filter((item) => item.hasOwnProperty("fullName"))
          .length > 0 && state.AllData.push(action.payload);
      }

      if (
        typeof action.payload === "object" &&
        action.payload !== null &&
        action.payload.hasOwnProperty("selectADevice")
      ) {
        state.AddVehicleInfo2 = action.payload;
        if (
          state.AllData.filter((item) => item.hasOwnProperty("selectADevice"))
            .length > 0
        ) {
          let AllDataFiltered = state.AllData.filter(
            (item) => !item.hasOwnProperty("selectADevice")
          );
          state.AllData = [
            ...AllDataFiltered,
            {
              ...action.payload,
            },
          ];
        } else {
          state.AllData.push(action.payload);
        }
      }

      if (
        typeof action.payload === "object" &&
        action.payload !== null &&
        action.payload.hasOwnProperty("selectASINCard")
      ) {
        state.AddVehicleInfo3 = action.payload;
        if (
          state.AllData.filter((item) => item.hasOwnProperty("selectASINCard"))
            .length > 0
        ) {
          let AllDataFiltered = state.AllData.filter(
            (item) => !item.hasOwnProperty("selectASINCard")
          );
          state.AllData = [
            ...AllDataFiltered,
            {
              ...action.payload,
            },
          ];
        } else {
          state.AllData.push(action.payload);
        }
      }

      if (
        typeof action.payload === "object" &&
        action.payload !== null &&
        action.payload.hasOwnProperty("groupName")
      ) {
        state.AddVehicleInfo4 = action.payload;

        if (
          state.AllData.filter((item) => item.hasOwnProperty("groupName"))
            .length > 0
        ) {
          let AllDataFiltered = state.AllData.filter(
            (item) => !item.hasOwnProperty("groupName")
          );
          state.AllData = [
            ...AllDataFiltered,
            {
              ...action.payload,
            },
          ];
        } else {
          // state.AllData.push(action.payload);
          if (state.AllData.length > 0) {
            state.AllData = [
              ...state.AllData,
              {
                ...state.AddVehicleInfo,
                ...state.AddVehicleInfo2,
                ...state.AddVehicleInfo3,
                ...state.AddVehicleInfo4,
              },
            ];
            state.AddVehicleInfo = {};
            state.AddVehicleInfo2 = {};
            state.AddVehicleInfo3 = {};
            state.AddVehicleInfo4 = {};
          } else {
            state.AllData = [
              {
                ...state.AddVehicleInfo,
                ...state.AddVehicleInfo2,
                ...state.AddVehicleInfo3,
                ...state.AddVehicleInfo4,
              },
            ];
            state.AddVehicleInfo = {};
            state.AddVehicleInfo2 = {};
            state.AddVehicleInfo3 = {};
            state.AddVehicleInfo4 = {};
          }
        }
      }
    },
    empty: (state) => {
      state.AddVehicleInfo = {};
      state.AddVehicleInfo2 = {};
      state.AddVehicleInfo3 = {};
      state.AddVehicleInfo4 = {};
      state.AllData = [];
    },
    DeleteOne: (state, { payload }) => {
      state.AllData = state.AllData.filter(
        (item) => item.VehicleID !== payload
      );
    },
  },
  extraReducers: {
    // Vehicles
    [fetchVehicles.pending]: (state) => {
      state.loading = true;
    },
    [fetchVehicles.fulfilled]: (state, { payload }) => {
      state.AllData = payload.Vehicles;
      state.loading = false;
    },
    [fetchVehicles.rejected]: (state, { payload }) => {
      state.error.error = payload?.error;
      state.error.message = payload?.message;
      state.loading = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { add, empty, DeleteOne } = vehicleInfo.actions;

export default vehicleInfo.reducer;
