import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import CameraScreens from "components/VehiclesCamera/CameraScreens";

export default function ShowCam({
  show,
  setShow,
  deviceId,
  setDeviceId,
  vehicleId,
  setVehicleId,
  deviceTypeId,
}) {
  const {
    config: { darkMode },
  } = useSelector((state) => state);
  const { t } = useTranslation("common");

  const Dark = darkMode ? "bg-dark" : "";
  const [loading, setLoading] = useState(false);
  const [cameraLink, setCameraLink] = useState("");
  const [hasCamera, setHasCamera] = useState(false);

  const handleClose = () => {
    setShow(false);
    setDeviceId("");
    setVehicleId("");
  };

  useEffect(() => {
    if (!show || deviceTypeId === 22) return;

    let isMounted = true;

    const handleShowCam = async () => {
      try {
        setLoading(true);
        const resDeviceStatus = await axios.post(`cameraLive`, {
          deviceId,
          vehicleId,
        });

        if (isMounted && resDeviceStatus?.data?.data) {
          setCameraLink(resDeviceStatus.data.data);
          setHasCamera(true);
        } else if (isMounted) {
          setHasCamera(false);
          toast.warning(t("device_no_camera_key"));
        }
      } catch (error) {
        if (isMounted) toast.error(t("error_show_camera_key"));
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    handleShowCam();
    return () => {
      isMounted = false;
    };
  }, [show, deviceId, vehicleId, deviceTypeId, t]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size={hasCamera ? "xl" : "lg"}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className={Dark}>
        <Modal.Title id="contained-modal-title-vcenter">
          <p className="lead">{t("show_cameras_key")}</p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          height: hasCamera ? "80vh" : "auto",
          overflow: hasCamera ? "hidden scroll" : "auto",
        }}
      >
        <div className="d-flex justify-content-center">
          {deviceTypeId === 22 ? (
            <CameraScreens serial={deviceId} setShow={setShow} />
          ) : loading ? (
            <FontAwesomeIcon className="fa-spin" icon={faSpinner} size="sm" />
          ) : hasCamera ? (
            <iframe
              src={cameraLink}
              id="CamIframe"
              style={{
                border: "none",
                height: "800px",
                width: "100%",
              }}
              scrolling="no"
              allowFullScreen
            />
          ) : (
            <p>{t("no_camera_available_key")}</p>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
