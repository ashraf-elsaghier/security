import React from "react";
import { Card, Col } from "react-bootstrap";
import EmptyMess from "components/UI/ChartErrorMsg";
import Spinner from "components/UI/Spinner";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const VehicleMaintenance = ({ data, loading }) => {
  const { t } = useTranslation(["vehicle"]);
  const xAxis = data?.map((ele) => ele?.MaintenancePlan);
  const yAxis = data?.map((ele) => ele?.numOfMaintenance);

  const chart = {
    series: [
      {
        name: t("number_of_vehicles_key"),
        data: yAxis,
      },
    ],
    options: {
      chart: {
        fontFamily: "Cairo, sans-serif",
        type: "bar",
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          columnWidth: "30%",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 0,
      },
      xaxis: {
        labels: {
          rotate: -45,
          rotateAlways: true,
          style: {
            fontSize: ".6rem",
            fontWeight: "bold",
          },
        },
        categories: xAxis,
      },
      yaxis: {
        title: {
          text: t("number_of_vehicles_key"),
        },
      },
      fill: {
        colors: ["#0E6395"],
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: ["#4bc7d2"],
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100],
        },
      },
    },
  };

  return (
    <Col lg="7">
      <Card style={{ height: "calc(100% - 2rem)" }}>
        {loading ? (
          <Spinner />
        ) : data.length > 0 ? (
          <Card.Body className="pb-0 mb-0 text-start" style={{ direction: "ltr" }}>
            <h5 className="mb-4">{t("maintenance_statics_key")}</h5>

            <Chart
              options={chart.options}
              series={chart.series}
              type="bar"
              height="450"
            />
          </Card.Body>
        ) : (
          <EmptyMess msg={`${t("oops!_no_data_found_key")}.`} />
        )}
      </Card>
    </Col>
  );
};

export default VehicleMaintenance;
