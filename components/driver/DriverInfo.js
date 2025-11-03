import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import EmptyMess from "components/UI/ChartErrorMsg";
import Spinner from "components/UI/Spinner";
import { useTranslation } from "next-i18next";

const DriverInfo = ({ data, loading, behavior }) => {
  const { t } = useTranslation(["driver"]);
  const countRate = (cnt) =>
    cnt > 8 ? 0 : cnt > 6 ? 1 : cnt > 4 ? 2 : cnt > 2 ? 3 : cnt > 0 ? 4 : 5;

  const driverInfo = [
    {
      title: t("license_number_key"),
      value: data.DLNumber,
    },
    {
      title: t("department_key"),
      value: data.Department,
    },
    {
      title: t("email_key"),
      value: data.Email,
    },
    {
      title: t("phone_number_key"),
      value: data.PhoneNumber,
    },
    {
      title: t("vehicle_name_key"),
      value: data.DisplayName,
    },
    {
      title: t("plate_number_key"),
      value: data.PlateNumber,
    },
    {
      title: t("RFID_key"),
      value: data.RFID,
    },
    {
      title: t("rating_key"),
      value: Math.floor(
        (countRate(behavior?.harshBrakes) +
          countRate(behavior?.rapidAccelerations) +
          countRate(behavior?.overSpeed)) /
        3
      ),
      rate: faStar,
    },
  ];

  return (
    <Card className="shadow-sm border border-light">
      <Card.Body>
        {loading ? (
          <Spinner />
        ) : data && Object.keys(data)?.length > 0 ? (
          <Row>
            <Col md="6">
              <div className="h-100 d-flex flex-column align-items-center justify-content-center">
                <img
                  className="img-fluid rounded-circle card-img "
                  src={data?.Image}
                  alt="avatar"
                  layout="fixed"
                  style={{ width: "240px", height: "240px" }}
                />
                <h4 className="text-secondary text-center mt-3">
                  {`${data.FirstName} ${data.LastName}`}
                </h4>
              </div>
            </Col>
            {/* <Col md='2'></Col> */}
            <Col md="6">
              <div className="mt-4 ms-5">
                {driverInfo?.map(({ title, value, rate }, idx) => {
                  return (
                    <p key={idx}>
                      <span className="fw-bold">{title}: </span>
                      <span className="mx-1">{value}</span>
                      {rate ? (
                        <>
                          <FontAwesomeIcon
                            style={{
                              color: value < 1 ? "#c8c8c8" : "orange",
                            }}
                            icon={faStar}
                            size="sm"
                          />
                          <FontAwesomeIcon
                            style={{
                              color: value < 2 ? "#c8c8c8" : "orange",
                            }}
                            icon={faStar}
                            size="sm"
                          />
                          <FontAwesomeIcon
                            style={{
                              color: value < 3 ? "#c8c8c8" : "orange",
                            }}
                            icon={faStar}
                            size="sm"
                          />
                          <FontAwesomeIcon
                            style={{
                              color: value < 4 ? "#c8c8c8" : "orange",
                            }}
                            icon={faStar}
                            size="sm"
                          />
                          <FontAwesomeIcon
                            style={{
                              color: value < 5 ? "#c8c8c8" : "orange",
                            }}
                            icon={faStar}
                            size="sm"
                          />
                        </>
                      ) : null}
                    </p>
                  );
                })}
              </div>
            </Col>
          </Row>
        ) : (
          <EmptyMess msg={`${t("oops!_no_data_found_key")}.`} />
        )}
      </Card.Body>
    </Card>
  );
};

export default DriverInfo;
