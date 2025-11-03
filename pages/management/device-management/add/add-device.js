import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import { toast } from "react-toastify";
// import { useTranslation } from "next-i18next";
import { Formik } from "formik";
import Input from "components/formik/Input";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import { fetchDeviceTypes } from "services/management/DeviceManagement";
import { AddDeviceValidation } from "helpers/yup-validations/management/DeviceManagement";
import { addDevice } from "lib/slices/addNewDevice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";

const AddDevice = () => {
  const { t } = useTranslation(["Management", "main"]);
  const router = useRouter();
  const [loadingPage, setLoadingPage] = useState(true);
  const [allDeviceTypesOptions, setAllDeviceTypesOptions] = useState([]);
  const dispatch = useDispatch();
  const { device } = useSelector((state) => state.addNewDevice);

  useEffect(() => {
    (async () => {
      setLoadingPage(true);
      try {
        const respond = await fetchDeviceTypes();
        setAllDeviceTypesOptions(
          respond?.allDeviceTypes?.map((ele) => {
            return { value: ele.ID, label: ele.DeviceType };
          })
        );
      } catch (error) {
        toast.error(error.response.data?.message);
      }
      setLoadingPage(false);
    })();
  }, []);

  // options for sim provider for react select
  const statusOptions = [
    { value: 0, label: t("Used") },
    { value: 1, label: t("Ready to Use") },
    { value: 2, label: t("Returned") },
    { value: 3, label: t("Deffected") },
  ];

  const onSubmit = async (data) => {
    dispatch(addDevice(data));
    router.push("/management/device-management/add/add-sim");
  };

  const initialValues = {
    SerialNumber: device.SerialNumber ? device.SerialNumber : "",
    DeviceTypeID: device.DeviceTypeID ? device.DeviceTypeID : 1,
    Status: device.Status ? device.Status : 0,
  };

  return (
    <div className="container-fluid">
      {loadingPage && (
        <h3 className="text-center pt-5 pb-5">{t("main:loading...")}</h3>
      )}
      {allDeviceTypesOptions.length > 0 && (
        <Card>
          <Card.Body>
            <Formik
              initialValues={initialValues}
              // validationSchema={AddDeviceValidation}
              onSubmit={onSubmit}
            >
              {(formik) => {
                return (
                  <Form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col className="mx-auto" md={6}>
                        <Row>
                          <h4 className="mb-3">{t("Add a new Device")}</h4>
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
                            label={t("Status")}
                            placeholder={t("Select Status")}
                            name="Status"
                            className={"col-12 mb-3"}
                            isSearchable={true}
                          />
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="mx-auto" md={6}>
                        <div className="w-25 d-flex flex-wrap flex-md-nowrap">
                          <Button
                            type="submit"
                            className="px-3 py-2 text-nowrap me-3 mb-2 mb-md-0"
                          >
                            <FontAwesomeIcon
                              className="mx-2"
                              icon={faArrowRight}
                              size="sm"
                            />
                            {t("Next")}
                          </Button>
                          <Button
                            className="px-3 py-2 text-nowrap me-3 ms-0"
                            onClick={() => {
                              router.push("/management/device-management");
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

export default AddDevice;

// translation ##################################
export async function getServerSideProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        "main",
        "management",
        "Management",
      ])),
    },
  };
}
// translation ##################################
