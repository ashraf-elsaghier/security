import axios from "axios";
import { signOut } from "next-auth/client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const usefetchHomeData = () => {
  const [speedChartData, setSpeedChartData] = useState([]);
  const [speedChartDataLoading, setSpeedChartDataLoading] = useState(false);
  const [preventiveChartData, setPreventiveChartData] = useState([]);
  const [preventiveChartDataLoading, setPreventiveChartDataLoading] =
    useState(false);
  ("change from null to empt array");
  const [averageUtilizationChart, setAverageUtilizationChart] = useState([]);
  const [averageUtilizationChartLoading, setAverageUtilizationChartLoading] =
    useState(false);

  const [DashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source();

    // fetch Overall Preventive Maintenance chart data
    const fetchPreventiveData = async () => {
      setPreventiveChartDataLoading(true);
      try {
        const respond = await axios.get(`dashboard/mainDashboard/home`, {
          cancelToken: cancelTokenSource.token,
        });
        if (respond.status === 200) {
          setPreventiveChartData(respond?.data || {});

          setPreventiveChartDataLoading(false);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
        if (error?.response?.data?.message == "User not found") {
          signOut();
        }
        setPreventiveChartDataLoading(false);
      }
      return true;
    };
    fetchPreventiveData();

    // top and low rated drivers
    const fetchTopLowData = async () => {
      await axios
        .get(`dashboard/mainDashboard/topWorst`, {
          cancelToken: cancelTokenSource.token,
        })
        .then(({ data }) => {
          setDashboardData(data);
        })
        .catch((error) => {
          // toast.error(error?.response?.data?.message);
        });
      return true;
    };
    fetchTopLowData();

    // fetch Average Utilization chart data
    const fetchAverageUtilizationData = async () => {
      setAverageUtilizationChartLoading(true);
      try {
        const respond = await axios.get(
          `dashboard/mainDashboard/avgUtlization`,
          {
            cancelToken: cancelTokenSource.token,
          }
        );
        setAverageUtilizationChart(respond?.data?.avgUtlizations);

        setAverageUtilizationChartLoading(false);
      } catch (error) {
        // toast.error(error?.response?.data?.message);
        setAverageUtilizationChartLoading(false);
      }
      return true;
    };
    fetchAverageUtilizationData();

    // fetch Overall average speed chart data
    const fetchAverageSpeedData = async () => {
      setSpeedChartDataLoading(true);
      try {
        const respond = await axios.get(`dashboard/mainDashboard/fuel`, {
          cancelToken: cancelTokenSource.token,
        });
        setSpeedChartData(respond?.data?.fuelConsumptions);

        setSpeedChartDataLoading(false);
      } catch (error) {
        toast.error(error?.response?.data?.message);
        setSpeedChartDataLoading(false);
      }

      return true;
    };
    fetchAverageSpeedData();

    return () => {
      // Cancel the request when the component is unmounted
      cancelTokenSource.cancel("Request canceled by cleanup");
    };
  }, []);
  return {
    speedChartData,
    speedChartDataLoading,
    preventiveChartData,
    preventiveChartDataLoading,
    averageUtilizationChart,
    averageUtilizationChartLoading,
    DashboardData,
  };
};

export default usefetchHomeData;
