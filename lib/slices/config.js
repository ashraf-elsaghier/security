import { createSlice } from "@reduxjs/toolkit";
import { encryptName } from "../../helpers/encryptions";

const dark = () => {
  if (typeof window !== "undefined") {
    if (JSON.parse(localStorage.getItem(encryptName("config")))?.darkMode) {
      return JSON.parse(localStorage.getItem(encryptName("config")))?.darkMode;
    } else if (JSON.parse(localStorage.getItem("lastConfig"))?.darkMode) {
      return JSON.parse(localStorage.getItem("lastConfig"))?.darkMode;
    } else {
      return false;
    }
  }
};

const lang = () => {
  if (typeof window !== "undefined") {
    if (JSON.parse(localStorage.getItem(encryptName("config")))?.language) {
      return JSON.parse(localStorage.getItem(encryptName("config")))?.language;
    } else if (JSON.parse(localStorage.getItem("lastConfig"))?.language) {
      return JSON.parse(localStorage.getItem("lastConfig"))?.language;
    } else {
      return "en";
    }
  }
};

let initialConfig = {
  darkMode: dark(),
  language: lang(),
  userImg: null,
};

const storage = (key, value) => {
  initialConfig[key] = value;
  localStorage.setItem(encryptName("config"), JSON.stringify(initialConfig));
};

export const ConfigSlice = createSlice({
  name: "config",
  initialState: {
    ...initialConfig,
  },
  reducers: {
    setConfigOnLogin: () => {
      localStorage.setItem(
        encryptName("config"),
        JSON.stringify(initialConfig)
      );
    },
    darkMode: (state) => {
      state.darkMode = !state.darkMode;
      storage("darkMode", state.darkMode);
      state.darkMode =
        typeof window !== undefined &&
        !JSON.parse(localStorage.getItem(encryptName("config"))).darkMode;
    },
    changeLanguage: (state, action) => {
      state.language = action.payload;
      storage("language", state.language);
      state.language =
        typeof window !== undefined &&
        !JSON.parse(localStorage.getItem(encryptName("config"))).language;
      // localStorage.language = state.language;
    },

    setConfig: (state, action) => {
      localStorage.setItem(
        encryptName("config"),
        JSON.stringify(action.payload)
      );
      Object.assign(state, action.payload);
    },
    userConfigImg: (state, action) => {
      state.userImg = action.payload;
      storage("userImg", state.userImg);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  darkMode,
  setConfig,
  changeLanguage,
  userConfigImg,
  setConfigOnLogin,
} = ConfigSlice.actions;

export default ConfigSlice.reducer;
