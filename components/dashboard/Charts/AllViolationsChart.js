import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { memo } from "react";
import { Col } from "react-bootstrap";
import Styles from "../../../styles/Dashboard.module.scss";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import EmptyMess from "components/UI/ChartErrorMsg";
import Spinner from "components/UI/Spinner";
import router from "next/router";
import { updateReportData } from "lib/slices/dashboardReports";
import { useDispatch } from "react-redux";

const AllViolationsChart = ({ data, loading }) => {
  const { t } = useTranslation("Dashboard");
  const yAxis = Object.values(data)?.map((v) => v);
  const xAxis = Object.keys(data)?.map((k) => t(k));
  const dispatch = useDispatch();
  const chart = {
    series: [
      {
        name: t("All_Violations"),
        data: yAxis,
      },
    ],
    options: {
      chart: {
        fontFamily: "Cairo , sans-serif",
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      colors: ["#0E6395"],
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
        categories: xAxis,

        labels: {
          style: {
            colors: "#8A92A6",
            fontSize: ".7rem",
            fontWeight: "bold",
          },
        },
      },
      yaxis: {
        title: {
          text: t("All_Violations"),
        },
        labels: {
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
            return ` ${val} ${t("Events")}`;
          },
        },
      },
    },
  };
  return (
    <>
      <Col
        md="12"
        id="average-violations"
        onClick={() => {
          dispatch(
            updateReportData({
              api: "dashboard/reports/overSpeed",
              reportName: "Over_Speed_Report_key",
              isFromDashboard: true,
            })
          );
          router.push("/reports");
        }}
        style={{ cursor: "pointer" }}
      >
        <div className="card" style={{ height: "calc(100% - 2rem)" }}>
          <div className="card-header d-flex justify-content-between flex-wrap">
            <div className="header-title">
              <h4 className={"card-title " + Styles.head_title}>
                {t("All_Violations")}
              </h4>
            </div>
          </div>
          <div style={{ direction: "ltr" }} className="card-body">
            {loading ? (
              <Spinner />
            ) : Object.values(data).length > 0 ? (
              <Chart
                className="d-activity"
                options={chart.options}
                series={chart.series}
                type="bar"
                height="245"
              />
            ) : (
              <EmptyMess msg={`${t("oops!_no_data_found_key")}.`} />
            )}
          </div>
        </div>
      </Col>
    </>
  );
};

export default memo(AllViolationsChart);
