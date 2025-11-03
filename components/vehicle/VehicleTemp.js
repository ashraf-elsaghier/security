import React from "react";
import { Card, Col } from "react-bootstrap";
import EmptyMess from "components/UI/ChartErrorMsg";
import Spinner from "components/UI/Spinner";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const VehicleTemp = ({ data, loading }) => {
  const { t } = useTranslation(["vehicle"]);
  const chart = {
    series: [
      {
        name: t("temperature_key"),
        type: "line",
        data: [data?.minTemp, data?.maxTemp],
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
      labels: [t("min_key"), t("max_key")],
      colors: ["#485595"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "25%",
          endingShape: "rounded",
          borderRadius: 5,
        },
      },
      yaxis: [
        {
          title: {
            text: t("temperature_key"),
          },
        },
      ],
    },
  };
  return (
    <Col lg="6" xl="4">
      <Card style={{ height: "calc(100% - 2rem)" }}>
        {loading ? (
          <Spinner />
        ) : data && Object.keys(data)?.length > 0 ? (
          <Card.Body className="text-start" style={{ direction: "ltr" }}>
            <h5 className="mb-2">{t("temperature_key")}</h5>

            <Chart
              className="d-activity"
              options={chart.options}
              series={chart.series}
              type="line"
              height="300"
            />
          </Card.Body>
        ) : (
          <EmptyMess msg={`${t("oops!_no_data_found_key")}.`} />
        )}
      </Card>
    </Col>
  );
};

export default VehicleTemp;
