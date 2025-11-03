import axios from "axios";
import React, { useState } from "react";
import { Col, Form, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";

export default function CalibrateMileage({ show, setShow, selectedVehicles }) {
  const {
    config: { darkMode },
  } = useSelector((state) => state);

  const [loading, setloading] = useState(false);
  const [Mileage, setMileage] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const { t } = useTranslation("common");
  const Dark = darkMode ? "bg-dark" : "";
  const handleClose = () => setShow(false);

  const handleRq = (e) => {
    e.preventDefault();
    setloading(true);
    const updated_data = {
      serialnumber: selectedVehicles.SerialNumber,
      status: "stop",
      devicetype: selectedVehicles?.DeviceTypeID,
      command: "setmileage",
      params: {
        value: Number(Mileage),
      },
      username: userName,
      password,
    };

    axios
      .post(`vehicles/setMileage`, {
        data: updated_data,
      })
      .then(() => {
        toast.success("Mileage updated Successfully.");
      })
      .catch((er) => {
        toast.error(er.message);
      })
      .finally(() => {
        setloading(false);
        handleClose();
      });
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
          <h3>{t("calibrate_mileage_key")}</h3>
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleRq}>
        <Modal.Body className={`p-3 mb-3 ${Dark}`}>
          <Form.Group className="form-group">
            <Form.Label htmlFor="Mileage">{t("mileage_key")}</Form.Label>
            <Form.Control
              name="Mileage"
              type="text"
              id="Mileage"
              placeholder={t("Set Mileage in KM")}
              value={Mileage}
              onChange={(e) => setMileage(e.target.value)}
              required
            />
          </Form.Group>
          <Col md={12} className="mb-3">
            <Form.Group>
              <Form.Label className="fs-5">{t("username_key")}</Form.Label>
              <Form.Control
                name="username"
                type="text"
                autoComplete="off"
                className="form-control fs-5 py-2"
                placeholder={t("enter_username_key")}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </Form.Group>
          </Col>

          {/* Password Field */}
          <Col md={12} className="mb-3">
            <Form.Group>
              <Form.Label className="fs-5">{t("password_key")}</Form.Label>
              <Form.Control
                name="password"
                type="password"
                autoComplete="off"
                className="form-control fs-5 py-2"
                placeholder={t("enter_password_key")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Modal.Body>
        <Modal.Footer className={`${Dark}`}>
          <div className="d-flex justify-content-around">
            <button
              disabled={loading}
              className="btn btn-primary px-3 py-2 ms-3"
              type="submit"
            >
              {!loading ? (
                <FontAwesomeIcon className="mx-2" icon={faCheck} size="sm" />
              ) : (
                <FontAwesomeIcon
                  className="mx-2 fa-spin"
                  icon={faSpinner}
                  size="sm"
                />
              )}
              {t("calibrate_key")}
            </button>
            <button
              className="btn btn-primary px-3 py-2 ms-3"
              onClick={(e) => {
                e.preventDefault();
                handleClose();
              }}
            >
              <FontAwesomeIcon className="mx-2" icon={faTimes} size="sm" />
              {t("cancel_key")}
            </button>
          </div>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
