import React, { useEffect, useState } from "react";
import { Card, Col } from "react-bootstrap";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const VehicleViolations = ({ data }) => {
  const { t } = useTranslation(["vehicle"]);
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);
  useEffect(() => {
    if (data) {
      const seriesData = data?.map((el) => {
        return Math.round(
          (el.harshBrakes + el.overSpeed + el.rapidAccelerations) / 3
        );
      });
      const labels = data?.map((el) =>
        new Date(`${el.date}`).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      );
      setSeries(seriesData);
      setLabels(labels);
    }
  }, [data]);

  const chart = {
    options: {
      chart: {
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      colors: ["#0E6395", "#4bc7d2"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "28%",
          endingShape: "rounded",
          borderRadius: 5,
        },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: labels,
        labels: {},
      },
      yaxis: {
        title: {
          text: "",
        },
        labels: {
          minWidth: 19,
          maxWidth: 19,
          style: {
            colors: "#8A92A6",
          },
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return " " + val;
          },
        },
      },
    },
    series: [
      {
        name: "violations_key",
        data: series,
      },
    ],
  };

  return (
    <Col md="6" lg="3">
      <Card
        style={{
          height: "calc(100% - 2rem)",
        }}
      >
        <Card.Body className="pb-0 text-start" style={{ direction: "ltr" }}>
          <h4>{t("violations_key")}</h4>
          <Chart
            className="d-activity"
            options={chart.options}
            series={chart.series}
            type="bar"
            height="260"
          />
        </Card.Body>
      </Card>
    </Col>
  );
};

export default VehicleViolations;
