import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import { toast } from "react-toastify";
// import { useTranslation } from "next-i18next";
import { Formik } from "formik";
import Input from "components/formik/Input";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import Checkbox from "components/formik/Checkbox";
import { vehicleDataValidation } from "helpers/yup-validations/management/VehicleManagement";
import { fetchAllSelectionsData } from "services/management/VehicleManagement";
import { useDispatch, useSelector } from "react-redux";
import { addVehicle } from "lib/slices/addNewVehicle";

const VehicleData = () => {
  const router = useRouter();
  const [wirteInOptional, setWirteInOptional] = useState(false);
  const { t } = useTranslation(["Management", "main"]);
  // const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [selectionData, setSelectionData] = useState({});
  const dispatch = useDispatch();
  const vehicle = useSelector((state) => state.addNewVehicle.vehicle);

  // fecth all selections data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const respond = await fetchAllSelectionsData();
        setSelectionData(respond);
        setLoadingPage(false);
      } catch (error) {
        toast.error(error.response.data?.message);
        setLoadingPage(false);
      }
    };
    fetchData();
  }, []);

  const ManufactCompanyName = selectionData?.allMakes?.map((ele) => {
    return { value: ele.ID, label: ele.Make };
  });

  const model = selectionData?.allModels?.map((ele) => {
    return { value: ele.ID, label: ele.Model };
  });

  const vehicleType = selectionData?.allTypes?.map((ele) => {
    return { value: ele.ID, label: ele.TypeName };
  });

  const onSubmit = async (data) => {
    const submitData = {
      ...data,
      LiterPer100KM: data.LiterPer100KM > 0 ? data.LiterPer100KM : null,
      Number: data.Number.trim().length > 0 ? data.Number : null,
      PlateType: data.PlateType > 0 ? data.PlateType : null,
      RequiredRFID: data.RequiredRFID.length > 0 ? 1 : 0,
      HaveIgnition: data.HaveIgnition.length > 0 ? 1 : 0,
      HaveRelay: data.HaveRelay.length > 0 ? 1 : 0,
      MakeID: data.MakeID > 1 ? data.MakeID : 1,
      ModelID: data.ModelID > 1 ? data.ModelID : 1,
      TypeID: data.TypeID > 1 ? data.TypeID : 1,
    };
    dispatch(addVehicle(submitData));
    router.push("/management/VehicleManagment/add/add-device");
  };

  const isVehicleExist = Object.keys(vehicle).length > 0;

  const initialValues = {
    DisplayName: isVehicleExist ? vehicle.DisplayName : "",
    PlateNumber: isVehicleExist ? vehicle.PlateNumber : "",
    MakeID: isVehicleExist ? vehicle.MakeID : "",
    ModelID: isVehicleExist ? vehicle.ModelID : "",
    MakeYear: isVehicleExist ? vehicle.MakeYear : "",
    TypeID: isVehicleExist ? vehicle.TypeID : "",
    Color: isVehicleExist ? vehicle.Color : "",
    Chassis: isVehicleExist ? vehicle.Chassis : "",
    SpeedLimit: isVehicleExist ? vehicle.SpeedLimit : 0,
    LiterPer100KM: isVehicleExist
      ? vehicle.LiterPer100KM !== null
        ? vehicle.LiterPer100KM
        : 0
      : 0,
    RequiredRFID: isVehicleExist
      ? vehicle.RequiredRFID === 1
        ? ["1"]
        : []
      : [],
    HaveIgnition: isVehicleExist
      ? vehicle.HaveIgnition === 1
        ? ["2"]
        : []
      : [],
    HaveRelay: isVehicleExist ? (vehicle.HaveRelay === 1 ? ["3"] : []) : [],
    Number: isVehicleExist
      ? vehicle.Number !== null
        ? vehicle.Number
        : ""
      : "",
    RightLetter: isVehicleExist ? vehicle.RightLetter : "",
    MiddleLetter: isVehicleExist ? vehicle.MiddleLetter : "",
    LeftLetter: isVehicleExist ? vehicle.LeftLetter : "",
    SequenceNumber: isVehicleExist ? vehicle.SequenceNumber : "",
    PlateType: isVehicleExist
      ? vehicle.PlateType !== null
        ? vehicle.PlateType
        : ""
      : "",
    ImeiNumber: isVehicleExist ? vehicle.ImeiNumber : "",
  };

  const getFormData = (values) => {
    if (
      values.Number.trim().length > 0 ||
      values.RightLetter.trim().length > 0 ||
      values.MiddleLetter.trim().length > 0 ||
      values.LeftLetter.trim().length > 0 ||
      values.SequenceNumber.trim().length > 0 ||
      values.PlateType > 0 ||
      values.ImeiNumber.trim().length > 0
    ) {
      setWirteInOptional(true);
    } else {
      setWirteInOptional(false);
    }
  };

  return (
    <div className="container-fluid">
      {loadingPage && (
        <h3 className="text-center pt-5 pb-5">{t("loading...")} </h3>
      )}
      {Object.keys(selectionData).length > 0 && (
        <Card>
          <Card.Header className="h3">{t("Add_New_Vehicle")}</Card.Header>
          <Card.Body>
            <Formik
              initialValues={initialValues}
              validationSchema={vehicleDataValidation(wirteInOptional)}
              onSubmit={onSubmit}
            >
              {(formik) => {
                setTimeout(() => getFormData(formik.values), 0);
                return (
                  <Form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col md={12}>
                        <Row>
                          <Input
                            placeholder={t("Display Name")}
                            label={t("Display Name")}
                            name="DisplayName"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Input
                            placeholder={t("Plate Number")}
                            label={t("Plate Number")}
                            name="PlateNumber"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <ReactSelect
                            options={ManufactCompanyName}
                            label={t("Manufacturing Company")}
                            placeholder={t("Select Manufacturing Company")}
                            name="MakeID"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                            isSearchable={true}
                          />

                          <ReactSelect
                            options={model}
                            label={t("Model")}
                            placeholder={t("Select Model")}
                            name="ModelID"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                            isSearchable={true}
                          />

                          <Input
                            placeholder={t("Manufacturing Year")}
                            label={t("Manufacturing Year")}
                            name="MakeYear"
                            type="number"
                            min={1800}
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <ReactSelect
                            options={vehicleType}
                            label={t("Vehicle Type")}
                            placeholder={t("Select Vehicle Type")}
                            name="TypeID"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                            isSearchable={true}
                          />

                          <Input
                            placeholder={t("Color")}
                            label={t("Color")}
                            name="Color"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Input
                            placeholder={t("Chassis Number")}
                            label={t("Chassis Number")}
                            name="Chassis"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Input
                            placeholder={t("Speed Limit")}
                            label={t("Speed Limit")}
                            name="SpeedLimit"
                            type="number"
                            min={0}
                            onFocus={(event) => event.target.select()}
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Input
                            placeholder={t("Liter Per 100KM")}
                            label={t("Liter Per 100KM")}
                            name="LiterPer100KM"
                            type="number"
                            min={0}
                            onFocus={(event) => event.target.select()}
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Row className="d-flex  justify-content-start my-2">
                            <Checkbox
                              name="RequiredRFID"
                              option={[
                                {
                                  value: "1",
                                  key: t("Required RFID"),
                                },
                              ]}
                              className="col-6 col-lg-3"
                            />
                            <Checkbox
                              name="HaveIgnition"
                              option={[
                                {
                                  value: "2",
                                  key: t("HaveIgnition"),
                                },
                              ]}
                              className="col-6 col-lg-3"
                            />
                            <Checkbox
                              name="HaveRelay"
                              option={[
                                {
                                  value: "3",
                                  key: t("HaveRelay"),
                                },
                              ]}
                              className="col-6 col-lg-3"
                            />
                          </Row>

                          <h4>{t("WASL Integration (Optional)")}</h4>
                          <Input
                            placeholder={t("Number")}
                            label={t("Number")}
                            name="Number"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Input
                            placeholder={t("Right Letter")}
                            label={t("Right Letter")}
                            name="RightLetter"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Input
                            placeholder={t("Middle Letter")}
                            label={t("Middle Letter")}
                            name="MiddleLetter"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />
                          <Input
                            placeholder={t("Left Letter")}
                            label={t("Left Letter")}
                            name="LeftLetter"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />
                          <Input
                            placeholder={t("Sequence Number")}
                            label={t("Sequence Number")}
                            name="SequenceNumber"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />
                          <Input
                            placeholder={t("Plate Type")}
                            label={t("Plate Type")}
                            name="PlateType"
                            type="number"
                            min={0}
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />
                          <Input
                            placeholder={`IMEI ${t("Number")}`}
                            label={`IMEI ${t("Number")}`}
                            name="ImeiNumber"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />
                        </Row>
                      </Col>
                    </Row>

                    <Row>
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
                            router.push("/management/VehicleManagment");
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

export default VehicleData;

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["main", "Management"])),
    },
  };
}
// translation ##################################
