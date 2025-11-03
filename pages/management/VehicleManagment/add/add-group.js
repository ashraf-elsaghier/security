import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faTimes,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import { toast } from "react-toastify";
// import { useTranslation } from "next-i18next";
import { Formik } from "formik";
import Input from "components/formik/Input";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import { vehicleAddGroup } from "helpers/yup-validations/management/VehicleManagement";
import {
  fetchVehicleGroups,
  addVehicleRequst,
  addDeviceRequst,
  addSimRequst,
} from "services/management/VehicleManagement";
import Textarea from "components/formik/Textarea";
import Model from "components/UI/Model";
import { resetData } from "lib/slices/addNewVehicle";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";

const AddVehToGroup = () => {
  const router = useRouter();
  const [loadingPage, setLoadingPage] = useState(true);
  const [groupsOptions, setGroupsOptions] = useState([]);
  const [respond, setRespond] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const dispatch = useDispatch();
  const { vehicle, device, sim } = useSelector((state) => state.addNewVehicle);
  const [loading, setLoading] = useState(false);

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

  const { t } = useTranslation(["main", "Management"]);

  // fecth all selections data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const respond = await fetchVehicleGroups();
        const groups = respond.result.map((ele) => {
          return {
            value: ele.ID,
            label: ele.Name,
          };
        });
        setGroupsOptions([{ value: "", label: t("No Group") }, ...groups]);
        setRespond(respond.result);
        setLoadingPage(false);
      } catch (error) {
        toast.error(error.response.data?.message);
        setLoadingPage(false);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    const submitVehicle = {
      ...data,
      ...vehicle,
    };

    setLoading(true);
    try {
      const vehicleRequst = await addVehicleRequst(submitVehicle);
      // check if device has data to assagin it to this vehicle
      toast.success("Vehicle Added Successfully");
      if (Object.keys(device).length > 0) {
        try {
          const deviceRequst = await addDeviceRequst({
            ...device,
            vehicleId: vehicleRequst.vehicleId,
          });
          try {
            const simRequst = await addSimRequst({
              ...sim,
              deviceId: deviceRequst.DeviceId,
            });
            toast.success("Device Added to Vehicle Successfully");
          } catch (error) {
            toast.error(error.response.data?.message);
            setLoading(false);
          }
        } catch (error) {
          toast.error(error.response.data?.message);
          setLoading(false);
        }
      }
      router.push("/management/VehicleManagment");
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data?.message);
      setLoading(false);
    }
  };

  const initialValues = {
    GroupID: "",
    MaxParkingTime: 0,
    MaxIdlingTime: 0,
    Remarks: "",
  };

  return (
    <div className="container-fluid">
      {loadingPage && (
        <h3 className="text-center pt-5 pb-5">{t("loading...")}</h3>
      )}
      {!loadingPage && (
        <Card>
          <Card.Body>
            <Formik
              initialValues={initialValues}
              validationSchema={vehicleAddGroup}
              onSubmit={onSubmit}
            >
              {(formik) => {
                return (
                  <Form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col className="mx-auto" md={6}>
                        <Row>
                          <h4 className="mb-3">
                            {" "}
                            {t("Add Group Information")}{" "}
                          </h4>
                          <ReactSelect
                            options={groupsOptions}
                            label={t("Select a Group Name")}
                            placeholder={t("Select a Group Name")}
                            name="GroupID"
                            className={"col-12 mb-3"}
                            isSearchable={true}
                          />

                          <Input
                            placeholder={t("Max Parking Time")}
                            label={t("Max Parking Time")}
                            name="MaxParkingTime"
                            type="number"
                            className={"col-6 mb-3"}
                            min={0}
                            onFocus={(event) => event.target.select()}
                          />

                          <Input
                            placeholder={t("Maximum Idling Time")}
                            label={t("Maximum Idling Time")}
                            name="MaxIdlingTime"
                            type="number"
                            className={"col-6 mb-3"}
                            min={0}
                            onFocus={(event) => event.target.select()}
                          />

                          <Textarea
                            label={t("Remarks")}
                            placeholder={t("Add Remarks")}
                            name="Remarks"
                            className={"col-12 mb-3"}
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
                              router.back();
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
                            disabled={loading}
                          >
                            {!loading ? (
                              <FontAwesomeIcon
                                className="mx-2"
                                icon={faArrowRight}
                                size="sm"
                              />
                            ) : (
                              <FontAwesomeIcon
                                className="mx-2 fa-spin"
                                icon={faSpinner}
                                size="sm"
                              />
                            )}
                            {t("Management:Finish")}
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

export default AddVehToGroup;

// translation ##################################
export async function getServerSideProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["main", "Management"])),
    },
  };
}
// translation ##################################
