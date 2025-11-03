import React from "react";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import Styles from "styles/history-chart.module.scss";
import moment from "moment";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ChartCom = ({ SelectedLocations, chartModal, setchartModal }) => {
  const { t } = useTranslation("Dashboard");
  const darkMode = useSelector((state) => state.config.darkMode);
  const series = [
    {
      name: `${t("Speed")}`,
      data: SelectedLocations
        ? [...SelectedLocations?.map((el) => el?.Speed)]
        : [],
    },
  ];
  const options = {
    chart: {
      height: 200,
      type: "area",
      toolbar: {
        export: {
          csv: {
            headerCategory: "Record Date Time",
            columnDelimiter: ",",
            dateFormatter: function (timestamp) {
              return moment(timestamp).local().format("YYYY-MM-DD HH:mm");
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 1,
    },
    xaxis: {
      type: "datetime",
      categories: SelectedLocations
        ? [...SelectedLocations?.map((el) => el?.RecordDateTime)]
        : [],
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  };

  return (
    <>
      <div className={`${Styles.menu_bottom_main} d-flex position-absolute`}>
        <div
          className={`position-fixed ${Styles.AddGeofence} ${
            chartModal ? Styles.show : Styles.hide
          } ${Styles.trans}`}
        >
          <div style={{ background: darkMode ? "rgb(21 25 37)" : "white" }}>
            <div className="d-flex justify-content-center justify-content-md-between flex-wrap">
              <div className="d-flex justify-content-end mb-4 w-100">
                <Button
                  className={`w-auto px-3  m-2  ${
                    darkMode ? "btn-outline-secondary" : "btn-outline-secondary"
                  }`}
                  size="lg"
                  style={{ fontSize: "13px" }}
                  onClick={() => setchartModal(false)}
                >
                  <svg
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>close</title>
                    <desc>Created with sketchtool.</desc>
                    <g
                      id="web-app"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g id="close" fill="#000000">
                        <polygon
                          id="Shape"
                          points="10.6568542 12.0710678 5 6.41421356 6.41421356 5 12.0710678 10.6568542 17.7279221 5 19.1421356 6.41421356 13.4852814 12.0710678 19.1421356 17.7279221 17.7279221 19.1421356 12.0710678 13.4852814 6.41421356 19.1421356 5 17.7279221"
                        ></polygon>
                      </g>
                    </g>
                  </svg>
                </Button>
              </div>
            </div>

            <Chart
              className={"bg-transparent"}
              options={options}
              series={series}
              type="area"
              width="100%"
              height={"200"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChartCom;
