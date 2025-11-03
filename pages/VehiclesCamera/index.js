import React, { useState, useMemo, useCallback, useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Row, Col, Card, Button, Modal } from "react-bootstrap";
import { useTranslation } from "next-i18next";
import AgGridDT from "components/AgGridDT";
import CameraButton from "../../components/VehiclesCamera/Button";
import style from "styles/ReportsOptions.module.scss";
import UseDarkmode from "hooks/UseDarkmode";
import { DateRangePicker } from "rsuite";
import dynamic from "next/dynamic";
import moment from "moment";
import UseStreamHelper from "/helpers/streamHelper";
import { toggle as tourToggle, disableTour } from "lib/slices/tour";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import stepStyle from "styles/scss/custom/components/tour-step/tourStep.module.scss";
import useStepDashboard from "hooks/useStepDashboard";
import { useDispatch, useSelector } from "react-redux";
import { getSession } from "next-auth/client";
import axios from "axios";

const ShowCam = dynamic(
  () => import("components/maps/LeaflitActions/ShowCam"),
  {
    loading: () => <header />,
  }
);

const ShowPlaybackCam = dynamic(
  () => import("components/maps/LeaflitActions/ShowPlaybackCam"),
  {
    loading: () => <header />,
  }
);

const VehiclesCamera = ({ cameraData }) => {
  const { t } = useTranslation(["vehiclesCamera", "common"]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [showCam, setShowCam] = useState(false);
  const [showPlayBackCam, setShowPlayBackCam] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [playBackSerialNumber, setPlayBackSerialNumber] = useState("");
  const [playbackDate, SetPlaybackDate] = useState([]);
  const [deviceId, setDeviceId] = useState("");
  const [deviceTypeId, setDeviceTypeId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [Dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [cameraDataState, setCameraDataState] = useState(cameraData || []);
  const dispatch = useDispatch();
  const allSteps = useStepDashboard();
  const tourState = useSelector((state) => state.tour.run);
  const [{ stepIndex, steps }, setState] = useState({
    stepIndex: 0,
    steps: allSteps["vehiclesCamera"],
  });
  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setState({ stepIndex: 0, steps: steps });
      dispatch(tourToggle());
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

      if (index === 11 && action === ACTIONS.PREV) {
        setToggleMinuTrack((prev) => !prev);
        setState({
          stepIndex: nextStepIndex,
          steps: steps,
        });
      } else if (data.action === "close" || data.action === "reset") {
        dispatch(disableTour());
      } else {
        setState({
          stepIndex: nextStepIndex,
          steps: steps,
        });
      }
    }
  };
  //Date Configuration for the DateRangePicker
  const formatDate = (date) => {
    const format = "YYYYMMDDHHmmss";
    const formatedDate = moment(date).format(format);
    return formatedDate;
  };

  const { afterToday } = DateRangePicker;
  const dateNow = new Date();
  const year = dateNow.getFullYear();
  const getMonth = dateNow.getMonth() + 1;
  const month = getMonth < 10 ? `0${getMonth}` : getMonth;
  const day =
    dateNow.getDate() < 10 ? `0${dateNow.getDate()}` : dateNow.getDate();

  const handleShowPlayback = () => {
    const dateRanges = {
      start: Dates[0].startDate,
      end: Dates[0].endDate,
    };
    const startDate = formatDate(dateRanges.start);
    const endDate = formatDate(dateRanges.end);
    SetPlaybackDate([startDate, endDate]);
    setIsModelOpen(false);
    setShowPlayBackCam((prev) => !prev);
  };

  const handleFullName = (params) => {
    return params.data.FirstName === undefined
      ? "Not Available"
      : `${params.data.FirstName} ${params.data.LastName}`;
  };

  //the setting of the AG grid table .. sort , filter , etc...
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      flex: 1,
      resizable: true,
      filter: true,
    };
  }, []);

  const handleShowCamera = (params) => {
    const { VehicleID, SerialNumber, DeviceTypeID } = params;
    setDeviceId(SerialNumber);
    setDeviceTypeId(DeviceTypeID);
    setVehicleId(VehicleID);
    setShowCam((prev) => !prev);
  };

  const handlePlayback = (params) => {
    const { VehicleID, SerialNumber, DeviceTypeID } = params;
    setDeviceId(SerialNumber);
    setDeviceTypeId(DeviceTypeID);
    setVehicleId(VehicleID);
    setIsModelOpen(true);
  };

  const handleDate = (e) => {
    setDates([
      {
        startDate: e[0],
        endDate: e[1],
        key: "selection",
      },
    ]);
  };
  const onGridReady = async (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };
  const getCameraData = useCallback(async () => {
    try {
      const response = await axios.get(`/vehicles/settings?devType=cam&withloc=1`);
      if (response?.data) {
        setCameraDataState(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    if (!cameraData || cameraData.length === 0) {
      getCameraData();
    } else {
      setCameraDataState(cameraData);
    }
  }, [cameraData, getCameraData]);
  const columns = useMemo(
    () => [
      {
        headerName: `${t("drivers_name")}`,
        field: "DriverName",
        valueGetter: handleFullName,
        minWidth: 190,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("plate_number")}`,
        field: "PlateNumber",
        minWidth: 190,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("VehicleStatus")}`,
        field: "VehicleStatus",
        minWidth: 120,
        sortable: true,
        cellRenderer: (params) => {
          const { CalcVstatus } = UseStreamHelper();
          let status = CalcVstatus(params.data);
          let text = () => {
            switch (status) {
              case 600:
              case 5:
                return t("Offline");
              case 204:
                return t("Sleeping");
              case 101:
                return t("OverSpeed");
              case 100:
                return t("OverStreetSpeed");
              case 0:
                return t("Stopped");
              case 1:
                return t("Running");
              case 2:
                return t("Idle");
              default:
                return t("Invalid");
            }
          };
          return <span>{text()} </span>;
        },
        unSortIcon: true,
      },
      {
        headerName: `${t("serial_number")}`,
        field: "SerialNumber",
        minWidth: 190,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("camera")}`,
        cellRenderer: (params) => (
          <>
            <div className="d-flex justify-content-start align-items-center">
              <div className="vehiclesCamera-history">
                <CameraButton
                  title={t("history_playback")}
                  isPlayback={true}
                  params={params.data}
                  handleShowCamera={handlePlayback}
                  // setPlayBackSerialNumber={setPlayBackSerialNumber}
                />
              </div>
              <div className="vehiclesCamera-show">
                <CameraButton
                  title={t("show_camera")}
                  params={params.data}
                  handleShowCamera={handleShowCamera}
                />
              </div>
            </div>
          </>
        ),
        minWidth: 350,

        sortable: true,
        unSortIcon: true,
      },
    ],
    [t]
  );
  return (
    <Row className="mx-1 vehiclesCamera">
      <Joyride
        steps={steps}
        continuous
        callback={handleJoyrideCallback}
        run={tourState}
        stepIndex={stepIndex}
        showSkipButton
        locale={{
          skip: (
            <span className={stepStyle["skip-tour"]}>{t("skip_tour")}</span>
          ),
          back: <span className={stepStyle["skip-tour"]}>{t("back")}</span>,
          next: <span>{t("next")}</span>,
          last: <span>{t("last")}</span>,
        }}
        styles={{
          options: {
            primaryColor: "#2C7BC6",
            overlayColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 50000,
            width: "379px",
            // padding: "16px",
            backgroundColor: "#E0EAE9",
          },
        }}
      />
      <Col sm="12">
        <Card>
          <Card.Body>
            {showCam ? (
              <ShowCam
                show={showCam}
                setShow={setShowCam}
                deviceId={deviceId}
                setDeviceId={setDeviceId}
                deviceTypeId={deviceTypeId}
                vehicleId={vehicleId}
                setVehicleId={setVehicleId}
              />
            ) : null}
            {showPlayBackCam ? (
              <ShowPlaybackCam
                show={showPlayBackCam}
                setShow={setShowPlayBackCam}
                dateRange={playbackDate}
                deviceId={deviceId}
                setDeviceId={setDeviceId}
                vehicleId={vehicleId}
                setVehicleId={setVehicleId}
                deviceTypeId={deviceTypeId}
              />
            ) : null}
            <div className="vehiclesCamera-table">
              <AgGridDT
                enableRtl={localStorage?.language === "ar"}
                rowHeight={65}
                columnDefs={columns}
                rowData={cameraDataState}
                defaultColDef={defaultColDef}
                onGridReady={onGridReady}
                gridApi={gridApi}
                gridColumnApi={gridColumnApi}
              />
            </div>
          </Card.Body>
        </Card>

        <Modal
          show={isModelOpen}
          onHide={setIsModelOpen}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header
            closeButton
            style={{
              background: UseDarkmode("#222738", "#FFFFFF"),
              borderBottomColor: UseDarkmode("#151824", "#DDD"),
            }}
          >
            <div
              className={`d-flex justify-content-center align-items-center ${style.bxTitleIcon}`}
            >
              <h5>{t("history_playback")}</h5>
            </div>
          </Modal.Header>
          <Modal.Body
            style={{
              background: UseDarkmode("#222738", "#FFFFFF"),
              overflow: "hidden",
            }}
          >
            <DateRangePicker
              className="d-inline-block w-100  mx-auto my-2 border border-primary rounded"
              onOk={(e) => handleDate(e)}
              onChange={(e) => handleDate(e)}
              placeholder={t("select_date_range")}
              format="yyyy-MM-dd hh:mm aa"
              placement="bottom"
              shouldDisableDate={afterToday()}
              defaultValue={[
                new Date(`${year}-${month}-${day} 00:00`),
                new Date(
                  `${year}-${month}-${day} ${dateNow.getHours()}:${dateNow.getMinutes()}`
                ),
              ]}
              locale={{
                sunday: t("Su"),
                monday: t("Mo"),
                tuesday: t("Tu"),
                wednesday: t("We"),
                thursday: t("Th"),
                friday: t("Fr"),
                saturday: t("Sa"),
                ok: t("OK"),
                today: t("Today"),
                yesterday: t("Yesterday"),
                hours: t("Hours"),
                minutes: t("Minutes"),
                seconds: t("Seconds"),
                last7Days: t("last7Days"),
                January: t("January"),
                February: t("February"),
                March: t("March"),
                April: t("April"),
                May: t("May"),
                June: t("June"),
                July: t("July"),
                August: t("August"),
                September: t("September"),
                October: t("October"),
                november: t("nov"),
                december: t("De"),
              }}
            />
          </Modal.Body>
          <Modal.Footer
            style={{
              background: UseDarkmode("#222738", "#FFFFFF"),
              borderTopColor: UseDarkmode("#151824", "#DDD"),
            }}
          >
            <Button
              className="my-0 mx-auto  py-2 px-5"
              onClick={handleShowPlayback}
            >
              {t("view_playback")}
            </Button>
          </Modal.Footer>
        </Modal>
      </Col>
    </Row>
  );
};
export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  let cameraData = null;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vehicles/settings?devType=cam&withloc=1`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.user?.new_token}`,
          "Content-Type": "application/json",
        },
      }
    );
  
  if (response.ok) {
    cameraData = await response.json();
    } else {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }

  const userRole = session?.user?.user?.role?.toLowerCase();
  const isUserOrFleet = userRole === "user" || userRole === "fleet";
  if (isUserOrFleet) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      locale: context.locale,
      ...(await serverSideTranslations(context.locale, [
        "driversManagement",
        "main",
        "forms",
        "management",
        "vehiclesCamera",
        "common",
        "Tour",
      ])),
      cameraData: cameraData || [], // Pass the fetched data to the component
    },
  };
}
export default VehiclesCamera;
