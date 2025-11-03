import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import EmptyMess from "components/UI/ChartErrorMsg";
import Spinner from "components/UI/Spinner";
import { useTranslation } from "next-i18next";

const VehicleInfo = ({ data, loading }) => {
  const { t } = useTranslation(["vehicle"]);

  const vehicleInfoData = [
    {
      head: t("plate_number_key"),
      content: data.PlateNumber,
    },
    {
      head: t("display_name_key"),
      content: data.DisplayName,
    },
    {
      head: t("vehicle_type_key"),
      content: data.TypeName,
    },
    {
      head: t("device_serial_number_key"),
      content: data.ImeiNumber,
    },
  ];

  return (
    <>
      <Row className="pt-4">
        {vehicleInfoData.map((item) => (
          <Col md={6} lg={3} key={item.head}>
            <Card style={{ height: "calc(100% - 2rem)" }}>
              {loading ? (
                <Spinner />
              ) : data && Object.keys(data)?.length ? (
                <Card.Body>
                  <h4 className="text-center">{item.head}</h4>
                  <p className="mt-4 text-center">{item.content}</p>
                </Card.Body>
              ) : (
                <EmptyMess msg={`${t("oops!_no_data_found_key")}.`} />
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default VehicleInfo;
