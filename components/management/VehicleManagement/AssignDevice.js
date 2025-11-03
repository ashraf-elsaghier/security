import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import { toast } from "react-toastify";
// import { useTranslation } from "next-i18next";
import { Formik } from "formik";
import Input from "components/formik/Input";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import { vehicleAddDevice } from "helpers/yup-validations/management/VehicleManagement";
import { fetchAllUnAssignedDevicesData } from "services/management/VehicleManagement";
import { addDeviceRequst } from "services/management/VehicleManagement";
import { useTranslation } from "next-i18next";

const AddDeviceToVeh = ({
  id,
  handleModel,
  updateAssignedTable,
  updateUnassignedTable,
}) => {
  const [loadingPage, setLoadingPage] = useState(true);
  const [unAssignedDevicesOptions, setUnAssignedDevicesOptions] = useState([]);
  const [allDeviceTypesOptions, setAllDeviceTypesOptions] = useState([]);
  const [serialNumberInput, setSerialNumberInput] = useState("");
  const [chosenType, setChosenType] = useState("");
  const [loading, setLoading] = useState(false);

  // fetch all selections data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const respond = await fetchAllUnAssignedDevicesData();
        const unAssignedDevices = respond.unAssignedDevices.map((ele) => {
          return {
            value: ele.SerialNumber,
            label: ele.SerialNumber,
            typeID: ele.DeviceTypeID,
          };
        });
        setUnAssignedDevicesOptions(unAssignedDevices);
        setAllDeviceTypesOptions(
          respond?.allDeviceTypes?.map((ele) => {
            return { value: ele.ID, label: ele.DeviceType };
          })
        );
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
      serialNumber: data.serialNumber,
      deviceTypeId: chosenType ? chosenType : data.deviceTypeId,
    };
    setLoading(true);
    try {
      const respond = await addDeviceRequst({ ...submitData, vehicleId: id });
      toast.success("Device Added to Vehicle Successfully");
      updateAssignedTable();
      updateUnassignedTable();
      setLoading(false);
      handleModel();
    } catch (error) {
      toast.error(error.response.data?.message);
      setLoading(false);
    }
  };

  const initialValues = {
    deviceSelected: [],
    serialNumber: "",
    deviceTypeId: 1,
  };

  const getFormData = (values) => {
    //assign value of chosen to input
    setSerialNumberInput(values.deviceSelected[0]?.label);
    setChosenType(values.deviceSelected[0]?.typeID);
  };
  const { t } = useTranslation("main");
  return (
    <div className="container-fluid">
      {loadingPage && (
        <h3 className="text-center pt-5 pb-5"> {t("loading...")} </h3>
      )}
      {allDeviceTypesOptions.length > 0 && (
        <Card>
          <Card.Body>
            <Formik
              initialValues={initialValues}
              validationSchema={vehicleAddDevice}
              onSubmit={onSubmit}
            >
              {(formik) => {
                setTimeout(() => getFormData(formik.values), 0);
                return (
                  <Form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col className="mx-auto" md={5}>
                        <Row>
                          <h4 className="mb-3">{t("Select exist Device")} </h4>
                          <ReactSelect
                            options={unAssignedDevicesOptions}
                            label={t("Select a Device")}
                            placeholder={t("Select a Device")}
                            name="deviceSelected"
                            className={"col-12 mb-3"}
                            isSearchable={true}
                            isObject={true}
                          />

                          <Input
                            placeholder={t("Serial Number")}
                            label={t("Serial Number")}
                            name="serialNumber"
                            type="text"
                            className={"col-12 mb-3"}
                            disabled={true}
                            onFocus={(event) => event.target.select()}
                            value={
                              serialNumberInput &&
                              (formik.values.serialNumber = serialNumberInput)
                            }
                          />

                          <ReactSelect
                            options={allDeviceTypesOptions}
                            label={t("Device Type")}
                            placeholder={t("Select Device Type")}
                            name="deviceTypeId"
                            className={"col-12 mb-3"}
                            isSearchable={true}
                            isDisabled={true}
                            value={
                              chosenType
                                ? allDeviceTypesOptions.find(
                                    (option) => option.value === chosenType
                                  )
                                : allDeviceTypesOptions.find(
                                    (option) =>
                                      option.value ===
                                      formik.values.deviceTypeId
                                  )
                            }
                          />
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="mx-auto" md={5}>
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
                            {t("Assign")}
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
                            {t("  Cancel")}
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

export default AddDeviceToVeh;
