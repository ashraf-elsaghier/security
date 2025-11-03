import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { useState, useEffect, memo } from "react";
import { Col } from "react-bootstrap";
import Styles from "../../../styles/Dashboard.module.scss";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useDispatch } from "react-redux";
import { updateReportData } from "lib/slices/dashboardReports";
import router from "next/router";
import { useVehicleContext } from "context/VehiclesContext";

const VehiclesStatusChart = () => {
  const { t } = useTranslation("Dashboard");
  const { vehicles } = useVehicleContext();

  const dispatch = useDispatch();
  const [vehicleCounts, setVehicleCounts] = useState({
    offlineVehs: 0,
    runningVehs: 0,
    stoppedVehs: 0,
    sleepVehs: 0,
    overSpeedVehs: 0,
    idleVehs: 0,
    invalidVehs: 0,
    overspeedStreetVehs: 0,
  });

  // useEffect(() => {
  //   const updated = vehicles.map((e) => {
  //     const temp = { ...e };
  //     if (e.Speed >= e.SpeedLimit) {
  //       temp = { ...e, VehicleStatus: 101 };
  //     }
  //     return temp;
  //   });

  //   setAllTreeData(updated);
  // }, [vehicles]);

  useEffect(() => {
    if (vehicles) {
      const offlineCount =
        calculateVehicleCount(vehicles, 5) +
        calculateVehicleCount(vehicles, 600);
      const runningCount = calculateVehicleCount(vehicles, 1);
      const stoppedCount = calculateVehicleCount(vehicles, 0);
      const sleepCount = calculateVehicleCount(vehicles, 204);
      const overSpeedCount = calculateVehicleCount(vehicles, 101);
      const idleCount = calculateVehicleCount(vehicles, 2);
      const invalidCount =
        calculateVehicleCount(vehicles, 203) +
        calculateVehicleCount(vehicles, 201);
      const overSpeedStreetCount = calculateVehicleCount(vehicles, 100);

      setVehicleCounts((prevCounts) => ({
        ...prevCounts,
        offlineVehs: offlineCount,
        runningVehs: runningCount,
        stoppedVehs: stoppedCount,
        sleepVehs: sleepCount,
        overSpeedVehs: overSpeedCount,
        idleVehs: idleCount,
        invalidVehs: invalidCount,
        overspeedStreetVehs: overSpeedStreetCount,
      }));
    }
  }, [vehicles]);
  const calculateVehicleCount = (data, status) => {
    return data?.filter((e) => e?.VehicleStatus === status)?.length || 0;
  };

  const Offline =
    +((vehicleCounts.offlineVehs / vehicles?.length) * 100).toFixed(1) || 0;
  const Idleing =
    +((vehicleCounts.idleVehs / vehicles?.length) * 100).toFixed(1) || 0;
  const Running =
    +((vehicleCounts.runningVehs / vehicles?.length) * 100).toFixed(1) || 0;
  const Sleeping =
    +((vehicleCounts.sleepVehs / vehicles?.length) * 100).toFixed(1) || 0;
  const Stopped =
    +((vehicleCounts.stoppedVehs / vehicles?.length) * 100).toFixed(1) || 0;
  const OverStreetSpeed =
    +((vehicleCounts.overspeedStreetVehs / vehicles?.length) * 100).toFixed(
      1
    ) || 0;
  const OverSpeed =
    +((vehicleCounts.overSpeedVehs / vehicles?.length) * 100).toFixed(1) || 0;
  const invalidLocations =
    +((vehicleCounts.invalidVehs / vehicles?.length) * 100).toFixed(1) || 0;

  const chart = {
    series: [
      Offline,
      Idleing,
      Running,
      Stopped,
      OverStreetSpeed,
      OverSpeed,
      invalidLocations,
      Sleeping,
    ],
    options: {
      chart: {
        fontFamily: "Cairo, sans-serif",
        type: "radialBar",
        redrawOnParentResize: true,
        events: {
          click: (e) => {
            e.stopPropagation();
            if (!e.target.classList.value) {
              dispatch(
                updateReportData({
                  api: "dashboard/reports/userVehicles",
                  reportName: "User_Vehicles_key",
                  isFromDashboard: true,
                })
              );
              router.push("/reports");
              return;
            }
            switch (e.target.getAttribute("stroke")) {
              case "rgba(193,193,193,0.85)":
                dispatch(
                  updateReportData({
                    api: "dashboard/reports/offlineVehicles",
                    reportName: "Offline_Vehicles_Report_key",
                    isFromDashboard: true,
                  })
                );
                router.push("/reports");
                break;
            }
          },
        },
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 360,
          track: {
            show: true,
            startAngle: undefined,
            endAngle: undefined,
            background: "#ddd",
            strokeWidth: "97%",
            opacity: 0.2,
            margin: 5,
            dropShadow: {
              enabled: false,
            },
          },
          hollow: {
            margin: 5,
            size: "30%",
            background: "transparent",
            image: undefined,
          },
          dataLabels: {
            colors: ["#585858"],
            name: {
              show: false,
            },

            value: {
              fontSize: "1.5rem",
              show: true,
              offsetY: 9,
              color: "#585858",
            },
          },
        },
      },
      colors: [
        "#c1c1c1",
        "#70ea6b",
        "#26c6da",
        "#272727",
        "#f2bf59",
        "#f05959",
        "#7668f2",
        "purple",
      ],
      labels: [
        t("Offline"),
        t("Idling"),
        t("Running"),
        t("Stopped"),
        t("Over_Street_Speed"),
        t("Over_Speed"),
        t("Invalid_Locations"),
        t("Sleeping_Mode"),
      ],
      legend: {
        show: true,
        floating: false,
        fontSize: "12rem",
        position: "right",
        labels: {
          useSeriesColors: false,
          colors: ["#585858"],
        },
        formatter: function (seriesName, opts) {
          return (
            seriesName + ":  " + opts.w.globals.series[opts.seriesIndex] + "%"
          );
        },
        markers: {
          size: 0,
        },
        itemMargin: {
          vertical: 5,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };
  return (
    <>
      <Col md="12" xl="6" id="vehicles-status" style={{ cursor: "pointer" }}>
        <div className="card">
          <div className="card-header d-flex justify-content-between flex-wrap">
            <div className="header-title">
              <h4 className={"card-title " + Styles.head_title}>
                {t("Vehicles_Status")}
              </h4>
            </div>
          </div>
          <div className="card-body">
            <Chart
              options={chart?.options}
              series={chart?.series}
              type="radialBar"
              height="320"
            />
          </div>
        </div>
      </Col>
    </>
  );
};

export default memo(VehiclesStatusChart);
