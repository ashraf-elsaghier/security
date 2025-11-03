import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { memo } from "react";
import { Col } from "react-bootstrap";
import Styles from "../../../styles/Dashboard.module.scss";
import EmptyMess from "components/UI/ChartErrorMsg";
import Spinner from "components/UI/Spinner";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const OverallPreventiveMaintenance = ({ data, loading }) => {
  const { t } = useTranslation("Dashboard");
  const xAxis = data?.map((ele) => t(ele?.MaintenancePlan)) ?? [];
  const yAxis = data?.map((ele) => ele?.numOfMaintenance) ?? [];

  const chart = {
    series: [
      {
        name: t("Number_of_Vehicles"),
        data: yAxis,
      },
    ],
    options: {
      chart: {
        fontFamily: "Cairo, sans-serif",

        height: 245,
        type: "bar",
        toolbar: {
          show: true,
        },
        sparkline: {
          enabled: false,
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

      /*grid: {
								row: {
										colors: ['#fff', '#f2f2f2']
								}
						},*/

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
        tickPlacement: "on",
      },
      yaxis: {
        title: {
          text: t("Number_of_Vehicles"),
        },
      },
      fill: {
        colors: ["#156796"],
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: ["#489AC9"],
          inverseColors: true,
          opacityFrom: 0.95,
          opacityTo: 0.85,
          stops: [50, 0, 100],
        },
      },
    },
  };
  return (
    <>
      <Col lg="6" id="preventive-maintenance">
        <div className="card">
          <div className="card-header d-flex justify-content-between flex-wrap">
            <div className="header-title">
              <h4 className={"card-title " + Styles.head_title}>
                {t("Overall_Preventive_Maintenance")}
              </h4>
            </div>
          </div>
          <div style={{ direction: "ltr" }} className="card-body">
            {loading ? (
              <Spinner />
            ) : data?.length > 0 ? (
              <Chart
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

export default memo(OverallPreventiveMaintenance);
