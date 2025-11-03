import React from "react";
import { Card, Col } from "react-bootstrap";
import EmptyMess from "components/UI/ChartErrorMsg";
import Spinner from "components/UI/Spinner";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const VehicleAvgHumidity = ({ data, loading }) => {
  const { t } = useTranslation(["vehicle"]);

  const yAxis = data?.map((ele) => ele.avgHumidity);
  const xAxis = data?.map((ele) =>
    new Date(`${ele.strDate}`).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  );
  const chart = {
    series: [
      {
        name: t("average_humidity_key"),
        type: "line",
        data: yAxis,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
      },
      labels: xAxis,
      colors: ["#3e84b8"],
      yaxis: [
        {
          title: {
            text: t("average_humidity_key"),
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          endingShape: "rounded",
          borderRadius: 5,
        },
      },
    },
  };
  return (
    <Col lg="6" xl="4">
      <Card
        style={{
          height: "calc(100% - 2rem)",
        }}
      >
        {loading ? (
          <Spinner />
        ) : data.length > 0 ? (
          <Card.Body className="pb-0 text-start" style={{ direction: "ltr" }}>
            <h5>{t("average_humidity_for_this_monthly_key")}</h5>
            <Chart
              options={chart.options}
              series={chart.series}
              type="line"
              height="325"
            />
          </Card.Body>
        ) : (
          <EmptyMess msg={`${t("oops!_no_data_found_key")}.`} />
        )}
      </Card>
    </Col>
  );
};

export default VehicleAvgHumidity;
