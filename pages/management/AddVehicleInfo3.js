import { useState } from "react";
import { Row, Col, Card, Form } from "react-bootstrap";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { add, empty } from "../../lib/slices/vehicleInfo";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
const model = [
  { value: "Add new device", label: "Add new device" },
  { value: "6109798923", label: "6109798923" },
  { value: "6109798924", label: "6109798924" },
  { value: "6109798925", label: "6109798925" },
];
const AddGroupInformation = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const allDataVehicleInfo = useSelector((state) => state?.vehicleInfo);

  const [groupName, setGroupName] = useState("");
  const [maximumParkingTime, setMaximumParkingTime] = useState("");
  const [maximumIdlingTime, setMaximumIdlingTime] = useState("");
  const [remarks, setRemarks] = useState("");
  const [validated, setValidated] = useState(false);

  if (window.performance) {
    if (performance.navigation.type == 1) {
      return (window.location.href = "/management/VehicleManagment");
    }
  }

  const handleGroupName = ({ value }) => {
    setGroupName(value);
  };
  const handleMaximumParkingTime = (e) => {
    setMaximumParkingTime(e.target.value);
  };
  const handleMaximumIdlingTime = (e) => {
    setMaximumIdlingTime(e.target.value);
  };
  const handleRemarks = (e) => {
    setRemarks(e.target.value);
  };

  const handleDeleteAllDataWithGoToMainPage = () => {
    dispatch(empty());
    router.push("/management/VehicleManagment");
  };

  const allData = {
    groupName,
    maximumParkingTime,
    maximumIdlingTime,
    remarks,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(add(allData));
    router.push("/management/AddVehicleInfo4");
    setValidated(true);
  };

  const handleOnBack = () => {
    dispatch(add(allData));
    router.push("/management/AddVehicleInfo4");
  };

  return (
    <div className="container-fluid">
      <Row>
        <Card>
          <Card.Body>
            <Row className=" d-flex justify-content-center mb-5">
              <Col lg="6">
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={handleSubmit}
                  className="mt-5"
                >
                  <Row>
                    <Col md="12">
                      <div className="mb-3">
                        <Form.Group className="form-group">
                          <Form.Label>Group Name</Form.Label>
                          <Select onChange={handleGroupName} options={model} />
                        </Form.Group>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="MaximumParkingTime">
                            Maximum Parking Time
                          </Form.Label>
                          <Form.Control
                            onChange={handleMaximumParkingTime}
                            type="number"
                            id="MaximumParkingTime"
                            defaultValue={
                              allDataVehicleInfo.AddVehicleInfo3
                                ?.maximumParkingTime
                            }
                          />
                        </Form.Group>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="MaximumIdlingTime">
                            Maximum Idling Time
                          </Form.Label>
                          <Form.Control
                            onChange={handleMaximumIdlingTime}
                            type="number"
                            id="MaximumIdlingTime"
                            defaultValue={
                              allDataVehicleInfo.AddVehicleInfo3
                                ?.maximumIdlingTime
                            }
                          />
                        </Form.Group>
                      </div>
                    </Col>
                    <Col md="12">
                      <div className="mb-3">
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlTextarea1"
                        >
                          <Form.Label>Remarks</Form.Label>
                          <Form.Control
                            onChange={handleRemarks}
                            as="textarea"
                            rows={7}
                            defaultValue={
                              allDataVehicleInfo.AddVehicleInfo3?.remarks
                            }
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
export default AddGroupInformation;
export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["Management", "main", "common"])),
    },
  };
}