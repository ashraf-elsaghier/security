import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import { toast } from "react-toastify";
// import { useTranslation } from "next-i18next";
import { Formik } from "formik";
import Input from "components/formik/Input";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import { AddDeviceValidation } from "helpers/yup-validations/management/DeviceManagement";
import {
  fetchDeviceTypes,
  fetchSingleDevice,
  fetchAllUnAssignedSimCardData,
  updateDevice,
} from "services/management/DeviceManagement";
import Spinner from "components/UI/Spinner";
import { useTranslation } from "next-i18next";

const EditDevice = ({
  editId,
  updateAssignedTable,
  updateUnassignedTable,
  handleModel,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [allDeviceTypesOptions, setAllDeviceTypesOptions] = useState([]);
  const [unAssignedSimCardsOptions, setUnAssignedSimCardsOptions] = useState(
    []
  );
  const [deviceData, setDeviceData] = useState({});
  const { t } = useTranslation("Management");
  useEffect(() => {
    (async () => {
      setLoadingPage(true);
      try {
        // fetch device data
        const fetchDevice = await fetchSingleDevice(editId);
        let device = fetchDevice.result[0];
        setDeviceData(device);
        // fetch device types for select
        const fetchDevTypes = await fetchDeviceTypes();
        setAllDeviceTypesOptions(
          fetchDevTypes?.allDeviceTypes?.map((ele) => {
            return { value: ele.ID, label: ele.DeviceType };
          })
        );
        // fetch unAssignedSimCards for select
        const fetchUnAssignedSimCardsData =
          await fetchAllUnAssignedSimCardData();
        const unAssignedSimcards = fetchUnAssignedSimCardsData.result.map(
          (ele) => {
            return {
              value: ele.ID,
              label: ele.PhoneNumber,
              provID: ele.ProviderID,
            };
          }
        );
        setUnAssignedSimCardsOptions([
          {
            value: device.SimID,
            label: device.PhoneNumber,
            provID: device.ProviderID,
          },
          ...unAssignedSimcards,
        ]);
      } catch (error) {
        toast.error(error.response.data?.message);
      }
      setLoadingPage(false);
    })();
  }, [editId]);

  // options for sim provider for react select
  const statusOptions = [
    { value: 0, label: t("Used") },
    { value: 1, label: t("Ready to Use") },
    { value: 2, label: t("Returned") },
    { value: 3, label: t("Deffected") },
  ];

  const onSubmit = async (data) => {
    const submitData = {
      ...data,
      SimID: data?.SimID[0]?.value ?? data?.SimID,
    };
    setLoading(true);

    try {
      const respond = await updateDevice(editId, submitData);
      setLoading(false);
      toast.success(respond?.message);
      handleModel();
      updateAssignedTable();
      updateUnassignedTable();
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong, Try again later!"
      );
    }
  };

  const initialValues = {
    SerialNumber: deviceData.SerialNumber,
    DeviceTypeID: deviceData.DeviceTypeID,
    Status: deviceData.Status,
    SimID: deviceData.SimID,
    VehicleID: deviceData.VehicleID,
  };
  console.log({ deviceData });

  return (
    <div className="container-fluid">
      {loadingPage && <Spinner />}
      {Object.keys(deviceData).length > 0 &&
        allDeviceTypesOptions.length > 0 &&
        unAssignedSimCardsOptions.length > 0 && (
          <Card className="py-0 mb-2">
            <Card.Body className="py-0">
              <Formik
                initialValues={initialValues}
                validationSchema={AddDeviceValidation}
                onSubmit={onSubmit}
              >
                {(formik) => {
                  // setTimeout(() => getFormData(formik.values), 0);
                  return (
                    <Form onSubmit={formik.handleSubmit}>
                      <Row>
                        <Col className="mx-auto" md={12}>
                          <Row>
                            <h4 className="mb-3"> {t("Edit Device")} </h4>
                            <Input
                              placeholder={t("Serial Number")}
                              label={t("Serial Number")}
                              name="SerialNumber"
                              type="text"
                              className={"col-6 mb-3"}
                              onFocus={(event) => event.target.select()}
                            />

                            <ReactSelect
                              options={allDeviceTypesOptions}
                              label={t("Device Type")}
                              placeholder={t("Select Device Type")}
                              name="DeviceTypeID"
                              className={"col-6 mb-3"}
                              isSearchable={true}
                            />

                            <ReactSelect
                              options={statusOptions}
                              defaultValue={deviceData?.Status}
                              label={t("Status")}
                              name="Status"
                              placeholder={t("Select Status")}
                              className={"col-12 mb-3"}
                              isSearchable={true}
                            />

                            <h4 className="mb-3"> {t("Edit SIM Card")} </h4>
                            <ReactSelect
                              options={unAssignedSimCardsOptions}
                              label={t("Select a SIM card")}
                              placeholder={t("Select a SIM card")}
                              name="SimID"
                              defaultValue={deviceData?.SimID}
                              className={"col-12 mb-3"}
                              isSearchable={true}
                              isObject={true}
                            />
                          </Row>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="mx-auto" md={12}>
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
                              {t("Save")}
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
                              {t("Cancel")}
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

export default EditDevice;
