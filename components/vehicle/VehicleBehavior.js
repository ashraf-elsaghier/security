import React from "react";
import { Card, Col, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EmptyMess from "components/UI/ChartErrorMsg";
import Spinner from "components/UI/Spinner";
import { useTranslation } from "next-i18next";
import { faStar, faCar } from "@fortawesome/free-solid-svg-icons";

const VehicleBehavior = ({ data, loading }) => {
  const { t } = useTranslation(["vehicle"]);

  const countRate = (cnt) =>
    cnt > 8 ? 0 : cnt > 6 ? 1 : cnt > 4 ? 2 : cnt > 2 ? 3 : cnt > 0 ? 4 : 5;

  const rating = Math.floor(
    (countRate(data?.harshBrakes) +
      countRate(data?.rapidAccelerations) +
      countRate(data?.overSpeed)) /
      3
  );

  return (
    <Col md="6" lg="3">
      <Card
        style={{
          paddingLeft: "20px",
          paddingRight: "20px",
          height: "calc(100% - 2rem)",
        }}
      >
        {loading ? (
          <Spinner />
        ) : data && Object.keys(data)?.length ? (
          <Card.Body className="ps-0">
            <h4 className="mb-4">{t("vehicle_behavior_key")}</h4>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                lineHeight: "40px",
                marginBottom: "0.5rem",
              }}
            >
              <FontAwesomeIcon
                icon={faCar}
                size="lg"
                style={{ marginRight: "10px", marginLeft: "10px" }}
              />
              <h5 className="ml-2">
                {t("harsh_brakes_key")}= {data?.harshBrakes}
              </h5>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                lineHeight: "40px",
                marginBottom: "0.5rem",
              }}
            >
              <FontAwesomeIcon
                icon={faCar}
                size="lg"
                style={{ marginRight: "10px", marginLeft: "10px" }}
              />
              <h5 className="ml-2">
                {t("rapid_accelerations_key")}= {data?.rapidAccelerations}
              </h5>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                lineHeight: "40px",
                marginBottom: "0.5rem",
              }}
            >
              <FontAwesomeIcon
                icon={faCar}
                size="lg"
                style={{ marginRight: "10px", marginLeft: "10px" }}
              />
              <h5 className="ml-2">
                {t("idle_time_key")}= {data?.idleTime}
              </h5>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                lineHeight: "40px",
                marginBottom: "0.5rem",
              }}
            >
              <FontAwesomeIcon
                icon={faCar}
                size="lg"
                style={{ marginRight: "10px", marginLeft: "10px" }}
              />
              <h5 className="ml-2">
                {t("over_speed_key")}= {data?.overSpeed}
              </h5>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                lineHeight: "40px",
              }}
            >
              <FontAwesomeIcon
                icon={faStar}
                size="lg"
                style={{
                  marginRight: "10px",
                  marginLeft: "10px",
                  color: "orange",
                }}
              />
              <h5 className="ml-2">
                {t("rating_key")}={(rating / 5) * 100} %
                {
                  <>
                    <FontAwesomeIcon
                      style={{
                        color: rating < 1 ? "#c8c8c8" : "orange",
                      }}
                      icon={faStar}
                      size="sm"
                    />
                    <FontAwesomeIcon
                      style={{
                        color: rating < 2 ? "#c8c8c8" : "orange",
                      }}
                      icon={faStar}
                      size="sm"
                    />
                    <FontAwesomeIcon
                      style={{
                        color: rating < 3 ? "#c8c8c8" : "orange",
                      }}
                      icon={faStar}
                      size="sm"
                    />
                    <FontAwesomeIcon
                      style={{
                        color: rating < 4 ? "#c8c8c8" : "orange",
                      }}
                      icon={faStar}
                      size="sm"
                    />
                    <FontAwesomeIcon
                      style={{
                        color: rating < 5 ? "#c8c8c8" : "orange",
                      }}
                      icon={faStar}
                      size="sm"
                    />
                  </>
                }
              </h5>
            </div>
          </Card.Body>
        ) : (
          <EmptyMess msg={`${t("oops!_no_data_found_key")}.`} />
        )}
      </Card>
    </Col>
  );
};

export default VehicleBehavior;
