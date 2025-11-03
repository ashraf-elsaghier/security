import { createSlice } from "@reduxjs/toolkit";
import { encryptName } from "../../helpers/encryptions";

let initialSystemConfig = {
  title: "",
  logo: "",
};

const storage = (key, value) => {
  initialSystemConfig[key] = value;
  localStorage.setItem(
    encryptName("systemConfig"),
    JSON.stringify(initialSystemConfig)
  );
};

export const SystemConfigSlice = createSlice({
  name: "systemConfig",
  initialState: {
    ...initialSystemConfig,
  },
  reducers: {
    setSystemConfig: (state, action) => {
      Object.assign(state, action.payload);
      storage("logo", state.logo);
      storage("title", state.title);
    },
  },
});

export const { setSystemConfig } = SystemConfigSlice.actions;

export default SystemConfigSlice.reducer;
