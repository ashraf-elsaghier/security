import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "next-i18next";
import { Button, Col, Row, Form, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Formik, Field } from "formik";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";

export default function SubmitACommand({ show, setShow, selectedVehicles }) {
  const {
    config: { darkMode },
  } = useSelector((state) => state);
  const { t } = useTranslation("common");
  const [loading, setloading] = useState(false);

  const Dark = darkMode ? "bg-dark" : "";

  const handleClose = () => setShow(false);

  const onSubmit = (value) => {
    const body = {
      serialnumber: selectedVehicles.SerialNumber,
      command: value.command,
      devicetype: selectedVehicles.DeviceTypeID,
      username: value.username,
      password: value.password,
    };

    setloading(true);

    axios
      .post(`support/representative/cmd`, { data: body })
      .then(
        (res) => {
          toast.success(res.data.message);
          handleClose();
        },
        (err) => {
          if (value.command === "SetTimeInterval" || value.command === "") {
            toast.warning(t("select_a_command_key"));
          } else {
            toast.warning(err?.message);
          }
        }
      )
      .finally(() => {
        setloading(false);
      });
  };

  const initialValues = {
    command: "SetTimeInterval",
    username: "",
    password: "",
  };

  const selectOptions = [
    { value: "demobilize", label: t("demobilize_key") },
    { value: "mobilize", label: t("mobilize_key") },
    { value: "opendoor", label: t("open_door_key") },
    { value: "closedoor", label: t("close_door_key") },
  ];

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
          {(formik) => (
            <Form onSubmit={formik.handleSubmit}>
              <Row>
                {/* Command Selection */}
                <Col md={12} className="mb-3">
                  <ReactSelect
                    options={selectOptions}
                    placeholder={t("select_a_command_key")}
                    name="command"
                    className="col-12 fs-5 py-2"
                    isSearchable={true}
                    label={t("select_a_command_key")}
                  />
                </Col>

                {/* Username Field */}
                <Col md={12} className="mb-3">
                  <Form.Group>
                    <Form.Label className="fs-5">
                      {t("username_key")}
                    </Form.Label>
                    <Field
                      name="username"
                      type="text"
                      autoComplete="off"
                      className="form-control fs-5 py-2"
                      placeholder={t("enter_username_key")}
                    />
                  </Form.Group>
                </Col>

                {/* Password Field */}
                <Col md={12} className="mb-3">
                  <Form.Group>
                    <Form.Label className="fs-5">
                      {t("password_key")}
                    </Form.Label>
                    <Field
                      name="password"
                      type="password"
                      autoComplete="off"
                      className="form-control fs-5 py-2"
                      placeholder={t("enter_password_key")}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                {/* Submit Button */}
                <Col sm="6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary rounded fs-5 py-2 w-100"
                  >
                    {!loading ? (
                      t("assign_key")
                    ) : (
                      <FontAwesomeIcon
                        className="mx-2 fa-spin"
                        icon={faSpinner}
                        size="sm"
                      />
                    )}
                  </button>
                </Col>
                {/* Cancel Button */}
                <Col>
                  <button
                    className="btn btn-outline-primary rounded fs-5 py-2 w-100"
                    onClick={handleClose}
                  >
                    {t("cancel_key")}
                  </button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}
