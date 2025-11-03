import React from "react";
import { Card } from "react-bootstrap";
import dynamic from "next/dynamic";
import EmptyMess from "components/UI/ChartErrorMsg";
import Spinner from "components/UI/Spinner";
import { useTranslation } from "next-i18next";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const DriverUtilizationStatistics = ({ data = {}, loading }) => {
  const { t } = useTranslation(["driver"]);

  const total = data?.Parking + data?.Driving + data?.idleTime;  
  const parking = data?.Parking !== 0 ?  ((data?.Parking / total) * 100).toFixed(2) :  data?.Parking;
  const driving = data?.Driving !== 0 ?  ((data?.Driving / total) * 100).toFixed(2) : data?.Driving;
  const idle = data?.idleTime !== 0 ?  ((data?.idleTime / total) * 100).toFixed(2) : data?.idleTime;

  const chart = {
    series: [parking, driving, idle],
    options: {
      chart: {
        height: 350,
        type: "radialBar",
      },
      theme: {
        palette: "palette2",
      },
      dataLabels: {
        enabled: true,
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "22px",
            },
            value: {
              fontSize: "16px",
            },
            total: {
              show: true,
              label: t("total_key"),
              formatter: function () {
                return isNaN(+total)  ? 0  :+total;
              },
            },
          },
        },
      },
      labels: [t("parking_key"), t("driving_key"), t("idling_key")],
      legend: {
        show: true,
        floating: false,
        fontSize: "14rem",
        position: "bottom",
        labels: {
          useSeriesColors: false,
          colors: ["#585858"],
        },
        formatter: function (seriesName, opts) {
          return (
            seriesName +
            ":  " +
            +Math.round(
              (opts.w.globals.series[opts.seriesIndex] * total) / 100
            ) +
            " " +
            t("hr_key")
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
    <Card
      className="shadow-sm border border-light"
      style={{ height: "calc(100% - 2rem)" }}
    >
      {loading ? (
        <Spinner />
      ) : Object.keys(data) ? (
        <Card.Body style={{ direction: "ltr" }}>
          <h4 className="text-secondary text-center">
            {t("utilization_statistics_key")}
          </h4>
          <Chart
            options={chart.options}
            series={chart.series}
            type="radialBar"
            height={350}
          />
        </Card.Body>
      ) : (
        <EmptyMess msg={`${t("oops!_no_data_found_key")}.`} />
      )}
    </Card>
  );
};

export default DriverUtilizationStatistics;
