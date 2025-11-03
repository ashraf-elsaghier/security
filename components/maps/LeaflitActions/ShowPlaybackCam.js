import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

// Bootstrap
import { Modal } from "react-bootstrap";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { format, parse } from "date-fns";
import CameraPlaybackScreens from "components/VehiclesCamera/CameraPlaybackScreens";

export default function ShowCam({
  show,
  setShow,
  dateRange,
  deviceId,
  setDeviceId,
  vehicleId,
  setVehicleId,
  deviceTypeId,
}) {
  const [startingDate, endingDate] = dateRange;
  const [videoData, setVideoData] = useState([]);
  const [activeCameras, setActiveCameras] = useState([]);
  const {
    config: { darkMode },
  } = useSelector((state) => state);
  const { t } = useTranslation("common");
  const Dark = darkMode ? "bg-dark" : "";
  const [loading, setLoading] = useState(true);
  const [cameraLink, setCameraLink] = useState("");
  const [hasCamera, setHasCamera] = useState(false);
  const [jsession, setJsession] = useState("");

  async function getVehInfo(jsession, serial) {
    const url = `http://212.118.117.60/StandardApiAction_queryUserVehicle.action?jsession=${jsession}&language=en`;
    const response = await fetch(url);
    const json = await response.json();
    let devIdno = "";
    let maxChannels = 0;
    let cameras = [];

    if (json.result === 0) {
      json.vehicles.forEach((vehicle) => {
        vehicle.dl.forEach((dlEntry) => {
          if (dlEntry.id === serial) {
            devIdno = vehicle.nm;
            maxChannels = vehicle.chnCount;
            for (let i = 0; i < maxChannels; i++) {
              cameras.push({
                id: `${i + 1}`,
                name: `Camera ${i + 1}`,
                DevIDNO: devIdno,
                ch: i,
              });
            }
          }
        });
      });
    }

    return { devIdno, maxChannels, cameras };
  }
  const formatDateParams = (dateString) => {
    try {
      console.log(dateString);

      const parsedDate = parse(dateString, "yyyyMMddHHmmss", new Date());

      if (isNaN(parsedDate)) {
        throw new Error("Invalid date format");
      }

      return {
        YEAR: format(parsedDate, "yyyy"),
        MON: format(parsedDate, "MM"),
        DAY: format(parsedDate, "dd"),
      };
    } catch (error) {
      console.error("Error in formatDateParams:", error.message);
      return null; // Handle the error gracefully
    }
  };
  const onSearch = async (startDate, endDate, ch) => {
    const { YEAR, MON, DAY } = formatDateParams(startDate);
    const { YEAR: YEARE, MON: MONE, DAY: DAYE } = formatDateParams(endDate);
    try {
      const res = await axios.get(
        `http://212.118.117.60:16603/3/5?DownType=8&DevIDNO=${deviceTypeId}&LOC=2&CHN=${ch}&YEAR=${YEAR}&MON=${MON}&DAY=${DAY}&RECTYPE=-1&FILEATTR=2&BEG=0&END=86399&ARM1=0&ARM2=0&RES=0&STREAM=-1&STORE=0&host=212.118.117.60&jsession=${jsession}&YEARE=${YEARE}&MONE=${MONE}&DAYE=${DAYE}`
      );
      const data = res.data.files.map((f) => ({
        PlaybackUrl: f.PlaybackUrl.replace(
          "https://212.118.117.60",
          "http://212.118.117.60"
        ),
        DownUrl: f.DownUrl.replace(
          "https://212.118.117.60",
          "http://212.118.117.60"
        ),
        Date: `${f.year}-${f.mon.toString().padStart(2, "0")}-${f.day
          .toString()
          .padStart(2, "0")}`,
      }));
      setVideoData((prevData) => [...prevData, ...data]);
      setHasCamera(true);
    } catch (error) {
      toast.dismiss();
      toast.error("no data available");
      console.log(error);
    }
  };
  async function login() {
    try {
      const res = await fetch(
        `http://212.118.117.60/StandardApiAction_login.action?account=admin&password=Saferoad@2025`,
        {
          method: "POST",
        }
      );
      if (!res.ok) {
        throw new Error("Error occurred during login");
      }
      const data = await res.json();
      if (data.result === 1) {
        throw new Error("Invalid credentials");
      } else {
        setJsession(data.jsession);
        const { cameras } = await getVehInfo(data.jsession, deviceId);
        if (cameras.length === 0) {
          toast.error("No History found for the selected device");
          throw new Error("No cameras found for the selected device");
        }
        setActiveCameras(cameras);
        cameras.forEach((camera) => {
          onSearch(startingDate, endingDate, camera.ch);
        });
      }
    } catch (error) {
      console.error("Error during login or fetching camera data:", error);
      toast.error(error.message || "An unexpected error occurred");
      setShow(false);
    } finally {
      setLoading(false);
    }
  }

  const handleClose = () => {
    setShow(false);
    setDeviceId("");
    setVehicleId("");
  };
  useEffect(() => {
    if (deviceTypeId === 22) {
      login();
    } else {
      const handleShowCam = async () => {
        try {
          setLoading(true);
          const resDeviceStatus = await axios.post(`cameraHistory`, {
            deviceId,
            startDate: startingDate,
            endDate: endingDate,
            vehicleId,
          });

          if (resDeviceStatus?.data?.data) {
            setCameraLink(resDeviceStatus?.data?.data);
            setLoading(false);
            setHasCamera(true);
          } else {
            setLoading(false);
            setHasCamera(false);
            toast.warning("This Device Doesn't have Camera Installed");
          }
        } catch (error) {
          setLoading(false);
          toast.error("Error For Show Camera");
        }
      };
      show && handleShowCam();
    }
  }, [show]);

  return (
    hasCamera && (
      <Modal
        show={show}
        onHide={handleClose}
        size={hasCamera ? "xl" : "md"}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton className={`${Dark}`}>
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
            {!loading ? (
              hasCamera ? (
                deviceTypeId === 22 ? (
                  <CameraPlaybackScreens urls={videoData} />
                ) : (
                  <iframe
                    src={cameraLink}
                    id="CamIframe"
                    style={{
                      border: "0px #ffffff none",
                      height: "800px",
                      width: "100%",
                    }}
                    name="myiFrame"
                    scrolling="no"
                    frameborder="1"
                    marginheight="0px"
                    marginwidth="0px"
                    allowfullscreen=""
                  />
                )
              ) : (
                <p className="lead">
                  {t("this_device_have_not_any_cameras_key")}
                </p>
              )
            ) : (
              <FontAwesomeIcon className="fa-spin" icon={faSpinner} size="sm" />
            )}
          </div>
        </Modal.Body>
      </Modal>
    )
  );
}
