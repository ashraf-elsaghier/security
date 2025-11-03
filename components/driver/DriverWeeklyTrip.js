import React from "react";
import { Card } from "react-bootstrap";
import dynamic from "next/dynamic";
import EmptyMess from "components/UI/ChartErrorMsg";
import Spinner from "components/UI/Spinner";
import { useTranslation } from "next-i18next";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const DriverWeeklyTrip = ({ data, loading }) => {
  const { t } = useTranslation(["driver"]);
  
  const yAxis = data?.map((ele) => ele.count);
  const xAxis = data?.map((ele) =>
    new Date(`${ele.Date}`).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  );
  const Chart4 = {
    series: [
      {
        name: t("number_of_trips_key"),
        data: yAxis,
      },
    ],
    options: {
      chart: {
        height: 300,
        type: "area",
      },
      plotOptions: {
        bar: {
          borderRadius: 2,
          dataLabels: {
            position: "top", // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#485595"],
        },
      },
      stroke: {
        curve: "smooth",
        width: 1,
      },
      colors: ["#485595"],
      xaxis: {
        categories: xAxis,
        title: {
          text: t("date_key"),
        },
      },
      yaxis: {
        title: {
          text: t("number_of_trips_key"),
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
          <h4 className="text-secondary text-center">{t("weekly_trips_key")}</h4>
          <Chart
            options={Chart4.options}
            series={Chart4.series}
            type="area"
            height={350}
          />
        </Card.Body>
      ) : (
        <EmptyMess msg={`${t("oops!_no_data_found_key")}.`} />
      )}
    </Card>
  );
};

export default DriverWeeklyTrip;
