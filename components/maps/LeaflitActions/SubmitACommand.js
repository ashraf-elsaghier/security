import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "next-i18next";

// Bootstrap
import { Button, Col, Row, Form, Modal } from "react-bootstrap";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";

import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Formik } from "formik";
import Input from "components/formik/Input";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import { BsCheckLg } from "react-icons/bs";

export default function SubmitACommand({ show, setShow, selectedVehicles }) {
  const {
    auth: { user },
    config: { darkMode },
  } = useSelector((state) => state);
  const { t } = useTranslation("common");

  const [loading, setloading] = useState(false);

  const selectOptions = [
    // {
    //   value: "SetTimeInterval",
    //   label: t("set_time_interval_key"),
    // },
    // {
    //   value: "SetTimeIntervalWhenEngineOff",
    //   label: t("set_time_interval_when_engine_off_key"),
    // },
    // {
    //   value: "TakePicture",
    //   label: t("take_picture_key"),
    // },
    // {
    //   value: "SetDirectionChangeInterval",
    //   label: t("set_direction_change_interval_key"),
    // },
    // {
    //   value: "SetOverSpeed",
    //   label: t("set_over_speed_key"),
    // },
    // {
    //   value: "SetOverSpeedForDuration",
    //   label: t("set_over_speed_for_duration_key"),
    // },
    // {
    //   value: "SetParkingOverTime",
    //   label: t("set_parking_over_time_key"),
    // },
    // {
    //   value: "SetMileage",
    //   label: t("set_mileage_key"),
    // },
    // {
    //   value: "SetIdlingOverTime",
    //   label: t("set_idling_over_time_key"),
    // },
    // {
    //   value: "SetTrailingRadius",
    //   label: t("set_trailing_radius_key"),
    // },
    // {
    //   value: "SetFatigueDrivingParams",
    //   label: t("set_fatigue_driving_key"),
    // },
    // {
    //   value: "SetDistanceInterval",
    //   label: t("set_distance_interval_key"),
    // },
    // {
    //   value: "Locate",
    //   label: t("locate_key"),
    // },
    // {
    //   value: "CancelAlarms",
    //   label: t("cancel_alarms_key"),
    // },
    {
      value: "demobilize",
      label: t("demobilize_key"),
    },
    {
      value: "mobilize",
      label: t("mobilize_key"),
    },
    // {
    //   value: "CheckRFID",
    //   label: t("check_RFID_key"),
    // },
    {
      value: "opendoor",
      label: t("open_door_key"),
    },
    {
      value: "closedoor",
      label: t("close_door_key"),
    },
  ];

  const Dark = darkMode ? "bg-dark" : "";

  const handleClose = () => setShow(false);
  const onSubmit = (value) => {
    const popupVehId = document
      .getElementById("SubmitACommandBtn")
      .getAttribute("data-Id");
    const vehicle = selectedVehicles.filter(
      (veh) => +veh.VehicleID === +popupVehId
    )[0];
    const body = {
      serialnumber: vehicle.SerialNumber,
      command: value.command,
      devicetype: vehicle.DeviceTypeID,
    };
    axios
      .post(`/vehicles/setMileage`, {
        data: body,
      })
      .then(
        (res) => {
          toast.success(res.data.message);
          handleClose();
        },
        (err) => {
          if (value.command === "SetTimeInterval" || value.command == "") {
            toast.warning(t("select_a_command_key"));
          } else {
            toast.warning(err?.message);
          }
        }
      );
  };

  const initialValues = {
    command: "SetTimeInterval",
    // time: "",
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className={`${Dark}`}>
        <Modal.Title id="contained-modal-title-vcenter">
          {t("submit_a_command_key")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={`${Dark}`}>
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {(formik) => {
            return (
              <Form onSubmit={formik.handleSubmit}>
                <Row className="mx-3">
                  <Col className="mx-auto" md={12}>
                    <Row>
                      <ReactSelect
                        options={selectOptions}
                        placeholder={t("select_a_command_key")}
                        name="command"
                        className={"col-12 mb-3"}
                        isSearchable={true}
                        label={t("select_a_command_key")}
                      />
                      {/* <Input
                        placeholder={t("time_key")}
                        label={t("time_key")}
                        name="time"
                        type="text"
                        className={"col-12 mb-3"}
                      /> */}
                    </Row>
                  </Col>
                </Row>
                <Row className="mx-3">
                  <Col className="mx-auto" md={12}>
                    <div className="w-25 d-flex flex-wrap flex-md-nowrap">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="px-3 py-2 text-nowrap me-3 mb-2 mb-md-0"
                      >
                        {!loading ? (
                          <FontAwesomeIcon
                            className="mx-2"
                            icon={faCheck}
                            size="sm"
                          />
                        ) : (
                          <FontAwesomeIcon
                            className="mx-2 fa-spin"
                            icon={faSpinner}
                            size="sm"
                          />
                        )}
                        {t("assign_key")}
                      </Button>
                      <Button
                        className="px-3 py-2 text-nowrap me-3 ms-0"
                        onClick={() => {
                          handleClose();
                        }}
                      >
                        <FontAwesomeIcon
                          className="mx-2"
                          icon={faTimes}
                          size="sm"
                        />
                        {t("cancel_key")}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            );
          }}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}
