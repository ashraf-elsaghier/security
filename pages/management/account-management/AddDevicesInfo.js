import { useState } from "react";
import { useRouter } from "next/router";
import { Row, Col, Form, Card } from "react-bootstrap";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { add, empty } from "../../../lib/slices/addDevicesInfo";

const options = [
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

const AddDevicesInfo = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [serialNumber, setSerialNumber] = useState();
  const [status, setStatus] = useState();
  const [deviceType, setDeviceType] = useState();

  const [validated, setValidated] = useState(false);

  const handleSerialNumber = (e) => {
    setSerialNumber(e.target.value);
  };
  const handleStatus = ({ value }) => {
    setStatus(value);
  };
  const handleDeviceType = ({ value }) => {
    setDeviceType(value);
  };

  const allData = {
    serialNumber,
    status,
    deviceType,
  };

  const handleDeleteAllDataWithGoToMainPage = () => {
    dispatch(empty());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (serialNumber) {
      dispatch(add(allData));
      router.push("/management/account-management/AddDevicesInfo2");
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
                              Serial Number
                            </Form.Label>
                            <Form.Control
                              onChange={handleSerialNumber}
                              type="text"
                              id="displayName"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              Please provide a valid city.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="plate number">
                              Status
                            </Form.Label>
                            <Select options={options} onChange={handleStatus} />
                          </Form.Group>
                        </Col>
                        <Col lg="6">
                          <div className="mb-3">
                            <Form.Group className="form-group">
                              <Form.Label htmlFor="ManufactCompanyName">
                                Device Type
                              </Form.Label>
                              <Select
                                onChange={handleDeviceType}
                                options={options}
                              />
                            </Form.Group>
                          </div>
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
                        <Link
                          href="/management/account-management/ManageUsers"
                          passHref
                        >
                          <button
                            onClick={() =>
                              handleDeleteAllDataWithGoToMainPage()
                            }
                            className="btn btn-primary px-3 py-2 ms-3"
                          >
                            <FontAwesomeIcon
                              className="me-2"
                              icon={faTimes}
                              size="sm"
                            />
                            Cancel
                          </button>
                        </Link>
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

export default AddDevicesInfo;
