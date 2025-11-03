import { useState } from "react";
import { Row, Col, Card, Form } from "react-bootstrap";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faArrowLeft,
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
const AddSIMCardInformation = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const allDataVehicleInfo = useSelector((state) => state?.vehicleInfo);

  const [selectASINCard, setSelectASINCard] = useState("");
  const [SIMSerialNumber, setSIMSerialNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [SIMProvider, setSIMProvider] = useState("");
  const [validated, setValidated] = useState(false);
  const [disableInputs, setDisableInputs] = useState(false);

  if (window.performance) {
    if (performance.navigation.type == 1) {
      return (window.location.href = "/management/VehicleManagment");
    }
  }

  const handleSelectASINCard = ({ value }) => {
    setSelectASINCard(value);
    if (value && value !== "Add new device") {
      setSIMSerialNumber(value);
      setPhoneNumber(value);
      setSIMProvider(value);
      setDisableInputs(true);
    } else {
      setDisableInputs(false);
    }
  };
  const handleSIMSerialNumber = (e) => {
    setSIMSerialNumber(e.target.value);
  };
  const handlePhoneNumber = (e) => {
    setPhoneNumber(e.target.value);
  };
  const handleSIMProvider = ({ value }) => {
    setSIMProvider(value);
  };

  const handleDeleteAllDataWithGoToMainPage = () => {
    dispatch(empty());
    router.push("/management/VehicleManagment");
  };

  const allData = {
    selectASINCard,
    SIMSerialNumber,
    phoneNumber,
    SIMProvider,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (SIMSerialNumber && phoneNumber) {
      dispatch(add(allData));
      router.push("/management/VehicleManagment");
    }
    setValidated(true);
  };

  const handleOnBack = () => {
    dispatch(add(allData));
    router.push("/management/AddVehicleInfo3");
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
                  <Row className="p-3 mb-3">
                    <div className="card-title">
                      <h4>Select exist SIM card</h4>
                    </div>
                    <Col md="12">
                      <div className="my-3">
                        <Form.Group className="form-group">
                          <Form.Label>Select a SIN card</Form.Label>
                          <Select
                            onChange={handleSelectASINCard}
                            options={model}
                          />
                        </Form.Group>
                      </div>
                    </Col>
                    <Col md="12" className="card-title my-3">
                      <h4>Add new SIM card</h4>
                    </Col>

                    <Col md="6">
                      <div className="mb-3">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="SimSerialNumber">
                            SIM Serial Number
                          </Form.Label>
                          <Form.Control
                            onChange={handleSIMSerialNumber}
                            type="number"
                            id="SimSerialNumber"
                            required
                            defaultValue={
                              allDataVehicleInfo.AddVehicleInfo4
                                ?.SIMSerialNumber
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide a valid city.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <Form.Group className="form-group">
                          <Form.Label htmlFor="phoneNumber">
                            Phone Number
                          </Form.Label>
                          <Form.Control
                            onChange={handlePhoneNumber}
                            type="number"
                            id="phoneNumber"
                            required
                            defaultValue={
                              allDataVehicleInfo.AddVehicleInfo4?.phoneNumber
                            }
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
                          <Form.Label>SIM Provider</Form.Label>
                          <Select
                            onChange={handleSIMProvider}
                            options={model}
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
                          icon={faCheck}
                          size="sm"
                        />
                        Finish
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
export default AddSIMCardInformation;
export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["Management", "main", "common"])),
    },
  };
}