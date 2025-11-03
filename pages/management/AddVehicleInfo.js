import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Row, Col, Form, Card } from "react-bootstrap";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { add, empty } from "../../lib/slices/vehicleInfo";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// add vehicle information page 1
const ManufactCompanyName = [
  { value: "Acura", label: "Acura" },
  { value: "Alfa Romeo", label: "Alfa Romeo" },
  { value: "AM General", label: "AM General" },
  { value: "AMC", label: "AMC" },
  { value: "Ariel", label: "Ariel" },
  { value: "Aston Martin", label: "Aston Martin" },
  { value: "Asuna", label: "Asuna" },
  { value: "Audi", label: "Audi" },
  { value: "Austin", label: "Austin" },
  { value: "Austin-Healey", label: "Austin-Healey" },
  { value: "Bedford", label: "Bedford" },
  { value: "Bentley", label: "Bentley" },
];

const model = [
  { value: "CL", label: "CL" },
  { value: "CSX", label: "CSX" },
  { value: "EL", label: "EL" },
  { value: "Integra", label: "Integra" },
  { value: "Legend", label: "Legend" },
  { value: "MDX", label: "MDX" },
  { value: "NSX", label: "NSX" },
  { value: "RDX", label: "RDX" },
  { value: "RL", label: "RL" },
  { value: "RSX", label: "RSX" },
  { value: "SLX", label: "SLX" },
  { value: "TL", label: "TL" },
  { value: "TSX", label: "TSX" },
  { value: "Vigor", label: "Vigor" },
];
const vehicleType = [
  { value: "Salon", label: "Salon" },
  { value: "4X4", label: "4X4" },
  { value: "Truck", label: "Truck" },
  { value: "Sport", label: "Sport" },
];

const AddVehicleInfo = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const allDataVehicleInfo = useSelector((state) => state?.vehicleInfo);

  const [fullName, setFullName] = useState();
  const [plateNumber, setPlateNumber] = useState();
  const [manufacturingCompany, setManufacturingCompany] = useState();
  const [modelState, setModelState] = useState();
  const [manufacturingYear, setManufacturingYear] = useState();
  const [vehicleTypeState, setVehicleTypeState] = useState();
  const [color, setColor] = useState();
  const [chassisNumber, setChassisNumber] = useState();
  const [speedLimit, setSpeedLimit] = useState();
  const [literPer100KM, setLiterPer100KM] = useState();
  const [requiredRFID, setRequiredRFID] = useState();
  const [haveIgnition, setHaveIgnition] = useState();
  const [haveRelay, setHaveRelay] = useState();
  const [number, setNumber] = useState();
  const [rightLetter, setRightLetter] = useState();
  const [middleLetter, setMiddleLetter] = useState();
  // const [middleLetter, setMiddleLetter] = useState();

  const [leftLetter, setLeftLetter] = useState();
  const [sequenceNumber, setSequenceNumber] = useState();
  const [plateType, setPlateType] = useState();
  const [IMEINumber, setIMEINumber] = useState();

  const [validated, setValidated] = useState(false);

  // if (window.performance) {
  //   if (performance.navigation.type == 1) {
  //     return (window.location.href = "/management/VehicleManagment");
  //   }
  // }

  const handleFullName = (e) => {
    setFullName(e.target.value);
  };
  const handlePlateNumber = (e) => {
    setPlateNumber(e.target.value);
  };
  const handleManufacturingCompany = ({ value }) => {
    setManufacturingCompany(value);
  };
  const handleModel = ({ value }) => {
    setModelState(value);
  };
  const handleManufacturingYear = (e) => {
    setManufacturingYear(e.target.value);
  };
  const handleVehicleType = ({ value }) => {
    setVehicleTypeState(value);
  };
  const handleColor = (e) => {
    setColor(e.target.value);
  };
  const handleChassisNumber = (e) => {
    setChassisNumber(e.target.value);
  };
  const handleSpeedLimit = (e) => {
    setSpeedLimit(e.target.value);
  };
  const handleLiterPer100KM = (e) => {
    setLiterPer100KM(e.target.value);
  };
  const handleRequiredRFID = (e) => {
    setRequiredRFID(e.target.checked);
  };
  const handleHaveIgnition = (e) => {
    setHaveIgnition(e.target.checked);
  };
  const handleHaveRelay = (e) => {
    setHaveRelay(e.target.checked);
  };
  const handleNumber = (e) => {
    setNumber(e.target.value);
  };
  const handleRightLetter = (e) => {
    setRightLetter(e.target.value);
  };
  const handleMiddleLetter = (e) => {
    setMiddleLetter(e.target.value);
  };
  const handleLeftLetter = (e) => {
    setLeftLetter(e.target.value);
  };

  const handleSequenceNumber = (e) => {
    setSequenceNumber(e.target.value);
  };
  const handlePlateType = (e) => {
    setPlateType(e.target.value);
  };
  const handleIMEINumber = (e) => {
    setIMEINumber(e.target.value);
  };

  const allData = {
    fullName,
    plateNumber,
    manufacturingCompany,
    modelState,
    manufacturingYear,
    vehicleTypeState,
    color,
    chassisNumber,
    speedLimit,
    literPer100KM,
    requiredRFID,
    haveIgnition,
    haveRelay,
    number,
    rightLetter,
    middleLetter,
    leftLetter,
    sequenceNumber,
    plateType,
    IMEINumber,
  };

  const handleDeleteAllDataWithGoToMainPage = () => {
    dispatch(empty());
    router.push("/management/VehicleManagment");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (fullName && plateNumber && manufacturingYear) {
      dispatch(add(allData));
      router.push("/management/AddVehicleInfo2");
    }
    setValidated(true);
  };

  return (
    <div className="container-fluid">
      <Row>
        <Card>
          <Card.Body>
            <Row className=" d-flex justify-content-center">
              <Col md="8">
                <Card className="shadow-none">
                  <Card.Body>
                    <Form
                      className="mt-5"
                      noValidate
                      validated={validated}
                      onSubmit={handleSubmit}
                    >
                      <Row className=" rounded p-3 mb-3">
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="displayName">
                              Display Name{" "}
                            </Form.Label>
                            <Form.Control
                              onChange={handleFullName}
                              type="text"
                              id="displayName"
                              required
                              defaultValue={
                                allDataVehicleInfo.AddVehicleInfo?.fullName
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              Please provide a valid city.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="plate number">
                              Plate Number{" "}
                            </Form.Label>
                            <Form.Control
                              onChange={handlePlateNumber}
                              type="number"
                              id="plateNnpm"
                              required
                              defaultValue={
                                allDataVehicleInfo.AddVehicleInfo?.plateNumber
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              Please provide a valid city.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <div className="mb-3">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="ManufactCompanyName">
                                Manufacturing company
                              </Form.Label>

                              <Select
                                onChange={handleManufacturingCompany}
                                options={ManufactCompanyName}
                              />
                            </Form.Group>
                          </div>
                        </Col>
                        <Col lg="6">
                          <div className="mb-3">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="ManufactCompanyName">
                                Model
                              </Form.Label>
                              <Select onChange={handleModel} options={model} />
                            </Form.Group>
                          </div>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="ManufactureYear">
                              Manufacturing Year
                            </Form.Label>
                            <Form.Control
                              onChange={handleManufacturingYear}
                              type="number"
                              id="ManufactureYear"
                              required
                              defaultValue={
                                allDataVehicleInfo.AddVehicleInfo
                                  ?.manufacturingCompany
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              Please provide a valid city.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <div className="mb-3">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="vehicleType">
                                vehicle Type
                              </Form.Label>
                              <Select
                                onChange={handleVehicleType}
                                id="vehicleType"
                                options={vehicleType}
                              />
                            </Form.Group>
                          </div>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="color">color</Form.Label>
                            <Form.Control
                              onChange={handleColor}
                              type="text"
                              id="color"
                              defaultValue={
                                allDataVehicleInfo.AddVehicleInfo?.color
                              }
                            />
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="chassisNumber">
                              Chassis Number
                            </Form.Label>
                            <Form.Control
                              onChange={handleChassisNumber}
                              type="number"
                              id="chassisNumber"
                              defaultValue={
                                allDataVehicleInfo.AddVehicleInfo?.chassisNumber
                              }
                            />
                          </Form.Group>
                        </Col>

                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="speedLimit">
                              Speed Limit
                            </Form.Label>
                            <Form.Control
                              onChange={handleSpeedLimit}
                              type="number"
                              id="speedLimit"
                              defaultValue={
                                allDataVehicleInfo.AddVehicleInfo?.speedLimit
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="LiterPer100KM">
                              Liter Per 100KM
                            </Form.Label>
                            <Form.Control
                              onChange={handleLiterPer100KM}
                              type="number"
                              id="LiterPer100KM"
                              defaultValue={
                                allDataVehicleInfo.AddVehicleInfo?.literPer100KM
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col lg="6" className="d-flex justify-content-between">
                          <Form.Check className="form-check mb-3">
                            <Form.Check.Input
                              type="checkbox"
                              id="RequiredRFID"
                              onChange={handleRequiredRFID}
                            />
                            <Form.Check.Label htmlFor="RequiredRFID">
                              Required RFID
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check mb-3">
                            <Form.Check.Input
                              type="checkbox"
                              id="HaveIgnition"
                              onChange={handleHaveIgnition}
                            />
                            <Form.Check.Label htmlFor="HaveIgnition">
                              HaveIgnition
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check mb-3">
                            <Form.Check.Input
                              onChange={handleHaveRelay}
                              type="checkbox"
                              id="HaveRelay"
                            />
                            <Form.Check.Label htmlFor="HaveRelay">
                              HaveRelay
                            </Form.Check.Label>
                          </Form.Check>
                        </Col>
                      </Row>

                      <Row className=" rounded p-3 mb-3">
                        <h4 className="card-title mb-5 mt-3">
                          WASL Integration (Optional)
                        </h4>

                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="Number">Number </Form.Label>
                            <Form.Control
                              onChange={handleNumber}
                              type="number"
                              id="Number"
                              defaultValue={
                                allDataVehicleInfo.AddVehicleInfo?.number
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="rightLetter">
                              Right Letter
                            </Form.Label>
                            <Form.Control
                              onChange={handleRightLetter}
                              type="text"
                              id="rightLetter"
                              defaultValue={
                                allDataVehicleInfo.AddVehicleInfo?.rightLetter
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="middleLetter">
                              Middle Letter
                            </Form.Label>
                            <Form.Control
                              onChange={handleMiddleLetter}
                              type="text"
                              id="middleLetter"
                              defaultValue={
                                allDataVehicleInfo.AddVehicleInfo?.middleLetter
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="middleLetter2">
                              Middle Letter
                            </Form.Label>
                            <Form.Control type="text" id="middleLetter2" />
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="leftLetter">
                              Left Letter
                            </Form.Label>
                            <Form.Control
                              onChange={handleLeftLetter}
                              type="text"
                              id="leftLetter"
                              defaultValue={
                                allDataVehicleInfo.AddVehicleInfo?.leftLetter
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="SequenceNumber">
                              Sequence Number
                            </Form.Label>
                            <Form.Control
                              onChange={handleSequenceNumber}
                              type="number"
                              id="SequenceNumber"
                              defaultValue={
                                allDataVehicleInfo.AddVehicleInfo
                                  ?.sequenceNumber
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="PlateType">
                              Plate Type
                            </Form.Label>
                            <Form.Control
                              onChange={handlePlateType}
                              type="number"
                              id="PlateType"
                              defaultValue={
                                allDataVehicleInfo.AddVehicleInfo?.plateType
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="IMEINumber">
                              IMEI Number
                            </Form.Label>
                            <Form.Control
                              onChange={handleIMEINumber}
                              type="number"
                              id="IMEINumber"
                              defaultValue={
                                allDataVehicleInfo.AddVehicleInfo?.IMEINumber
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <div className="mt-5 d-flex justify-content-end">
                        <button
                          type="submit"
                          className="btn btn-primary px-3 py-2 ms-3"
                        >
                          <FontAwesomeIcon
                            className="me-2"
                            icon={faArrowRight}
                            size="sm"
                          />
                          Next
                        </button>
                        <button
                          onClick={() => handleDeleteAllDataWithGoToMainPage()}
                          className="btn btn-primary px-3 py-2 ms-3"
                        >
                          <FontAwesomeIcon
                            className="me-2"
                            icon={faTimes}
                            size="sm"
                          />
                          Cancel
                        </button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Row>
    </div>
  );
};

export default AddVehicleInfo;
export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["Management", "main", "common"])),
    },
  };
}