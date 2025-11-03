import axios from "axios";

// fetch All scheduled Reports
export const fetchAllScheduledReports = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/reports/userReport`,
  });
  return response.data;
};
export const fetchScheduledReport = async (id) => {
  const response = await axios({
    method: "get",
    url: `dashboard/reports/${id}`,
  });
  return response.data;
};

// getting Reports types
export const fetchAllReportsTypes = async () => {
  const response = await axios({
    method: "get",
    url: `/dashboard/management/users/reports`,
  });
  return response.data.reports;
};

// getting uservehicle
export const fetchAllUserVehicles = async () => {
  const response = await axios({
    method: "get",
    url: `/dashboard/reports/usersVehicles`,
  });

  return response.data;
};

// getting users
export const fetchAllUsers = async () => {
  const response = await axios({
    method: "get",
    url: `dashboard/reports/allusers`,
  });

  return response.data;
};

// adding new report
export const addNewReport = async (item) => {
  const response = await axios({
    method: "post",
    url: `/dashboard/reports/addReportSchedule`,
    data: JSON.stringify({ data: item }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

// deactive reports
export const deactivateReport = async (id) => {
  const response = await axios({
    method: "put",
    url: `/dashboard/reports/deactive/${id}`,
  });
  return response.data;
};

// active reports
export const activateReport = async (id) => {
  const response = await axios({
    method: "put",
    url: `/dashboard/reports/enable/${id}`,
  });
  return response.data;
};

// update report

export const updateReport = async (id, data) => {
  const response = await axios({
    method: "put",
    url: `/dashboard/reports/update/${id}`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// delete report
export const deleteReport = async (id) => {
  const response = await axios({
    method: "delete",
    url: `/dashboard/reports/delete?reportids=${id}`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
