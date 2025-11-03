import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faTimes,
  faForward,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import { toast } from "react-toastify";
// import { useTranslation } from "next-i18next";
import { Formik } from "formik";
import Input from "components/formik/Input";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import { vehicleAddSim } from "helpers/yup-validations/management/VehicleManagement";
import { fetchAllUnAssignedSimCardData } from "services/management/VehicleManagement";
import Model from "components/UI/Model";
import { useDispatch, useSelector } from "react-redux";
import { addSim, resetData } from "lib/slices/addNewVehicle";
import { useTranslation } from "next-i18next";

const AddSimtoDevice = () => {
  const router = useRouter();
  const [loadingPage, setLoadingPage] = useState(true);
  const [unAssignedDevicesOptions, setUnAssignedSimCardsOptions] = useState([]);
  const [respond, setRespond] = useState([]);
  const [disableInputs, setDisableInputs] = useState(false);
  const [serialNumberInput, setSerialNumberInput] = useState("");
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [chosenType, setChosenType] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const dispatch = useDispatch();
  const vehicle = useSelector((state) => state.addNewVehicle.vehicle);
  const { t } = useTranslation(["main", "Management"]);
  // route away when use direct link
  // useEffect(() => {
  //   if (Object.keys(vehicle).length < 1) {
  //     router.push("/management/VehicleManagment/add/vehicle-data");
  //   }
  // }, [vehicle, router]);

  // prevent reload page
  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };
  useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, []);

  // reset sim data at first render
  useEffect(() => {
    dispatch(addSim({}));
  }, [dispatch]);

  // fetch all selections data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const respond = await fetchAllUnAssignedSimCardData();
        const unAssignedSimcards = respond.allSims.map((ele) => {
          return {
            value: ele.SimSerialNumber,
            label: ele.PhoneNumber,
            provID: ele.ProviderID,
          };
        });
        setUnAssignedSimCardsOptions([
          { value: "add", label: "Add New SIM Card", provID: "new" },
          ...unAssignedSimcards,
        ]);
        setRespond(respond.allSims);
        setLoadingPage(false);
      } catch (error) {
        toast.error(error.response.data?.message);
        setLoadingPage(false);
      }
    };
    fetchData();
  }, []);

  const simProviderOtions = [
    { value: 1, label: "Zain" },
    { value: 2, label: "Mobily" },
    { value: 3, label: "Stc" },
    { value: 4, label: "Libara" },
  ];

  const onSubmit = async (data) => {
    const submitData = {
      simSerialNumber: data.simSerialNumber,
      phoneNumber: data.phoneNumber,
      provider: chosenType ? chosenType : data.provider,
    };
    dispatch(addSim(submitData));
    router.push("/management/VehicleManagment/add/add-group");
  };

  const initialValues = {
    simSelected: [{ value: "add", label: "Add New Device", provID: "new" }],
    simSerialNumber: "",
    phoneNumber: "",
    provider: 1,
  };

  const getFormData = (values) => {
    //disable inputs when choose any Sim
    if (values.simSelected[0].value !== "add") {
      setDisableInputs(true);
      //assgin value of chosen to input
      setSerialNumberInput(values.simSelected[0]?.label);
      setPhoneNumberInput(values.simSelected[0]?.value);
      setChosenType(values.simSelected[0]?.provID);
    } else {
      setDisableInputs(false);
      setSerialNumberInput("");
      setPhoneNumberInput("");
      setChosenType("");
    }
  };

  return (
    <div className="container-fluid">
      {loadingPage ? (
        <h3 className="text-center pt-5 pb-5"> {t("loading...")} </h3>
      ) : (
        <Card>
          <Card.Body>
            <Formik
              initialValues={initialValues}
              validationSchema={vehicleAddSim}
              onSubmit={onSubmit}
            >
              {(formik) => {
                setTimeout(() => getFormData(formik.values), 0);
                return (
                  <Form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col className="mx-auto" md={6}>
                        <Row>
                          <h4 className="mb-3">
                            {t("Select exist SIM card")}{" "}
                          </h4>
                          <ReactSelect
                            options={unAssignedDevicesOptions}
                            label={t("Select a SIM card")}
                            placeholder={t("Select a SIM card")}
                            name="simSelected"
                            className={"col-12 mb-3"}
                            isSearchable={true}
                            isObject={true}
                          />

                          <h4 className="mb-3"> {t("Add a new SIM card")} </h4>
                          <Input
                            placeholder={t("Serial Number")}
                            label={t("Serial Number")}
                            name="simSerialNumber"
                            type="number"
                            className={"col-6 mb-3"}
                            disabled={disableInputs ? true : false}
                            onFocus={(event) => event.target.select()}
                            value={
                              serialNumberInput &&
                              (formik.values.simSerialNumber =
                                serialNumberInput)
                            }
                          />

                          <Input
                            placeholder={t("Phone Number")}
                            label={t("Phone Number")}
                            name="phoneNumber"
                            type="number"
                            className={"col-6 mb-3"}
                            disabled={disableInputs ? true : false}
                            onFocus={(event) => event.target.select()}
                            value={
                              phoneNumberInput &&
                              (formik.values.phoneNumber = phoneNumberInput)
                            }
                          />

                          <ReactSelect
                            options={simProviderOtions}
                            label={t("SIM Provider")}
                            placeholder="Select SIM Provider"
                            name="provider"
                            className={"col-12 mb-3"}
                            isSearchable={true}
                            isDisabled={disableInputs ? true : false}
                            value={
                              chosenType
                                ? simProviderOtions.find(
                                    (option) => option.value === chosenType
                                  )
                                : simProviderOtions.find(
                                    (option) =>
                                      option.value === formik.values.provider
                                  )
                            }
                          />
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="mx-auto" md={6}>
                        <div className="w-25 d-flex flex-wrap flex-md-nowrap">
                          <Button
                            className="px-3 py-2 text-nowrap me-3 ms-0"
                            onClick={() => {
                              router.push(
                                "/management/VehicleManagment/add/add-device"
                              );
                            }}
                          >
                            <FontAwesomeIcon
                              className="mx-2"
                              icon={faArrowLeft}
                              size="sm"
                            />
                            {t("Back")}
                          </Button>
                          <Button
                            type="submit"
                            className="px-3 py-2 text-nowrap me-3 mb-2 mb-md-0"
                            // onClick={() => {
                            //   router.push(
                            //     "/management/VehicleManagment/add/add-device"
                            //   );
                            // }}
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
                              router.push(
                                "/management/VehicleManagment/add/add-group"
                              );
                            }}
                          >
                            <FontAwesomeIcon
                              className="mx-2"
                              icon={faForward}
                              size="sm"
                            />
                            {t("Skip")}
                          </Button>

                          <Button
                            className="px-3 py-2 text-nowrap me-3 ms-0"
                            onClick={() => {
                              setModalShow(true);
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
            {modalShow && (
              <Model
                header={t("Cancel The Process")}
                show={modalShow}
                onHide={() => setModalShow(false)}
                updateButton={t("Yes, I'm Sure")}
                onUpdate={() => {
                  dispatch(resetData());
                  router.push("/management/VehicleManagment");
                }}
              >
                <h4 className="text-center">
                  {t("Are You Sure You Want to Cancel This Process?")}
                </h4>
                <p className="text-center text-danger">
                  {t(
                    "You will lose all your entered data if you cancel the process."
                  )}
                </p>
              </Model>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default AddSimtoDevice;

// translation ##################################
export async function getServerSideProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["main", "Management"])),
    },
  };
}
// translation ##################################
