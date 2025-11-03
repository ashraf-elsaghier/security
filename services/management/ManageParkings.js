import axios from "axios";
import { toast } from "react-toastify";

export const getAllParkings = async () => {
  const response = await axios.get(`dashboard/management/parking`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
export const getUnAssignedVehicles = async (id) => {
  try {
    const response = await axios({
      method: "get",
      url: `dashboard/management/unAssignedVehicles`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.unAssignedVehicles;
  } catch (error) {
    toast.error("Something went wrong while fetching unAssignedVehicles!");
  }
};
export const addParking = async (data) => {
  const response = await axios({
    method: "post",
    url: `/dashboard/management/parking`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const updateParkingVehicles = async (id, vehicles, method) => {
  const response = await axios({
    method: "put",
    url: `/dashboard/management/updateParkingVehicles/${id}`,
    data: JSON.stringify({ vehicles: vehicles, method: method }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};
export const deleteParking = async (id) => {
  const response = await axios({
    method: "delete",
    url: `/dashboard/management/parking/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const updateParking = async (ID, value) => {
  const response = await axios({
    method: "put",
    url: `/dashboard/management/parking/${ID}`,
    data: JSON.stringify(value),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const getParkingVehicles = async (id) => {
  try {
    const response = await axios({
      method: "get",
      url: `dashboard/management/parking/${id}`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.assignedVehicles;
  } catch (error) {
    toast.error("Something went wrong!");
  }
};
