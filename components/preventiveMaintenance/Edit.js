import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { Button, Card, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useEffect, useCallback, useState, useMemo } from "react";
import { Formik, Form } from "formik";
import {
  fitchPreventiveForEdit,
  updatePreventive,
} from "services/preventiveMaintenance/index";
import Input from "components/formik/Input";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import Checkbox from "components/formik/Checkbox";
import { editPreventiveMaintenanceValidation } from "helpers/yupValidations";
import { useTranslation } from "next-i18next";
import Spinner from "components/UI/Spinner";
import moment from "moment";

const Edit = ({
  id,
  model,
  modelButtonMsg,
  onModelButtonClicked,
  icon,
  className,
  handleModel,
  updateTable,
  optionsMaintenanceType,
}) => {
  const router = useRouter();
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [periodType, setPeriodType] = useState("");
  const [fixedDateCase, setFixedDateCase] = useState(false);
  const [notifyType, setNotifyType] = useState("");
  const [valueNotifyType, setValueNotifyType] = useState(false);
  const [loading, setloading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [Data, setData] = useState({});
  const [percentageValue, setPercentageValue] = useState("");
  const [maintenanceDueValue, setMaintenanceDueValue] = useState("");
  const [whenValue, setWhenValue] = useState("");
  const [startValue, setStartValue] = useState("");
  const [nextValue, setNextValue] = useState("");
  const { t } = useTranslation("preventiveMaintenance");
  // data for select boxes
  const optionsPeriodType = useMemo(
    () => [
      {
        value: 1,
        label: t("by_mileage_key"),
      },
      {
        value: 3,
        label: t("by_fixed_date_key"),
      },
      {
        value: 2,
        label: t("by_working_hours_key"),
      },
    ],
    [t]
  );
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
  // fetch maintenance data
  useEffect(() => {
    if (!id) {
      router.back();
    } else {
      const fetchData = async () => {
        try {
          setLoadingPage(true);
          const respond = await fitchPreventiveForEdit(id);
          setLoadingPage(false);
          setFixedDateCase(
            respond?.maintenancePlan[0].PeriodType === 3 ? true : false
          );
          setData(respond?.maintenancePlan[0]);
          setSelectedVehicles(respond?.maintenancePlan);
          setPeriodType(respond?.maintenancePlan[0].PeriodType);
        } catch (error) {
          toast.error(error?.response?.data?.message);
          setLoadingPage(false);
        }
      };
      fetchData();
    }
  }, [id]);

  // minimum date used in date inputs
  const minDate = new Date().toISOString().slice(0, 10);

  // helper func to make Mileage and working hours logic
  const periodTypeFunc = useCallback(
    (vehiclesData) => {
      setStartValue(
        vehiclesData?.length === 1 ? vehiclesData[0]?.StartValue : 0
      );
      setNextValue(
        vehiclesData?.length === 1
          ? +vehiclesData[0]?.StartValue + +maintenanceDueValue
          : 0
      );

      if (notifyType == "1") {
        setValueNotifyType(false);
        setWhenValue(
          vehiclesData?.length === 1
            ? (+vehiclesData[0]?.StartValue +
              +maintenanceDueValue * (+percentageValue / 100)).toFixed(3)
            : 0
        );
      } else if (notifyType == "2") {
        setValueNotifyType(true);
      }
    },
    [notifyType, percentageValue, maintenanceDueValue]
  );

  // set values of inputs
  useEffect(() => {
    if (Object?.keys(Data)?.length > 1) {
      // conditions of period Type equal to Mileage or WorkingHours
      if (periodType === 1 || periodType === 2) {
        periodTypeFunc(selectedVehicles);
        // conditions of period Type equal to fixed date
      } else if (periodType === 3) {
        const today = new Date().toISOString().slice(0, 10);
        setStartValue(today);
        setNextValue(maintenanceDueValue);
      }
    }
  }, [periodTypeFunc, Data, selectedVehicles, periodType, maintenanceDueValue]);
  const initialValues = {
    vehicleName: Data?.DisplayName,
    MaintenanceType: optionsMaintenanceType[Data.MaintenanceType],
    PeriodType: optionsPeriodType.filter(
      (option) => option.value === Data.PeriodType
    )[0]?.label,
    StartValue: Data.StartValue,
    MaintenanceDueValue: fixedDateCase
      ? moment(Data.NextValue, ["MM/DD/YYYY", "YYYY-MM-DD"]).format(
        "YYYY-MM-DD"
      )
      : Data.NextValue - Data.StartValue,
    NextValue: moment(Data.NextValue, ["MM/DD/YYYY", "YYYY-MM-DD"]).format(
      "YYYY-MM-DD"
    ),
    NotifyByEmail: Data.NotifyByEmail,
    Recurring: Data.Recurring ? ["1"] : [],
    NotifyByPush: Data.NotifyByPush ? ["true"] : [],
    NotifMessage: Data.NotifMessage,
    WhenPeriod: "1",
    PercentageValue: fixedDateCase
      ? 0
      : (Data.WhenValue !== Data.StartValue) ?
        +(((Data.WhenValue - Data.StartValue) * 100) /
          (Data.NextValue - Data.StartValue)).toFixed(3) : 100
    ,
    WhenValue: Data.WhenValue,
    MaintenanceCost: Data.MaintenanceCost,
  };

  const getFormData = (values) => {
    setNotifyType(values.WhenPeriod);
    if (values.WhenValue !== values.StartValue) {
      const oldPercentage =
        ((Data.WhenValue - Data.StartValue) * 100) /
        (Data.NextValue - Data.StartValue)
      // to set PercentageValue when notifyType = 1 || 2
      setPercentageValue(oldPercentage == values.PercentageValue ? oldPercentage : values.PercentageValue)
    } else {
      setPercentageValue(values.PercentageValue)
    }

    setMaintenanceDueValue(values.MaintenanceDueValue);
  };
  const onSubmit = async (data) => {
    const MaintenanceType = Object.keys(optionsMaintenanceType).filter(
      (k) => optionsMaintenanceType[k] === data.MaintenanceType
    )[0];

    const PeriodType = optionsPeriodType?.filter(
      (type) => type.label === data.PeriodType
    )[0]?.value;
    const submitedData = {
      ...data,
      Recurring: data.Recurring.length === 1 ? 1 : 0,
      NotifyByPush: data.NotifyByPush.length === 1 ? 1 : 0,
      MaintenanceType,
      PeriodType,
      NextValue: fixedDateCase
        ? `${data.MaintenanceDueValue}`
        : `${data.NextValue}`,
      StartValue: `${data.StartValue}`,
      WhenValue: `${data.WhenValue}`,
      MaintenanceDueValue: `${data.MaintenanceDueValue}`,
      VehicleID: Data.VehicleID,
      WhenPeriod: +notifyType,
      NotifyBySMS: null,
      IsNotified: null,

    };

    setloading(true);
    try {
      const respond = await updatePreventive(id, submitedData);
      toast.success(respond.result);
      router.push("/preventiveMaintenance");
      setloading(false);
      if (model) {
        handleModel();
        updateTable();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setloading(false);
    }
  };

  return (
    <>
      {loadingPage && <Spinner />}
      {Object.keys(Data)?.length > 1 && (
        <Card className="mb-1">
          {!model && (
            <Card.Header className="h3">
              {t("update_maintenance_plan_key")}
            </Card.Header>
          )}
          <Card.Body className={`${className}`}>
            <Formik
              initialValues={initialValues}
              validationSchema={editPreventiveMaintenanceValidation(
                fixedDateCase,
                minDate,
                startValue,
                nextValue,
                t
              )}
              onSubmit={onSubmit}
            >
              {(formik) => {
                setTimeout(() => getFormData(formik.values), 0);
                return (
                  <Form>
                    <Row>
                      <Input
                        label={t("select_vehicles_key")}
                        placeholder={t("select_vehicles_key")}
                        name="vehicleName"
                        type="text"
                        className={"col-12 col-md-6 col-lg-4 mb-3"}
                        disabled={true}
                      />

                      <Input
                        label={t("maintenance_type_key")}
                        placeholder={t("maintenance_type_key")}
                        name="MaintenanceType"
                        type="text"
                        className={"col-12 col-md-6 col-lg-4 mb-3"}
                        disabled={true}
                      />

                      <Input
                        label={t("period_type_key")}
                        placeholder={t("period_type_key")}
                        name="PeriodType"
                        type="text"
                        className={"col-12 col-md-6 col-lg-4 mb-3"}
                        disabled={true}
                      />

                      <Input
                        label={t("Maintenance Cost")}
                        placeholder={t("Maintenance Cost")}
                        name="MaintenanceCost"
                        type="number"
                        className={"col-12 col-md-6 col-lg-4 mb-3"}
                        disabled={true}
                      />

                      {!(selectedVehicles?.length > 1) && !fixedDateCase && (
                        <Input
                          label={t("start_value_key")}
                          placeholder={t("start_value_key")}
                          name="StartValue"
                          type="number"
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                          disabled={true}
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

                      {!(selectedVehicles?.length > 1) && !fixedDateCase && (
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
                        name="NotifyByEmail"
                        className={"col-12 col-md-6 col-lg-4 mb-2"}
                      />

                      <Row className="d-flex  justify-content-start ms-2 my-2">
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

                      <ReactSelect
                        label={t("notify_period_key")}
                        placeholder={t("notify_period_key")}
                        className={`col-12 col-md-6 col-lg-4 mb-3`}
                        options={optionsNotifyPeriod}
                        defaultValue={{
                          value: "1",
                          label: t("percentage_key"),
                        }}
                        name="WhenPeriod"
                        isDisabled={fixedDateCase ? true : false}
                        isSearchable={true}
                      />

                      {!valueNotifyType && !fixedDateCase && (
                        <Input
                          type="number"
                          name="PercentageValue"
                          label={t("percentage_value_key")}
                          placeholder={t("percentage_value_key")}
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                          onFocus={(event) => event.target.select()}
                        />
                      )}

                      {!(selectedVehicles?.length > 1) || fixedDateCase ? (
                        <Input
                          type={fixedDateCase ? "date" : "number"}
                          name="WhenValue"
                          label={t("notify_when_value_key")}
                          placeholder={t("notify_when_value_key")}
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                          disabled={
                            valueNotifyType || fixedDateCase ? false : true
                          }
                          min={fixedDateCase ? minDate : 0}
                          onFocus={(event) => event.target.select()}
                          value={
                            !fixedDateCase &&
                            !valueNotifyType &&
                            (formik.values.WhenValue = whenValue)
                          }
                        />
                      ) : null}
                    </Row>
                    <div className="w-25 d-flex flex-wrap flex-md-nowrap">
                      {model && (
                        <Button
                          className="px-3 py-2 text-nowrap me-3 ms-0  mb-md-0"
                          type="button"
                          onClick={onModelButtonClicked}
                        >
                          {modelButtonMsg || t("open_in_new_tab_key")}
                          {
                            <FontAwesomeIcon
                              className="mx-2"
                              icon={icon}
                              size="sm"
                            />
                          }
                        </Button>
                      )}
                      <Button
                        type="submit"
                        disabled={loading || selectedVehicles.length === 0}
                        className="px-3 py-2 text-nowrap me-3 ms-0  mb-md-0"
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
                        onClick={() => {
                          if (model) {
                            handleModel();
                          } else {
                            router.push("/preventiveMaintenance");
                          }
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
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default Edit;
