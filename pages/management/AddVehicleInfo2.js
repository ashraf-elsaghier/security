import { useEffect, useState } from "react";
import { Row, Col, Card, Form } from "react-bootstrap";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faForward,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { add, empty } from "../../lib/slices/vehicleInfo";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// add vehicle information page 2

const model = [
  { value: "Add new device", label: "Add new device" },
  { value: "6109798923", label: "6109798923" },
  { value: "6109798924", label: "6109798924" },
  { value: "6109798925", label: "6109798925" },
];
const AddDeviceInformation = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const allDataVehicleInfo = useSelector((state) => state?.vehicleInfo);

  const [selectADevice, setSelectADevice] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [validated, setValidated] = useState(false);
  const [disableInputs, setDisableInputs] = useState(false);

  if (window.performance) {
    if (performance.navigation.type == 1) {
      return (window.location.href = "/management/VehicleManagment");
    }
  }

  const handleSelectADevice = ({ value }) => {
    setSelectADevice(value);
    if (value && value !== "Add new device") {
      setSerialNumber(value);
      setDeviceType(value);
      setDisableInputs(true);
    } else {
      setDisableInputs(false);
    }
  };
  const handleSerialNumber = (e) => {
    setSerialNumber(e.target.value);
  };
  const handleDeviceType = ({ value }) => {
    setDeviceType(value);
  };

  const allData = {
    selectADevice,
    serialNumber,
    deviceType,
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (serialNumber) {
      dispatch(add(allData));
      router.push("/management/AddVehicleInfo3");
    }
    setValidated(true);
  };

  const handleOnBack = () => {
    dispatch(add(allData));
    router.push("/management/AddVehicleInfo");
  };

  const handleDeleteAllDataWithGoToMainPage = () => {
    dispatch(empty());
    router.push("/management/VehicleManagment");
  };

  return (
    <div className="container-fluid">
      <Row>
        <Card>
          <Card.Body>
            <Row className=" d-flex justify-content-center mb-5">
              <Col lg="6">
                <Form
                  className="mt-5"
                  noValidate
                  validated={validated}
                  onSubmit={handleSubmit} Manufacturing company

                >
                  <Row className="p-3 mb-3">
                    <Col md="12">
                      <h4>Select exist Device</h4>
                      <div className="my-3">
                        <Form.Group className="form-group">
                          <Form.Label>Select a Device</Form.Label>
                          <Select
                            onChange={handleSelectADevice}
                            options={model}
                          />
                        </Form.Group>
                      </div>
                    </Col>
                    <Col md="12" className="mt-3">
                      <h4>Add new Device</h4>
                      <div className="my-3">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="SerialNumber">
                            Serial Number
                          </Form.Label>
                          <Form.Control
                            onChange={handleSerialNumber}
                            type="number"
                            id="SerialNumber"
                            required
                            defaultValue={
                              selectADevice
                                ? selectADevice
                                : allDataVehicleInfo.AddVehicleInfo2
                                  ?.serialNumber
                            }
                            disabled={disableInputs}
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide a valid city.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                    </Col>
                    <Col md="12">
                      <div className="mb-3">
                        <Form.Group className="form-group">
                          <Form.Label>Device Type</Form.Label>
                          <Select
                            disabled={disableInputs}
                            isOptionDisabled={() => disableInputs}
                            onChange={handleDeviceType}
                            options={model}
                            value={{
                              value: deviceType,
                              label: deviceType,
                            }}
                          />
                        </Form.Group>
                      </div>
                    </Col>
                  </Row>
                  <Col md="12">
                    <div className="mt-5 d-flex justify-content-end">
                      <button
                        onClick={() => handleOnBack()}
                        className="btn btn-primary px-3 py-2 ms-3"
                      >
                        <FontAwesomeIcon
                          className="me-2"
                          icon={faArrowLeft}
                          size="sm"
                        />
                        Back
                      </button>
                      <button
                        className="btn btn-primary px-3 py-2 ms-3"
                        type="submit"
                      >
                        <FontAwesomeIcon
                          className="me-2"
                          icon={faArrowRight}
                          size="sm"
                        />
                        Next
                      </button>
                      <Link href="/management/AddVehicleInfo3" passHref>
                        <button className="btn btn-primary px-3 py-2 ms-3">
                          <FontAwesomeIcon
                            className="me-2"
                            icon={faForward}
                            size="sm"
                          />
                          Skip
                        </button>
                      </Link>
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
                  </Col>
                </Form>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Row>
    </div>
  );
};
export default AddDeviceInformation;
export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["Management", "main", "common"])),
    },
  };
}