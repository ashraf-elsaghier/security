import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "next-i18next";

// Bootstrap
import { Col, Form, Modal, Row } from "react-bootstrap";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";

import { useDispatch, useSelector } from "react-redux";
import { UpdateVehicle } from "../../../lib/slices/vehicleProcessStatus";
import { toast } from "react-toastify";

export default function EditInfo({ show, setShow }) {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const {
    auth: { user },
    config: { darkMode },
    firebase: { Vehicles },
  } = useSelector((state) => state);

  const [loading, setloading] = useState(false);
  const [Data, setData] = useState({
    HeadWeight: "",
    TailWeight: "",
    MinimumVoltage: "",
    MaximumVoltage: "",
    CargoWeight: "",
  });

  const Dark = darkMode ? "bg-dark" : "";

  const handleClose = () => setShow(false);

  const handleRq = (e) => {
    e.preventDefault();
    setloading(true);
    const id = document
      .getElementById("CalibrateWeightSettingBtn")
      .getAttribute("data-id");

    const Index = Vehicles.findIndex((x) => x.VehicleID == id);
    const the_vehicle = Vehicles.find((ele) => ele.VehicleID == id);

    const updated_data = { ...the_vehicle, ...Data };

    axios
      .post(`dashboard/vehicles/actions/weightSet/${id}`, updated_data)
      .then((res) => {
        dispatch(
          UpdateVehicle([
            ...Vehicles.slice(0, Index),
            { ...updated_data },
            ...Vehicles.slice(Index + 1),
          ])
        );
        toast.success(res?.data?.message);
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
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className={`${Dark}`}>
        <Modal.Title id="contained-modal-title-vcenter">
          {t("calibrate_weight_setting_key")}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleRq}>
        <Modal.Body className={`${Dark}`}>
          <Row className="p-3 mb-3">
            <Col lg="6">
              <Form.Group className="form-group">
                <Form.Label htmlFor="HeadWeight">
                  {t("head_weight_key")}
                </Form.Label>
                <Form.Control
                  name="HeadWeight"
                  type="number"
                  id="HeadWeight"
                  placeholder={t("head_weight_key")}
                  value={Data.HeadWeight}
                  onChange={(e) =>
                    setData({
                      ...Data,
                      HeadWeight: +e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col lg="6">
              <Form.Group className="form-group">
                <Form.Label htmlFor="TailWeight">
                  {t("tail_weight_key")}
                </Form.Label>
                <Form.Control
                  name="TailWeight"
                  type="number"
                  id="TailWeight"
                  placeholder={t("tail_weight_key")}
                  value={Data.TailWeight}
                  onChange={(e) =>
                    setData({
                      ...Data,
                      TailWeight: +e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col lg="6">
              <Form.Group className="form-group">
                <Form.Label htmlFor="MinimumVoltage">
                  {t("minimum_voltage_key")}
                </Form.Label>
                <Form.Control
                  name="MinimumVoltage"
                  type="number"
                  id="MinimumVoltage"
                  placeholder={t("minimum_voltage_key")}
                  value={Data.MinimumVoltage}
                  onChange={(e) =>
                    setData({
                      ...Data,
                      MinimumVoltage: +e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col lg="6">
              <Form.Group className="form-group">
                <Form.Label htmlFor="MaximumVoltage">
                  {t("maximum_voltage_key")}
                </Form.Label>
                <Form.Control
                  name="MaximumVoltage"
                  type="number"
                  id="MaximumVoltage"
                  placeholder={t("maximum_voltage_key")}
                  value={Data.MaximumVoltage}
                  onChange={(e) =>
                    setData({
                      ...Data,
                      MaximumVoltage: +e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col lg="12">
              <Form.Group className="form-group">
                <Form.Label htmlFor="CargoWeight">
                  {t("cargo_weight_key")}
                </Form.Label>
                <Form.Control
                  name="CargoWeight"
                  type="number"
                  id="CargoWeight"
                  placeholder={t("cargo_weight_key")}
                  value={Data.CargoWeight}
                  onChange={(e) =>
                    setData({
                      ...Data,
                      CargoWeight: +e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
            </Col>
          </Row>
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
              {t("save_changes_key")}
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
