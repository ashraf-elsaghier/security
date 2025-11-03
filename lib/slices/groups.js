import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Function to check if groups are available in local storage
const getGroupsFromLocalStorage = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    const groups = localStorage.getItem("groups");
    return groups ? JSON.parse(groups) : [];
  }
  return [];
};
export const fetchGroups = createAsyncThunk(
  "groups/fetchGroups",
  async (_, { rejectWithValue }) => {
    try {
      // Check if groups are available in local storage
      const groups = getGroupsFromLocalStorage();
      if (groups.length > 0) {
        return groups;
      }

      // Fetch groups from the endpoint
      const response = await axios.get(`dashboard/management/groups`);
      const fetchedGroups = response.data.result;

      // Update groups in local storage after fetching
      localStorage.setItem("groups", JSON.stringify(fetchedGroups));

      return fetchedGroups;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const groupsSlice = createSlice({
  name: "groups",
  initialState: {
    groups: getGroupsFromLocalStorage(), // Initialize with groups from local storage
    status: "idle",
    error: null,
  },
  reducers: {
    deleteGroup(state, action) {
      const groupId = action.payload;
      state.groups = state.groups.filter((group) => group.ID !== groupId);
      // Update groups in local storage after deleting
      localStorage.setItem("groups", JSON.stringify(state.groups));
    },
    editGroup(state, action) {
      const editedGroup = action.payload;
      state.groups = state.groups.map((group) =>
        group.ID === editedGroup.ID ? { ...group, ...editedGroup } : group
      );
      // Update groups in local storage after editing
      localStorage.setItem("groups", JSON.stringify(state.groups));
    },
    addGroup(state, action) {
      const newGroup = action.payload;
      state.groups.push(newGroup);
      // Update groups in local storage after adding
      localStorage.setItem("groups", JSON.stringify(state.groups));
    },
  },
  extraReducers: {
    [fetchGroups.pending]: (state) => {
      state.status = "loading";
    },
    [fetchGroups.fulfilled]: (state, { payload }) => {
      state.status = "succeeded";
      state.groups = payload;
      // Update groups in local storage after fetching
      localStorage.setItem("groups", JSON.stringify(state.groups));
    },
    [fetchGroups.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
  },
});

export const { deleteGroup, editGroup, addGroup } = groupsSlice.actions;

export default groupsSlice.reducer;
