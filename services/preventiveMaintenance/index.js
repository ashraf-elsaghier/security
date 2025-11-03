import axios from "axios";

// fecth all preventive maintenance(main page)
export const fetchAllPreventiveMaintenance = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/management/maintenance`,
  });
  return response.data;
};

// delete preventive maintenance (main page)
export const deletePreventive = async (deleteSelected) => {
  const response = await axios({
    method: "delete",
    url: `dashboard/management/maintenance/${deleteSelected}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// fecth view history data(view history page)
export const viewHistory = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/management/maintenance/info/history`,
  });
  return response.data;
};

// confirm new preventive maintenance(add page)
export const confirmPreventive = async (data) => {
  const response = await axios({
    method: "post",
    url: "dashboard/management/maintenance/checkMaintenance",
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// add new preventive maintenance(add page)
export const addNewPreventive = async (data) => {
  const response = await axios({
    method: "post",
    url: "dashboard/management/maintenance",
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
export const replacePreventive = async (data) => {
  const response = await axios({
    method: "put",
    url: "dashboard/management/maintenance/replace",
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// get data of preventive maintenance to edit(edit page)
export const fitchPreventiveForEdit = async (id) => {
  const response = await axios({
    method: "get",
    url: `dashboard/management/maintenance/${id}`,
  });
  return response.data;
};

// update preventive maintenance after edit(edit page)
export const updatePreventive = async (id, data) => {
  const response = await axios({
    method: "put",
    url: `dashboard/management/maintenance/${id}`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
