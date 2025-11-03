import React, { useState } from "react";
import { useTranslation } from "next-i18next";

// Bootstrap
import { Form, Modal } from "react-bootstrap";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";

import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

export default function DisableVehicle({ show, setShow, selectedVehicles }) {
  const {
    auth: { user },
    config: { darkMode },
  } = useSelector((state) => state);
  const { t } = useTranslation("common");

  const Dark = darkMode ? "bg-dark" : "";
  const [loading, setloading] = useState(false);

  const handleClose = () => setShow(false);

  const handleRq = async (e) => {
    e.preventDefault();
    setloading(true);
    const SerialNumber = document
      .getElementById("DisableVehicleBtn")
      .getAttribute("data-id");
    const vehicle = selectedVehicles.filter(
      (veh) => +veh.SerialNumber === +SerialNumber
    )[0];

    await axios
      .post("/vehicles/setMileage", {
        data: {
          serialnumber: SerialNumber,
          command: "demobilize",
          devicetype: vehicle?.DeviceTypeID,
        },
      })
      .then(({ data }) => {
        toast.success("Vehicle Disabled Successfully.");
      })
      .catch((er) => {
        toast.error("Error in Vehicle Enabled.");
        // toast.error(er.message);
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
          <p className="lead">
            {t("are_you_sure_you_want_to_disable_this_vehicle?_key")}
          </p>
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleRq}>
        <Modal.Footer className={`d-flex justify-content-center ${Dark}`}>
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
            {t("yes_key")}
          </button>
          <button
            className="btn btn-primary px-3 py-2 ms-3"
            onClick={(e) => {
              e.preventDefault();
              handleClose();
            }}
          >
            <FontAwesomeIcon className="mx-2" icon={faTimes} size="sm" />
            {t("no_key")}
          </button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
