import axios from "axios";

// fetch All Assigned Devices(main page)
export const fetchAllAssignedDevices = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/management/devices`,
  });
  return response.data;
};

// fetch All Unassigned Devices(main page)
export const fetchAllUnAssignedDevices = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/management/devices/unassignedDevices`,
  });
  return response.data;
};

// fetch single Device(main page/edit)
export const fetchSingleDevice = async (id) => {
  const response = await axios({
    method: "get",
    url: `/dashboard/management/devices/${id}`,
  });
  return response.data;
};

// fetch single Device(main page/edit)
export const unAssginDevice = async (id, data) => {
  const response = await axios({
    method: "put",
    url: `/dashboard/management/devices/unassign/${id}`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
export const updateDevice = async (id, data) => {
  const response = await axios({
    method: "put",
    url: `/dashboard/management/devices/${id}`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
// fetch single Device(main page/edit)
export const assignDevice = async (id, data) => {
  const response = await axios({
    method: "put",
    url: `/dashboard/management/devices/${id}`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
export const unassignSimCard = async (id, data) => {
  const response = await axios({
    method: "put",
    url: `/dashboard/management/sim/unassign/${id}`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
export const assignSimCard = async (id, data) => {
  const response = await axios({
    method: "post",
    url: `/dashboard/management/sim/assign/${id}`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// add devices bulk(main page/bulk)
export const PostDevicesBulk = async (data) => {
  const response = await axios.post(
    `dashboard/management/devices/addBulk`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// delete device (main page/delete)
export const deleteDevice = async (deleteSelected) => {
  const response = await axios({
    method: "delete",
    url: `dashboard/management/devices/${deleteSelected}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// fitch Unassigned Vehicles data (assign device)
export const fitchUnassignedVehicles = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/vehicles/info/unassigned`,
  });
  return response.data;
};

// fetch device type for react select (add/add-device)
export const fetchDeviceTypes = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/management/devices/unassignedDevices`,
  });
  return response.data;
};

// fecth all unassigned sim cards data(add vehicle/add-sim)
export const fetchAllUnAssignedSimCardData = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/management/sim/unassigned`,
  });
  return response.data;
};

// add new device
export const addDeviceRequest = async (data) => {
  const response = await axios({
    method: "post",
    url: "dashboard/management/devices",
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// add new Sim
export const addSimRequest = async (data) => {
  const response = await axios({
    method: "put",
    url: "dashboard/vehicles/addSimToVehicle",
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
