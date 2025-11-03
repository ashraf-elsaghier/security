import React from "react";
import { Card } from "react-bootstrap";
import dynamic from "next/dynamic";
import EmptyMess from "components/UI/ChartErrorMsg";
import Spinner from "components/UI/Spinner";
import { useTranslation } from "next-i18next";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const DriverFuelConsumption = ({ data, loading }) => {
  const { t } = useTranslation(["driver"]);


  const yAxis = data?.map((ele) => ele.fuel.toFixed(2)) || [];
  const xAxis =
    data?.map((ele) =>
      new Date(`${ele.Date}`).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    ) || [];
  const chart = {
    series: [
      {
        name: t("fuel_consumption_key"),
        data: yAxis,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 1,
      },
      xaxis: {
        categories: xAxis,
      },
      tooltip: {
        x: {
          format: "dd/MM/yy",
        },
      },
    },
  };
  return (
    <Card className="shadow-sm border border-light">
      {loading ? (
        <Spinner />
      ) : data?.length > 0 ? (
        <Card.Body style={{direction:'ltr'}}>
          <h4 className="text-secondary text-center">{t("fuel_consumption_key")}</h4>
          <Chart
            options={chart.options}
            series={chart.series}
            type="area"
            height={250}
          />
        </Card.Body>
      ) : (
        <EmptyMess msg={`${t("oops!_no_data_found_key")}.`} />
      )}
    </Card>
  );
};

export default DriverFuelConsumption;
