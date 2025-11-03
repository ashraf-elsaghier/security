import { createSlice } from "@reduxjs/toolkit";

export const addFormDatas = createSlice({
  name: "addFormDatas",
  initialState: {
    data: {},
  },
  reducers: {
    addFormData: (state, action) => {
      if (action.payload.clear) {
        state.data = {};
      }
      state.data = { ...state.data, ...action.payload };
      localStorage.setItem("formData", JSON.stringify(state.data));
    },
  },
});

export const { addFormData } = addFormDatas.actions;
export default addFormDatas.reducer;
