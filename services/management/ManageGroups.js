import axios from "axios";

// function to get all groups
export const getallGroups = async () => {
  // const storedGroups = JSON.parse(localStorage.getItem("groups"));
  // if (storedGroups) return storedGroups;
  const response = await axios.get(`dashboard/management/groups`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  // localStorage.setItem("groups", JSON.stringify(response.data));
  return response.data;
};

// function to get user groups
export const getUserGroups = async (userId) => {
  const response = await axios.get(`dashboard/management/groups/${userId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
// function to get all vehiclles
export const getAllVehicles = async (id) => {
  const response = await axios({
    method: "get",
    url: `dashboard/management/groups/vehicles/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// function to add new group
export const addGroups = async (data) => {
  const response = await axios({
    method: "post",
    url: `/dashboard/management/groups`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

// function to update group

export const updateGroups = async (ID, value) => {
  const response = await axios({
    method: "put",
    url: `/dashboard/management/groups/${ID}`,
    data: JSON.stringify(value),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// function to assign  and unassign

export const assigndata = async (data) => {
  const response = await axios({
    method: "put",
    url: "/dashboard/management/groups",
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
};
