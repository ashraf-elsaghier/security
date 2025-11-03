import axios from "axios";

// fecth all drivers data(main page)
export const fetchAllDrivers = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/drivers`,
  });
  return response.data;
};

//fetch all drivers with cameras
export const fetchAllCamDrivers = async () => {
  const response = await axios({
    method: "get",
    url: `vehicles/settings?devType=cam&withloc=1`,
  });
  return response.data;
};

// delete driver (main page)
export const deleteDriver = async (deleteSelected) => {
  const response = await axios({
    method: "delete",
    url: `dashboard/drivers/${deleteSelected}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// fitch Unassigned Vehicles data (add driver / show vehicles)
export const fitchUnassignedVehicles = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/vehicles/info/unassigned`,
  });
  return response.data;
};

// add new driver(add driver)
export const addDriver = async (formData) => {
  const response = await axios
    .post("dashboard/drivers", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  return response.data;
};

// add vehicle to driver(add driver / show vehicles)
export const addVehicleToDriver = async (DriverID, VehicleID, EmailUsers) => {
  const response = await axios({
    method: "post",
    url: "dashboard/drivers/vehicle/assign",
    data: JSON.stringify({
      DriverID,
      VehicleID,
      EmailUsers,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// get driver data to edit (edit driver)
export const getDriverDataToEdit = async (id) => {
  const response = await axios({
    method: "get",
    url: `dashboard/drivers/${id}`,
  });
  return response.data;
};

// update driver data after edit (edit driver)
export const updateDriver = async (id, formData) => {
  const response = await axios
    .put(`dashboard/drivers/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

  return response.data;
};

// fetch assigned vehicles to driver(show vehicles)
export const getDriverAssignedVehicles = async (id) => {
  const response = await axios({
    method: "get",
    url: `dashboard/drivers/vehicles/${id}`,
  });
  return response.data;
};

// unassign vehicle from driver (show vehicles)
export const UnAssignVehicle = async (DriverID, VehicleID, EmailUsers) => {
  const response = await axios({
    method: "delete",
    url: `dashboard/drivers/vehicle/unassign`,
    data: JSON.stringify({
      DriverID,
      VehicleID,
      EmailUsers,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// handel upload Image
export const handleSubmitImage = async (event, image) => {
  event.preventDefault();
  const formData = new FormData();
  formData.append("image", image);

  try {
    const response = await axios({
      method: "put",
      url: "/config",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => {
      console.log(response);
    });
  } catch (error) {
    console.log(error);
  }
};
