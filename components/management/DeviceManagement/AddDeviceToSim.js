import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import { toast } from "react-toastify";
// import { useTranslation } from "next-i18next";
import { Formik } from "formik";
import Input from "components/formik/Input";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import { AddSimValidation } from "helpers/yup-validations/management/DeviceManagement";
import {
  assignSimCard,
  fetchAllUnAssignedSimCardData,
} from "services/management/DeviceManagement";
import Spinner from "components/UI/Spinner";
import { useTranslation } from "next-i18next";

const AddDeviceToSim = ({
  deviceData,
  handleModel,
  updateAssignedTable,
  updateUnassignedTable,
}) => {
  const [loadingPage, setLoadingPage] = useState(true);
  const [unAssignedSimCardsOptions, setUnAssignedSimCardsOptions] = useState(
    []
  );

  const [serialNumberInput, setSerialNumberInput] = useState("");
  const [chosenType, setChosenType] = useState("");
  const [loading, setLoading] = useState(false);
  const [disableInputs, setDisableInputs] = useState(false);
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const { t } = useTranslation('Management')
  // fetch all selections data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch unAssignedSimCards for select
        const fetchUnAssignedSimCardsData =
          await fetchAllUnAssignedSimCardData();
        const unAssignedSimcards = fetchUnAssignedSimCardsData.result.map(
          (ele) => {
            return {
              value: ele.SimSerialNumber,
              label: ele.PhoneNumber,
              provID: ele.ProviderID,
              simID: ele.ID,
            };
          }
        );
        setUnAssignedSimCardsOptions(unAssignedSimcards);
        setLoadingPage(false);
      } catch (error) {
        toast.error(error.response.data?.message);
        setLoadingPage(false);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    const submitData = {
      deviceId: deviceData.DeviceID
    };
    setLoading(true);
    try {
      const simCardId = data.simSelected[0].simID
      const respond = await assignSimCard(simCardId, submitData);
      updateAssignedTable();
      updateUnassignedTable();
      toast.success("Sim Card Added to Vehicle Successfully");
      setLoading(false);
      handleModel();
    } catch (error) {
      toast.error(error.response.data?.message);
      setLoading(false);
    }
  };

  // options for sim provider for react select
  const simProviderOptions = [
    { value: 1, label: "Zain" },
    { value: 2, label: "Mobily" },
    { value: 3, label: "Stc" },
    { value: 4, label: "Libara" },
  ];

  const initialValues = {
    SimSerialNumber: "",
    PhoneNumber: "",
    ProviderID: "",
    simSelected: "",
    SimID: "",
  };

  const getFormData = (values) => {
    setDisableInputs(true);
    setSerialNumberInput(values.simSelected[0]?.value);
    setPhoneNumberInput(values.simSelected[0]?.label);
    setChosenType(values.simSelected[0]?.provID);
  };

  return (
    <div className="container-fluid">
      {loadingPage && <Spinner />}
      {unAssignedSimCardsOptions.length > 0 && (
        <Card>
          <Card.Body>
            <Formik
              initialValues={initialValues}
              validationSchema={AddSimValidation}
              onSubmit={onSubmit}
            >
              {(formik) => {
                setTimeout(() => getFormData(formik.values), 0);
                return (
                  <Form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col className="mx-auto " md={10}>
                        <Row>
                          <h4 className="mb-3">{t('Select a SIM Card')}</h4>
                          <ReactSelect
                            options={unAssignedSimCardsOptions}
                            label={t('Select a SIM card')}
                            placeholder={t('Select a SIM card')}
                            name="simSelected"
                            className={"col-12 mb-3 select-card"}
                            isSearchable={true}
                            isObject={true}
                          />

                          <Input
                            placeholder={t("Serial Number")}
                            label={t("Serial Number")}
                            name="simSerialNumber"
                            type="text"
                            className={"col-6 mb-3"}
                            disabled={disableInputs ? true : false}
                            onFocus={(event) => event.target.select()}
                            value={
                              (formik.values.simSerialNumber =
                                serialNumberInput)
                            }
                          />

                          <Input
                            placeholder={t("Phone Number")}
                            label={t("Phone Number")}
                            name="phoneNumber"
                            type="text"
                            className={"col-6 mb-3"}
                            disabled={disableInputs ? true : false}
                            onFocus={(event) => event.target.select()}
                            value={
                              (formik.values.phoneNumber = phoneNumberInput)
                            }
                          />

                          <ReactSelect
                            options={simProviderOptions}
                            label={t("SIM Provider")}
                            placeholder={t("Select SIM Provider")}
                            name="ProviderID"
                            className={"col-12 mb-3"}
                            isSearchable={true}
                            isDisabled={disableInputs ? true : false}
                            value={
                              chosenType
                                ? simProviderOptions.find(
                                  (option) => option.value === chosenType
                                )
                                : simProviderOptions.find(
                                  (option) =>
                                    option.value === formik.values.ProviderID
                                )
                            }
                          />
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="mx-auto" md={10}>
                        <div className="w-25 d-flex flex-wrap flex-md-nowrap">
                          <Button
                            type="submit"
                            disabled={loading}
                            className="px-3 py-2 text-nowrap me-3 mb-2 mb-md-0"
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
                            {t('Assign')}
                          </Button>
                          <Button
                            className="px-3 py-2 text-nowrap me-3 ms-0"
                            onClick={() => {
                              handleModel();
                            }}
                          >
                            <FontAwesomeIcon
                              className="mx-2"
                              icon={faTimes}
                              size="sm"
                            />
                            {t('Cancel')}
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
      )}
    </div>
  );
};

export default AddDeviceToSim;
