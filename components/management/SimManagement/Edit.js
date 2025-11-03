import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import { toast } from "react-toastify";
// import { useTranslation } from "next-i18next";
import { Formik } from "formik";
import Input from "components/formik/Input";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import { AddSimValidation } from "helpers/yup-validations/management/sim-management";
import { updateSim } from "services/management/SimManagement";

const EditSim = ({
  editObj,
  updateAssignedTable,
  updateUnassignedTable,
  handleModel,
}) => {
  const [loading, setLoading] = useState(false);
  const { ID: id, PhoneNumber, SimSerialNumber, ProviderID } = editObj;

  // options for sim provider for react select
  const simProviderOptions = [
    { value: 1, label: "Zain" },
    { value: 2, label: "Mobily" },
    { value: 3, label: "Stc" },
    { value: 4, label: "Libara" },
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const respond = await updateSim(id, data);
      setLoading(false);
      toast.success(respond.message);
      handleModel();
      updateAssignedTable();
      updateUnassignedTable();
    } catch (error) {
      toast.error(error.response.data?.message);
      setLoading(false);
    }
  };

  const initialValues = {
    SimSerialNumber: SimSerialNumber,
    PhoneNumber: PhoneNumber,
    ProviderID: ProviderID,
  };

  return (
    <div className="container-fluid">
      <Card>
        <Card.Body className="p-0 m-0">
          <Formik
            initialValues={initialValues}
            validationSchema={AddSimValidation}
            onSubmit={onSubmit}
          >
            {(formik) => {
              return (
                <Form onSubmit={formik.handleSubmit}>
                  <Row>
                    <Col className="mx-auto" md={10}>
                      <Row>
                        <h4 className="mb-3">Edit SIM Card</h4>
                        <Input
                          placeholder="Serial Number"
                          label="Serial Number"
                          name="SimSerialNumber"
                          type="text"
                          className={"col-6 mb-3"}
                          onFocus={(event) => event.target.select()}
                        />

                        <Input
                          placeholder="Phone Number"
                          label="Phone Number"
                          name="PhoneNumber"
                          type="number"
                          min={0}
                          className={"col-6 mb-3"}
                          onFocus={(event) => event.target.select()}
                        />

                        <ReactSelect
                          options={simProviderOptions}
                          label="SIM Provider"
                          placeholder="Select SIM Provider"
                          name="ProviderID"
                          className={"col-12 mb-3"}
                          isSearchable={true}
                        />
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="mx-auto" md={10}>
                      <div className="w-25 d-flex flex-wrap flex-md-nowrap">
                        <Button
                          type="submit"
                          className="px-3 py-2 text-nowrap me-3 mb-2 mb-md-0"
                          disabled={loading}
                        >
                          {!loading ? (
                            <FontAwesomeIcon
                              className="mx-2"
                              icon={faCheck}
                              size="sm"
                            />
                          ) : (
                            <FontAwesomeIcon
                              className="mx-2 fa-spin"
                              icon={faSpinner}
                              size="sm"
                            />
                          )}
                          Submit
                        </Button>
                        <Button
                          className="px-3 py-2 text-nowrap me-3 ms-0"
                          onClick={() => {
                            handleModel()
                          }}
                        >
                          <FontAwesomeIcon
                            className="mx-2"
                            icon={faTimes}
                            size="sm"
                          />
                          Cancel
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              );
            }}
          </Formik>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditSim;
