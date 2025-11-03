import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    isSeen: true,
  },
  reducers: {
    addNotification: (state, action) => {
      let isExist = false;
      state.notifications.forEach((n) => {
        if (
          n.serial == action.payload.serial &&
          n.type === action.payload.type
        ) {
          isExist = true;
        }
      });
      if (!isExist) {
        const newNotification = {
          type: action.payload.type,
          message: action.payload.message,
          time: moment().format("LLL"),
          seen: false,
          serial: action.payload.serial,
        };
        state.isSeen = false;
        state.notifications.unshift(newNotification);
        if (state.notifications.length > 100) state.notifications.pop();
      }
    },
    updateSeen: (state) => {
      state.isSeen = true;
    },
  },
});
export const { addNotification, updateSeen } = notificationsSlice.actions;
export default notificationsSlice.reducer;
