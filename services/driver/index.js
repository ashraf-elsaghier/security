import axios from "axios";
import {formatDuration} from "helpers/helpers";
// fetch driver info(driver dashboard)
export const fetchDriverData = async (id) => {
  try{
    const response = await axios({
      method: "get",
      url: `dashboard/drivers/${id}`,
    });
    return response?.status==200 ? response?.data : [];
  }catch(e){
    return [];
  }

};

export const fetchDriverDataByRfid = async (rfid) => {
  try{
    const response = await axios({
      method: "get",
      url: `dashboard/drivers/rfid/${rfid}`,
    });
    return response?.status==200 ? response?.data : [];
  }catch(e){
    return [];
  }  
};

// fetch Over Speed Statistics(driver dashboard)
export const fetchOverSpeedStatistics = async (id) => {
  const response = await axios({
    method: "get",
    url: `dashboard/driverVehicles/driver/overspeed/${id}`,
  });
  return response.data;
};

// fetch Weekly trips and fuel consumption(driver dashboard)
export const fetchWeeklyTripsAndFuel = async (id) => {
  const response = await axios({
    method: "get",
    url: `dashboard/driverVehicles/driver/trips/${id}`,
  });
  return response.data;
};

// fetch utilization statistics and driver behavior(driver dashboard)
export const fetchUtzStatisticsAndBehavior = async (id) => {
  const response = await axios({
    method: "get",
    url: `dashboard/driverVehicles/driver/utilization/${id}`,
  });
  response.data = (!response?.data?.length) ? response?.data : response?.data.map(x=>{return {...x, Duration: formatDuration(x.Duration,5)};});
  return response.data;
};

// fetch driver positions for map(driver dashboard)
export const fetchDriverPositions = async (id) => {
  const response = await axios({
    method: "get",
    url: `dashboard/driverVehicles/driver/mostVisit/${id}`,
  });
  return response.data;
};