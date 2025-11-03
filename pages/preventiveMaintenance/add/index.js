import React, { useMemo } from "react";
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { Button, Card, Row } from "react-bootstrap";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { toast } from "react-toastify";
import { useEffect, useCallback, useState } from "react";
import { encryptName } from "helpers/encryptions";
import { Formik, Form } from "formik";
import { addPreventiveMaintenanceValidation } from "helpers/yupValidations";
import Input from "components/formik/Input";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import Checkbox from "components/formik/Checkbox";
import {
  confirmPreventive,
  addNewPreventive,
  replacePreventive,
} from "services/preventiveMaintenance";
import Model from "components/UI/Model";
import { useTranslation } from "next-i18next";
import axios from "axios";
import SelectVehicles from "components/formik/ReactSelect/SelectVehicles";
import { useVehicleContext } from "context/VehiclesContext";

const FormikAdd = () => {
  const { t } = useTranslation("preventiveMaintenance");
  const router = useRouter();
  const [newMentainceType, setNewMentainceType] = useState("");
  const [selectedVehiclesData, setSelectedVehiclesData] = useState([]);
  const [periodType, setPeriodType] = useState("");
  const [fixedDateCase, setFixedDateCase] = useState(false);
  const [notifyType, setNotifyType] = useState("");
  const [valueNotifyType, setValueNotifyType] = useState(false);
  const [maintenanceDueValue, setMaintenanceDueValue] = useState("");
  const [startValue, setStartValue] = useState([]);
  const [nextValue, setNextValue] = useState("");
  const [whenValue, setWhenValue] = useState("");
  const [percentageValue, setPercentageValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [valueNotifyPeriodError, setValueNotifyPeriodError] = useState(false);
  const [MaintenanceType, setMaintenanceType] = useState("");
  const [loading, setloading] = useState(false);
  const [submitedData, setSubmitedData] = useState(false);
  const [replaceClicked, setReplaceClicked] = useState(false);
  const [vehChecked, setVehChecked] = useState([]);
  const { getVehicleBySerialNumber } = useVehicleContext();

  const [ModalofMaintaince, setModalofMaintaince] = useState(false);
  const optionsNotifyPeriod = useMemo(
    () => [
      {
        value: "1",
        label: t("percentage_key"),
      },
      {
        value: "2",
        label: t("value_key"),
      },
    ],
    [t]
  );

  const [optionsPeriodType, setOptionsPeriodType] = useState([]);
  const [optionsMaintenanceType, setOptionsMaintenanceType] = useState([]);
  const fetchPeriodTypes = async () => {
    try {
      const response = await axios.get(
        "dashboard/management/maintenance/types"
      );
      const periodOptions = response.data.map((ele) => ({
        value: ele["ID"],
        label: t(ele["Name"]),
      }));
      function moveObjectToEnd(array, desiredId) {
        let desiredObject = null;
        let desiredObjectIndex = -1;

        // Find the desired object and its index
        for (let i = 0; i < array.length; i++) {
          if (array[i].value === desiredId) {
            desiredObject = array[i];
            desiredObjectIndex = i;
            break;
          }
        }

        // If the desired object was found, move it to the end
        if (desiredObject) {
          array.splice(desiredObjectIndex, 1); // Remove the object from its current position
          array.push(desiredObject); // Append the object at the end
        }

        return array;
      }
      const desiredId = 8;

      const result = moveObjectToEnd(periodOptions, desiredId);
      // setOptionsPeriodType(periodOptions);
      setOptionsMaintenanceType(periodOptions);
    } catch (error) {
      toast.error("cannot fetch period types right now!");
    }
  };

  const fetchMaintenanceTypes = async () => {
    try {
      const response = await axios.get(
        "dashboard/management/maintenance/periods"
      );
      const maintenanceOptions = response.data.map((ele) => ({
        value: ele["ID"],
        label: t(ele["Name"]),
      }));
      // setOptionsMaintenanceType(maintenanceOptions);
      setOptionsPeriodType(maintenanceOptions);
    } catch (error) {
      toast.error("cannot fetch Maintenance types right now!");
    }
  };

  useEffect(() => {
    fetchPeriodTypes();
    fetchMaintenanceTypes();
  }, []);

  // minimum date used in date inputs
  const minDate = new Date().toISOString().slice(0, 10);
  // helper func to make Mileage and working hours logic
  const periodTypeFunc = useCallback(
    (vehiclesData, vehiclesDataType, type) => {
      if (type === "Mileage") {
        setStartValue(
          vehiclesData?.length === 1 && vehiclesData[0]?.Mileage
            ? [vehiclesData[0].Mileage / 1000]
            : vehiclesData?.length > 1
            ? vehiclesDataType
            : 0
        );

        setNextValue(
          vehiclesData?.length === 1 && vehiclesData[0]?.Mileage
            ? [vehiclesData[0].Mileage / 1000 + +maintenanceDueValue]
            : vehiclesData?.length > 1
            ? vehiclesDataType.map((vehicle) => vehicle + +maintenanceDueValue)
            : [+maintenanceDueValue]
        );
      } else {
        setStartValue(
          vehiclesData?.length === 1
            ? [vehiclesData[0].WorkingHours]
            : vehiclesData?.length > 1
            ? vehiclesDataType
            : 0
        );
        setNextValue(
          vehiclesData?.length === 1
            ? [vehiclesData[0].WorkingHours + +maintenanceDueValue]
            : vehiclesData?.length > 1
            ? vehiclesDataType.map((vehicle) => vehicle + +maintenanceDueValue)
            : 0
        );
      }

      if (notifyType === "1") {
        setValueNotifyType(false);
        setWhenValue(
          vehiclesData?.length === 1
            ? [
                vehiclesDataType[0] / 1000 +
                  +maintenanceDueValue * (+percentageValue / 100),
              ]
            : vehiclesData?.length > 1
            ? vehiclesDataType.map(
                (vehicle) =>
                  vehicle + +maintenanceDueValue * (+percentageValue / 100)
              )
            : 0
        );
        // delete Value Notify Period Error if Percentage selected
        setValueNotifyPeriodError(false);
      } else if (notifyType === "2") {
        setValueNotifyType(true);
      }
      setFixedDateCase(false);
    },
    [notifyType, percentageValue, maintenanceDueValue]
  );
  useEffect(() => {
    const vehicles = vehChecked.map((v) => {
      const lastRecord = getVehicleBySerialNumber(v.SerialNumber);
      return lastRecord ? { ...v, ...lastRecord } : v;
    });
    setSelectedVehiclesData(vehicles);
  }, [vehChecked]);
  // fetch all vehicles data form local storage
  useEffect(() => {
    const vehiclesMileage = selectedVehiclesData?.map(
      (vehicle) => vehicle.Mileage
    );
    const vehiclesHours = selectedVehiclesData?.map(
      (vehicle) => vehicle.WorkingHours
    );
    // conditions of period Type equal to Mileage
    if (periodType === 1) {
      periodTypeFunc(selectedVehiclesData, vehiclesMileage, "Mileage");
      // conditions of period Type equal to WorkingHours
    } else if (periodType === 2) {
      periodTypeFunc(selectedVehiclesData, vehiclesHours, "WorkingHours");
      // conditions of period Type equal to Fixed DAte
    } else if (periodType === 3) {
      setFixedDateCase(true);
      const today = new Date().toISOString().slice(0, 10);
      setStartValue(today);
      setNextValue(maintenanceDueValue);
    }
  }, [
    selectedVehiclesData,
    periodType,
    periodTypeFunc,
    maintenanceDueValue,
    vehChecked?.length,
  ]);

  // helper function to make add request
  const postData = useCallback(
    async (data) => {
      try {
        const postData = await addNewPreventive(data);
        toast.success(postData.result);
        router.push("/preventiveMaintenance");
        setloading(false);
        setReplaceClicked(false);
      } catch (error) {
        toast.error(error.response.data?.message);
        setloading(false);
        setShowModal(false);
        setReplaceClicked(false);
      }
    },
    [router]
  );
  const replaceData = useCallback(
    async (data) => {
      try {
        const plans = data.plans;
        delete data.plans;
        const dataToReplace = { data: data, plans: plans };

        const postData = await replacePreventive(dataToReplace);
        toast.success(postData.result);
        router.push("/preventiveMaintenance");
        setloading(false);
        setReplaceClicked(false);
      } catch (error) {
        toast.error(error.response.data?.message);
        setloading(false);
        setShowModal(false);
        setReplaceClicked(false);
      }
    },
    [router]
  );

  // initial Values needed for formik
  const initialValues = {
    MaintenanceType: 1,
    PeriodType: 1,
    StartValue: 0,
    MaintenanceDueValue: "",
    NextValue: 0,
    NotifyByEmail: "",
    Recurring: [],
    NotifyByPush: [],
    NotifMessage: "",
    WhenPeriod: "1",
    PercentageValue: "",
    WhenValue: "",
    MaintenanceCost: null,
  };
  async function setNewOptionsMaintenanceType() {
    setloading(true);
    axios
      .post("dashboard/management/maintenance/types", {
        name: newMentainceType,
      })
      .then((res) => {
        toast.success("Maintenance Type Added Successfully");
        setModalofMaintaince(false);
        fetchPeriodTypes();
        setloading(false);
      })
      .catch((err) => {
        toast.error("cannot fetch Maintenance types right now!");
      });
  }
  // control input values on formik
  const getFormData = (values) => {
    setPeriodType(values.PeriodType);
    setNotifyType(values.WhenPeriod);
    setMaintenanceDueValue(values.MaintenanceDueValue);
    setMaintenanceType(values.MaintenanceType);
    setPercentageValue(values.PercentageValue);
    if (values.PeriodType === 3) {
      setWhenValue(values.WhenValue);
    }
    if (notifyType === "2") {
      setWhenValue(values.WhenValue);
    }
  };

  useEffect(() => {
    if (MaintenanceType == 8) {
      setModalofMaintaince(true);
    }
  }, [MaintenanceType]);
  // submit form
  const onSubmit = async (data) => {
    const StartValue =
      startValue?.length > 1 && typeof startValue !== "string"
        ? [...startValue]
        : startValue;
    const NextValue =
      nextValue?.length > 1 && typeof nextValue !== "string"
        ? [...nextValue]
        : nextValue;
    const WhenValue =
      whenValue?.length > 1 && typeof whenValue !== "string"
        ? [...whenValue]
        : whenValue;

    const Vehicles = vehChecked?.map((veh, index) => {
      return {
        vehicleId: veh.VehicleID,
        StartValue: periodType === 3 ? StartValue : StartValue[index],
        NextValue: periodType === 3 ? NextValue : NextValue[index],
        WhenValue: typeof whenValue === "object" ? whenValue[index] : whenValue,
        // periodType === 3
        //   ? WhenValue
        //   : notifyType === "3"
        //     ? WhenValue
        //     : WhenValue[index],
      };
    });

    const submitedData = {
      MaintenanceDueValue: data.MaintenanceDueValue,
      NotifMessage: data.NotifMessage,
      NotifyByEmail: data.NotifyByEmail,
      PercentageValue: data.PercentageValue,
      Vehicles,
      Recurring: data.Recurring.length === 1 ? 1 : 0,
      NotifyByPush: data.NotifyByPush.length === 1 ? 1 : 0,
      MaintenanceType:
        data.MaintenanceType === 8 ? MaintenanceType : data.MaintenanceType,
      PeriodType: data.PeriodType,
      NotifyPeriod: data.WhenPeriod,
      WhenPeriod: data.WhenPeriod,
      NotifyBySMS: null,
      IsNotified: null,
      MaintenanceCost: data.MaintenanceCost,
    };
    setSubmitedData(submitedData);

    // validation when select more than one vehicle and select value option in period type
    if (vehChecked.length > 1 && notifyType === "2" && periodType !== 3) {
      setValueNotifyPeriodError(true);
      return;
    }
    setValueNotifyPeriodError(false);

    setloading(true);
    try {
      const dataToCheck = {
        maintenanceType:
          data.MaintenanceType === 8 ? MaintenanceType : data.MaintenanceType,
        vehicles: vehChecked.map((v) => v.VehicleID),
      };
      const confirmData = await confirmPreventive(dataToCheck);
      if (confirmData.result.length) {
        submitedData.plans = confirmData.result;
        setShowModal(true);
      } else {
        await postData(submitedData);
      }
    } catch (error) {
      toast.error(error.response.data?.message);
      setloading(false);
    }
  };

  return (
    <>
      <Card>
        <Card.Header className="h3">
          {t("add_maintenance_plan_key")}
        </Card.Header>
        <Card.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={addPreventiveMaintenanceValidation(
              fixedDateCase,
              minDate,
              startValue,
              nextValue,
              vehChecked,
              t
            )}
            onSubmit={onSubmit}
          >
            {(formik) => {
              setTimeout(() => getFormData(formik.values), 0);
              return (
                <Form>
                  <Row>
                    <SelectVehicles
                      vehChecked={vehChecked}
                      setVehChecked={setVehChecked}
                      error={formik?.errors?.selectedVehicles}
                    />

                    <ReactSelect
                      options={optionsMaintenanceType}
                      label={t("maintenance_type_key")}
                      name="MaintenanceType"
                      placeholder={"Select Maintenance Type"}
                      className={"col-12 col-md-6 col-lg-4 mb-3"}
                      isSearchable={true}
                    />

                    <ReactSelect
                      options={optionsPeriodType}
                      label={t("period_type_key")}
                      name="PeriodType"
                      placeholder={t("period_type_key")}
                      className={"col-12 col-md-6 col-lg-4 mb-3"}
                      isSearchable={true}
                    />

                    <Input
                      label={t("Maintenance Cost")}
                      placeholder={t("Maintenance Cost")}
                      name="MaintenanceCost"
                      type="number"
                      className={"col-12 col-md-6 col-lg-4 mb-3"}
                    />

                    {!(selectedVehiclesData?.length > 1) && !fixedDateCase && (
                      <Input
                        label={t("start_value_key")}
                        placeholder={t("start_value_key")}
                        name="StartValue"
                        type="number"
                        className={"col-12 col-md-6 col-lg-4 mb-3"}
                        disabled={true}
                        value={(formik.values.StartValue = startValue)}
                      />
                    )}
                    <Input
                      label={t("maintenance_due_value_key")}
                      placeholder={t("maintenance_due_value_key")}
                      name="MaintenanceDueValue"
                      type={fixedDateCase ? "date" : "number"}
                      className={"col-12 col-md-6 col-lg-4 mb-3"}
                      min={fixedDateCase ? minDate : 0}
                      onFocus={(event) => event.target.select()}
                    />
                    {!(selectedVehiclesData?.length > 1) && !fixedDateCase && (
                      <Input
                        label={t("next_value_key")}
                        placeholder={t("next_value_key")}
                        name="NextValue"
                        type="number"
                        className={"col-12 col-md-6 col-lg-4 mb-3"}
                        disabled={true}
                        value={(formik.values.NextValue = nextValue)}
                      />
                    )}

                    <Input
                      label={t("email_address_key")}
                      placeholder={t("email_address_key")}
                      type="email"
                      name="NotifyByEmail"
                      className={"col-12 col-md-6 col-lg-4 mb-2"}
                    />

                    <Row className="d-flex  justify-content-start my-2">
                      <Checkbox
                        name="Recurring"
                        option={[
                          {
                            value: "1",
                            key: `${t("recurring_key")}`,
                          },
                        ]}
                        className={"col-6 col-lg-3"}
                        disabled={fixedDateCase ? true : false}
                      />
                      <Checkbox
                        className="col-6 col-lg-3"
                        name="NotifyByPush"
                        option={[
                          {
                            value: "true",
                            key: `${t("notify_by_push_key")}`,
                          },
                        ]}
                      />
                    </Row>

                    <Row>
                      <Input
                        type="text"
                        name="NotifMessage"
                        label={t("notify_message_key")}
                        placeholder={t("notify_message_key")}
                        className={"col-12 col-md-6 col-lg-4 mb-3"}
                      />
                    </Row>
                    {!fixedDateCase && (
                      <ReactSelect
                        label={`${t("notify_period_key")}`}
                        placeholder={`${t("notify_period_key")}`}
                        className={`col-12 col-md-6 col-lg-4 ${
                          valueNotifyPeriodError ? "" : "mb-3"
                        } `}
                        options={
                          selectedVehiclesData?.length > 1
                            ? [optionsNotifyPeriod[0]]
                            : optionsNotifyPeriod
                        }
                        name="WhenPeriod"
                        isDisabled={fixedDateCase ? true : false}
                        isSearchable={true}
                      />
                    )}
                    {valueNotifyPeriodError && (
                      <span
                        className="mb-3"
                        style={{ color: "red", fontSize: "12px" }}
                      >
                        Please select percentage
                      </span>
                    )}

                    {!valueNotifyType && !fixedDateCase && (
                      <Input
                        type="number"
                        name="PercentageValue"
                        label={t("percentage_value_key")}
                        placeholder={t("percentage_value_key")}
                        className={"col-12 col-md-6 col-lg-4 mb-3"}
                      />
                    )}

                    {!(selectedVehiclesData?.length > 1) || fixedDateCase ? (
                      <Input
                        type={fixedDateCase ? "date" : "number"}
                        name="WhenValue"
                        label={t("notify_when_value_key")}
                        placeholder={t("notify_when_value_key")}
                        className={"col-12 col-md-6 col-lg-4 mb-3"}
                        disabled={
                          valueNotifyType || fixedDateCase ? false : true
                        }
                        value={
                          !fixedDateCase &&
                          !valueNotifyType &&
                          (formik.values.WhenValue = whenValue)
                        }
                        min={fixedDateCase ? minDate : 0}
                      />
                    ) : null}
                  </Row>
                  <div className="w-25 d-flex flex-wrap flex-md-nowrap">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="px-3 py-2 text-nowrap me-3 ms-0  mb-2 mb-md-0"
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
                      {t("save_key")}
                    </Button>
                    <Button
                      className="px-3 py-2 text-nowrap me-3 ms-0 "
                      onClick={(e) => {
                        e.preventDefault();
                        router.push("/preventiveMaintenance");
                      }}
                    >
                      <FontAwesomeIcon
                        className="mx-2"
                        icon={faTimes}
                        size="sm"
                      />
                      {t("cancel_key")}
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
          {/* confirm Model if preventive repeated */}
          <Model
            header={t("add_maintenance_type_warning_key")}
            show={ModalofMaintaince}
            onHide={() => {
              setModalofMaintaince(false);
              setloading(false);
            }}
            onUpdate={async () => {
              setNewOptionsMaintenanceType();
            }}
            updateButton={t("replace_key")}
            disabled={replaceClicked ? true : false}
          >
            <h4 className="mb-2 fs-14" style={{ fontSize: "18px" }}>
              {t("add_maintenance_type_warning_key")}
            </h4>
            <input
              className={`border-primary form-control`}
              onChange={(e) => {
                setNewMentainceType(e.target.value);
              }}
            />
          </Model>
          <Model
            header={t("add_maintenance_plan_warning_key")}
            show={showModal}
            onHide={() => {
              setShowModal(false);
              setloading(false);
            }}
            onUpdate={async () => {
              await replaceData(submitedData);
              setReplaceClicked(true);
            }}
            updateButton={t("replace_key")}
            disabled={replaceClicked ? true : false}
          >
            <h5 className="text-center">
              {t(
                "there_are_already_plans_with_the_same_type_created_for_some_of_the_vehicles_you_have_selected_key"
              )}
              .
            </h5>
          </Model>
        </Card.Body>
      </Card>
    </>
  );
};

export default FormikAdd;

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "preventiveMaintenance",
        "main",
        "reports",
      ])),
    },
  };
}
// translation ##################################
