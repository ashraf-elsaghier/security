import { createSlice } from "@reduxjs/toolkit";
import { encryptName } from "../../helpers/encryptions";

export const FirebaseSlice = createSlice({
  name: "firebase",
  initialState: {
    Vehicles: [],
    VehicleCopy: [],
    filteredData: [],
    expand: [],
    check: [],
    popup: [],
    status: {},
    singleVehicle: {},
    FBpacket: [],
    all: 0,
    online: 0,
    offline: 0,
    overSpeeding: 0,
    filteredBtns: false,
    loading: false,
  },
  reducers: {
    Loading: (state, action) => {
      state.loading = action.payload;
    },

    VehiclesSettings: (state, action) => {
      state.Vehicles = action.payload;
      state.VehicleCopy = action.payload;
      const _USER_VEHICLES =
        JSON.parse(
          localStorage.getItem(encryptName("user_vehicles")) ?? "[]"
        ) ?? [];
      if (!_USER_VEHICLES) {
        localStorage.setItem(
          encryptName("user_vehicles"),
          JSON.stringify(state.Vehicles)
        );
      }
    },
    filteredBtnsFire: (state, action) => {
      state.filteredBtns = action.payload;
    },
    UpdateStatus: (state, action) => {
      if (action.payload?.SerialNumber) {
        if (
          state.Vehicles[
            state.Vehicles.findIndex(
              (x) => x.SerialNumber == action.payload?.SerialNumber
            )
          ].VehicleStatus !== action.payload?.VehicleStatus
        ) {
          state.status[action.payload?.SerialNumber] =
            action.payload?.VehicleStatus;
          state.Vehicles[
            state.Vehicles.findIndex(
              (x) => x.SerialNumber == action.payload?.SerialNumber
            )
          ] = action.payload;
        }
        localStorage.setItem(
          encryptName("vehicles_status"),
          JSON.stringify(state.status)
        );
      }
    },
    filterTree: (state, action) => {
      if (action.payload === 5) {
        state.VehicleCopy = [...state.Vehicles].filter(
          (x) => x?.VehicleStatus === 5 || x?.VehicleStatus === null
        );

      } else if (action.payload === 10) {
        state.VehicleCopy = [...state.Vehicles];
      } else {
        state.VehicleCopy = [...state.Vehicles].filter(
          (x) => x?.VehicleStatus !== 5 && x?.VehicleStatus !== null
        );
      }
    },
    filterStatusCars: (state, action) => {
      if (action.payload || action.payload === 0) {
        state.VehicleCopy = [...state.Vehicles].filter(
          (x) => x?.VehicleStatus === action.payload
        );
      } else {
        state.VehicleCopy = [...state.Vehicles];
      }
    },
    UpdateStatusOnce: (state, action) => {
      if (action.payload?.SerialNumber) {
        if (
          state.Vehicles[
            state.Vehicles.findIndex(
              (x) => x.SerialNumber == action.payload?.SerialNumber
            )
          ].VehicleStatus !== action.payload?.VehicleStatus
        ) {
          state.status[action.payload?.SerialNumber] =
            action.payload?.VehicleStatus;
          state.Vehicles[
            state.Vehicles.findIndex(
              (x) => x.SerialNumber == action.payload?.SerialNumber
            )
          ] = action.payload;
        }
        localStorage.setItem(
          encryptName("vehicles_status"),
          JSON.stringify(state.status)
        );
      }
    },

    UpdateVehicle: (state, { payload }) => {
      state.Vehicles = payload;
      state.VehicleCopy = payload;
    },

    SetStatusAll: (state, action) => {
      state.all = action.payload.length;
    },
    SetStatusOnline: (state, action) => {
      state.online = action.payload.filter(
        (it) => it.VehicleStatus === 1
      ).length;
    },
    SetStatusOffline: (state, action) => {
      state.offline = action.payload.filter(
        (it) => it.VehicleStatus === 0
      ).length;
    },
    SetStatusOnce: (state, action) => {
      state.status[action.payload?.SerialNumber] =
        action.payload?.VehicleStatus;
    },
    SyncOnExpand: (state, action) => {
      state.expand = action.payload;
    },
    SyncOnCheck: (state, action) => {
      state.check = action.payload?.map((i) => i?.data);
    },
    SyncOnPopupCheck: (state, action) => {
      state.popup = action.payload?.map((i) => i?.data);
    },
  },
});
// Action creators are generated for each case reducer function
export const {
  VehiclesSettings,
  SyncOnExpand,
  UpdateStatus,
  UpdateVehicleStatus,
  UpdateStatusOnce,
  UpdateVehicle,
  filterStatusCars,
  filteredBtnsFire,
  filterTree,
  SetStatusAll,
  SetStatusOnline,
  SetStatusOffline,
  SetStatusOnce,
  SyncOnCheck,
  SyncOnPopupCheck,
  Loading,
} = FirebaseSlice.actions;

export default FirebaseSlice.reducer;
