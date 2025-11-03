import { Suspense, memo, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "react-bootstrap";

// leafletActions
const EditInfo = dynamic(
  () => import("components/maps/LeaflitActions/EditInfo"),
  {
    loading: () => <header />,
  }
);
const CalibrateMileage = dynamic(
  () => import("components/maps/LeaflitActions/CalibrateMileage"),
  {
    loading: () => <header />,
  }
);
const CalibrateWeightSetting = dynamic(
  () => import("components/maps/LeaflitActions/CalibrateWeightSetting"),
  {
    loading: () => <header />,
  }
);
const ShareLocation = dynamic(
  () => import("components/maps/LeaflitActions/ShareLocation"),
  {
    loading: () => <header />,
  }
);
const DisableVehicle = dynamic(
  () => import("components/maps/LeaflitActions/DisableVehicle"),
  {
    loading: () => <header />,
  }
);
const EnableVehicle = dynamic(
  () => import("components/maps/LeaflitActions/EnableVehicle"),
  {
    loading: () => <header />,
  }
);
const ShowCam = dynamic(
  () => import("components/maps/LeaflitActions/ShowCam"),
  {
    loading: () => <header />,
  }
);
const SubmitACommand = dynamic(
  () => import("components/maps/LeaflitActions/SubmitACommand"),
  {
    loading: () => <header />,
  }
);
const Actions = ({
  selectedVehicles,
  setAllTreeData,
  setSelectedVehicles,
  allTreeData,
}) => {
  const [showEditInfo, setShowEditInfo] = useState(false);
  const [showCalibrateMileage, setShowCalibrateMileage] = useState(false);
  const [showCalibrateWeightSetting, setShowCalibrateWeightSetting] =
    useState(false);
  const [showShareLocation, setShowShareLocation] = useState(false);
  const [showDisableVehicle, setShowDisableVehicle] = useState(false);
  const [showEnableVehicle, setShowEnableVehicle] = useState(false);
  const [showShowCam, setShowShowCam] = useState(false);
  const [showSubmitACommand, setShowSubmitACommand] = useState(false);
  return (
    <>
      <Suspense fallback={"loading"}>
        <Button
          id="EditInformationBtn"
          className="d-none"
          onClick={() => setShowEditInfo(true)}
        ></Button>
        {showEditInfo ? (
          <EditInfo
            show={showEditInfo}
            setShow={setShowEditInfo}
            setAllTreeData={setAllTreeData}
            setSelectedVehicles={setSelectedVehicles}
            allTreeData={allTreeData}
          />
        ) : null}
      </Suspense>
      <Suspense fallback={"loading"}>
        <Button
          id="CalibrateMileageBtn"
          className="d-none"
          onClick={() => setShowCalibrateMileage(true)}
        ></Button>
        {showCalibrateMileage ? (
          <CalibrateMileage
            selectedVehicles={selectedVehicles}
            show={showCalibrateMileage}
            setShow={setShowCalibrateMileage}
          />
        ) : null}
      </Suspense>
      <Suspense fallback={"loading"}>
        <Button
          id="CalibrateWeightSettingBtn"
          className="d-none"
          onClick={() => setShowCalibrateWeightSetting(true)}
        ></Button>
        {showCalibrateWeightSetting ? (
          <CalibrateWeightSetting
            show={showCalibrateWeightSetting}
            setShow={setShowCalibrateWeightSetting}
          />
        ) : null}
      </Suspense>
      <Suspense fallback={"loading"}>
        <Button
          id="ShareLocationBtn"
          className="d-none"
          onClick={() => setShowShareLocation(true)}
        ></Button>
        {showShareLocation ? (
          <ShareLocation
            show={showShareLocation}
            setShow={setShowShareLocation}
          />
        ) : null}
      </Suspense>
      <Suspense fallback={"loading"}>
        <Button
          id="DisableVehicleBtn"
          className="d-none"
          onClick={() => setShowDisableVehicle(true)}
        ></Button>
        {showDisableVehicle ? (
          <DisableVehicle
            show={showDisableVehicle}
            setShow={setShowDisableVehicle}
            selectedVehicles={selectedVehicles}
          />
        ) : null}
      </Suspense>
      <Suspense fallback={"loading"}>
        <Button
          id="EnableVehicleBtn"
          className="d-none"
          onClick={() => setShowEnableVehicle(true)}
        ></Button>
        {showEnableVehicle ? (
          <EnableVehicle
            show={showEnableVehicle}
            setShow={setShowEnableVehicle}
            selectedVehicles={selectedVehicles}
          />
        ) : null}
      </Suspense>

      <Suspense fallback={"loading"}>
        <Button
          id="ShowCamBtn"
          className="d-none"
          onClick={() => setShowShowCam(true)}
        ></Button>
        {showShowCam ? (
          <ShowCam show={showShowCam} setShow={setShowShowCam} />
        ) : null}
      </Suspense>
      <Suspense fallback={"loading"}>
        <Button
          id="SubmitACommandBtn"
          className="d-none"
          onClick={() => {
            setShowSubmitACommand(true);
          }}
        ></Button>
        {showSubmitACommand ? (
          <SubmitACommand
            show={showSubmitACommand}
            setShow={setShowSubmitACommand}
            selectedVehicles={selectedVehicles}
          />
        ) : null}
      </Suspense>
    </>
  );
};

export default memo(Actions);
