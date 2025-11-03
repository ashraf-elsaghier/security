import axios from "axios";

// fetch all sim cards(main page)
export const fetchAllSims = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/management/sim`,
  });
  return response.data;
};

// fetch all unassigned sims(main page)
export const fetchAllUnAssignedSims = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/management/sim/unassigned`,
  });
  return response.data;
};

// add new Sim(add Sim)
export const addSimRequest = async (data) => {
  const response = await axios({
    method: "post",
    url: "dashboard/management/sim",
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Add Sims Bulk data (main page)
export const postSimsBulk = async (data) => {
  const response = await axios({
    method: "post",
    url: `dashboard/management/sim/addbulk`,
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// delete sim data (main page)
export const deleteSim = async (deleteSelected) => {
  const response = await axios({
    method: "delete",
    url: `dashboard/management/sim/${deleteSelected}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// update sim data (main page)
export const updateSim = async (id, data) => {
  const response = await axios({
    method: "put",
    url: `dashboard/management/sim/${id}`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// fetch unassigned devices to assign sims (main page)
export const fetchUnassignedDevices = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/management/devices/nosim`,
  });
  return response.data;
};

// assign sim card to device
export const assignSimToDevice = async (id, data) => {
  const response = await axios({
    method: "post",
    url: `dashboard/management/sim/assign/${id}`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
