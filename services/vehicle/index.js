import axios from "axios";

// fetch vehicle info(vehicle dashboard)
export const fetchVehicleData = async (id) => {
  const response = await axios({
    method: "get",
    url: `dashboard/vehicles/${id}`,
  });
  return response.data;
};

// fetch vehicle behavior and utilization(vehicle dashboard)
export const fetchVehicleBehaviorAndUtiz = async (id) => {
  const response = await axios({
    method: "get",
    url: `dashboard/driverVehicles/vehicle/utilizations/${id}`,
  });
  return response.data;
};

// fetch vehicle Humidity(vehicle dashboard)
export const fetchVehicleHumidity = async (id) => {
  const response = await axios({
    method: "get",
    url: `dashboard/driverVehicles/vehicle/avgHum/${id}`,
  });
  return response.data;
};

// fetch vehicle weight(vehicle dashboard)
export const fetchVehicleWeight = async (id) => {
  const response = await axios({
    method: "get",
    url: `dashboard/driverVehicles/vehicle/avgWeight/${id}`,
  });
  return response.data;
};

// fetch vehicle temperature(vehicle dashboard)
export const fetchVehicleTemperature = async (id) => {
  const response = await axios({
    method: "get",
    url: `dashboard/driverVehicles/vehicle/avgTemp/${id}`,
  });
  return response.data;
};

// fetch Vehicle Maintenance(vehicle dashboard)
export const fetchVehicleMaintenance = async (id) => {
  const response = await axios({
    method: "get",
    url: `dashboard/driverVehicles/vehicle/maintenance/${id}`,
  });
  return response.data;
};

// fetch Vehicle Positions(vehicle dashboard)
export const fetchVehiclePositions = async (id) => {
  const response = await axios({
    method: "get",
    url: `dashboard/driverVehicles/vehicle/mostVisit/${id}`,
  });
  return response.data;
};
