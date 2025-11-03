import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { useSession } from "next-auth/client";

export default function NotifyModal({
  show,
  vehicleName,
  vehicleId,
  onCancel,
}) {
  const {
    config: { darkMode },
  } = useSelector((state) => state);
  const Dark = darkMode ? "bg-dark" : "";
  const { t } = useTranslation("common");
  const externalLink = `/history?VehID=${vehicleId}`;
  const editLink = `/management/VehicleManagment/edit/${vehicleId}`;
  const session = useSession();
  const userRole = session[0]?.user?.user?.role?.toLowerCase();

  return (
    <Modal
      show={show}
      size="md"
      onHide={onCancel}
      className="border-0"
      centered>
      <Modal.Body
        className={`${Dark} border-0 d-flex justify-content-center
        align-items-center flex-column gap-3 `}
        style={{ minHeight: "150px" }}>
        <p className="lead text-secondary">
          {vehicleName} , {t("vehicle_not_assigned")}
        </p>
      </Modal.Body>
      <Modal.Footer className={`d-flex justify-content-center ${Dark}`}>
        <a href={externalLink} passHref target="_blank">
          <Button
            variant="primary"
            className={`px-4 py-2 ${darkMode ? "text-white" : ""}`}>
            {t("show_history")}
          </Button>
        </a>
        {userRole !== "user" && (
          <a href={editLink} passHref target="_blank">
            <Button
              variant="primary"
              className={`px-4 py-2 ${darkMode ? "text-white" : ""}`}>
              {t("edit_vehicle")}
            </Button>
          </a>
        )}
        <Button
          variant="secondary"
          className={`px-4 py-2 ms-3 ${darkMode ? "text-white" : ""}`}
          onClick={onCancel}>
          {t("close")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
