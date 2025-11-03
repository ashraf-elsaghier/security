import React, { useState, useMemo, useEffect } from "react";
import Input from "components/formik/Input";
import RadioInput from "components/formik/RadioInput";
import { Formik, Form } from "formik";
import { Button, Row } from "react-bootstrap";
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "next-i18next";
import axios from "axios";
import { toast } from "react-toastify";
import { encryptName } from "helpers/encryptions";
import moment from "moment";
import InputFile from "components/formik/FileInput";
const Reset = ({ data, handleModel, setrowsSelected }) => {
  const {
    plateNumber,
    maintenanceType,
    periodType,
    startValue,
    nextValue,
    ID,
    VehicleID,
  } = data;
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("preventiveMaintenance");
  const [currentValue, setCurrentVAlue] = useState(startValue);
  const [isFixedDate, setISFixedDate] = useState(
    periodType === "By fixed Date"
  );

  const [toggleDate, setToggleDate] = useState(false);
  useEffect(() => {
    const { vehData } =
      JSON.parse(localStorage.getItem(encryptName("userData")) ?? "[]") || [];
    if (periodType === "By Mileage") {
      setCurrentVAlue(
        vehData?.filter((v) => v?.VehicleID === VehicleID)[0].Mileage / 1000 ||
          startValue
      );
    }
  }, [VehicleID]);

  const radioOptions = useMemo(() => {
    if (isFixedDate) {
      const fourMonths = moment().add(4, "months").format("YYYY-MM-DD");
      const sixMonths = moment().add(6, "months").format("YYYY-MM-DD");
      const oneYear = moment().add(1, "Years").format("YYYY-MM-DD");
      const twoYears = moment().add(2, "Years").format("YYYY-MM-DD");
      const dateOptions = [
        {
          key: `${t("Four months")}: ${fourMonths}`,
          value: fourMonths,
        },
        {
          key: `${t("six Months")} : ${sixMonths}`,
          value: sixMonths,
        },
        {
          key: `${t("One year")} : ${oneYear}`,
          value: oneYear,
        },
        {
          key: `${t("Two years")} : ${twoYears}`,
          value: twoYears,
        },
        { key: "Choose Custom Date", value: "test" },
      ];
      return dateOptions;
    }
    return [
      {
        key: `${t("current_value_key")}: ${currentValue}`,
        value: "current",
      },
      { key: `${t("original_value_key")}: ${nextValue}`, value: "next" },
    ];
  }, [t, nextValue, startValue, currentValue]);

  const initialValues = {
    ID: ID,
    PlateNumber: plateNumber,
    MaintenanceType: maintenanceType,
    PeriodType: periodType,
    selectedRadio: "",
    invoiceImage: null,
  };

  const getVehicleInfo = async (VehicleID) => {
    try {
      const response = await axios.get(`vehicles/utilization/${VehicleID}`);
      setCurrentVAlue(response?.data?.vehicle?.workingHours);
    } catch (error) {
      toast.error("No current value for this vehicle");
    }
  };

  useEffect(() => {
    if (periodType === "By Working Hours") getVehicleInfo(VehicleID);
  }, [VehicleID]);

  const resetPlan = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `dashboard/management/maintenance/reset/${ID}`,
        data
      );
      if (res.status === 200) {
        toast.success("Plan is reset successfully");
        handleModel();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("error.message");
    }
  };

  const onSubmit = ({ ID, selectedRadio, customDate, invoiceImage }) => {
    let date = null;
    if (toggleDate) date = customDate;

    if (ID && selectedRadio) {
      const formData = new FormData();

      formData.append(
        "resetValue",
        isFixedDate
          ? date ?? selectedRadio
          : selectedRadio === "next"
          ? `${nextValue}`
          : `${currentValue}`
      );

      formData.append(
        "currentValue",
        isFixedDate ? moment().format("YYYY-MM-DD") : `${currentValue}`
      );

      if (invoiceImage) {
        formData.append("invoiceImage", invoiceImage);
      }

      resetPlan(formData);
      setrowsSelected([]);
    } else {
      toast.warning("Please, fill all fields!");
    }
  };

  return (
    <div className="ms-3">
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {(formik) => {
          return (
            <Form>
              <Row>
                <Input
                  placeholder={t("plate_number_key")}
                  label={t("plate_number_key")}
                  name="PlateNumber"
                  type="text"
                  className={"col-12 col-md-6 col-lg-4 mb-3"}
                  disabled={true}
                  readonly
                />

                <Input
                  placeholder={t("select_maintenance_type_key")}
                  label={t("maintenance_type_key")}
                  name="MaintenanceType"
                  type="text"
                  className={"col-12 col-md-6 col-lg-4 mb-3"}
                  disabled={true}
                  readonly
                />

                <Input
                  placeholder={t("select_period_type_key")}
                  label={t("period_type_key")}
                  name="PeriodType"
                  type="text"
                  className={"col-12 col-md-6 col-lg-4 mb-3"}
                  disabled={true}
                  readonly
                />
                <InputFile
                  label={t("upload_file_key")}
                  name="invoiceImage"
                  type="file"
                  className="col-12 col-md-6 col-lg-4 mb-3"
                  accept=".pdf,image/png,image/jpeg,image/jpg"
                  onChange={(event) => {
                    formik.setFieldValue(
                      "invoiceImage",
                      event.currentTarget.files[0]
                    );
                  }}
                />
              </Row>
              <Row className="mb-4">
                <RadioInput
                  label={t("reset_by_key") + ":"}
                  options={radioOptions}
                  name="selectedRadio"
                  onClick={(e) => setToggleDate(e.target.value === "test")}
                />
                {isFixedDate && toggleDate && (
                  <Input
                    label={t("Custom Date") + ": "}
                    placeholder={t("maintenance_due_value_key")}
                    name="customDate"
                    type={"date"}
                    className={"col-12 col-md-6 col-lg-4 mb-3"}
                    min={moment().format("YYYY-MM-DD")}
                    onFocus={(event) => event.target.select()}
                  />
                )}
              </Row>

              <div className="w-25 d-flex flex-nowrap flex-md-nowrap">
                <Button
                  type="submit"
                  className="px-3 py-2 text-nowrap me-3 ms-0  mb-md-0"
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
                  {t("submit_key")}
                </Button>
                <Button
                  className="px-3 py-2 text-nowrap me-3 ms-0  mb-md-0"
                  onClick={() => {
                    handleModel();
                  }}
                >
                  <FontAwesomeIcon className="mx-2" icon={faTimes} size="sm" />
                  {t("cancel_key")}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Reset;
