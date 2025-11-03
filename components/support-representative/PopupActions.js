import { Suspense, memo, useState } from "react";
import { Button } from "react-bootstrap";
import CalibrateMileage from "./CalibrateMileage";
import SubmitACommand from "./SubmitCommand";

const PopupActions = ({ selectedVehicles }) => {
  const [showCalibrateMileage, setShowCalibrateMileage] = useState(false);
  const [showSubmitACommand, setShowSubmitACommand] = useState(false);
  return (
    <>
      <div className="w-100 d-flex gap-3 ">
        <Button
          variant="outline-primary"
          className="fs-5"
          onClick={() => setShowCalibrateMileage(true)}
          style={{ flex: 1 }}
        >
          Calibrate Mileage
        </Button>
        <Button
          className="fs-5 py-1"
          variant="outline-primary"
          onClick={() => {
            setShowSubmitACommand(true);
          }}
          style={{ flex: 1 }}
        >
          Submit A Command
        </Button>
      </div>
      {showCalibrateMileage ? (
        <CalibrateMileage
          selectedVehicles={selectedVehicles}
          show={showCalibrateMileage}
          setShow={setShowCalibrateMileage}
        />
      ) : null}
      {showSubmitACommand ? (
        <SubmitACommand
          show={showSubmitACommand}
          setShow={setShowSubmitACommand}
          selectedVehicles={selectedVehicles}
        />
      ) : null}
    </>
  );
};

export default memo(PopupActions);
