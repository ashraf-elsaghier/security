import { createSlice } from "@reduxjs/toolkit";

export const userInfo = createSlice({
  name: "userInfo",
  initialState: {
    user: {
      UserName: "",
      Email: "",
      EmailConfirmed: 1,
      PhoneNumber: "",
      PhoneNumberConfirmed: 1,
      TwoFactorEnabled: 1,
      LockoutEnabled: 0,
      AccessFailedCount: 0,
      FirstName: "",
      LastName: "",
    },
    selectedFns: {},
  },
  reducers: {
    addGeneralInfo: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    addRole: (state, action) => {
      state.user = { ...state.user, RoleId: +action.payload };
    },
    addPermissions: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    addSelectedFns: (state, action) => {
      state.selectedFns = { ...state.selectedFns, ...action.payload };
    },
    reset: (state) => {
      state.user = {
        UserName: "",
        Email: "",
        EmailConfirmed: 1,
        PhoneNumber: "",
        PhoneNumberConfirmed: 1,
        TwoFactorEnabled: 1,
        LockoutEnabled: 0,
        AccessFailedCount: 0,
        FirstName: "",
        LastName: "",
      };
      state.selectedFns = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addPermissions,
  addGeneralInfo,
  addRole,
  reset,
  addSelectedFns,
} = userInfo.actions;

export default userInfo.reducer;
