import { useEffect, useState } from "react";
import {
  editVehicle,
  fetchAllSelectionsData,
  fetchVehicleGroups,
  updateVehicle,
} from "/services/management/VehicleManagement";
import { toast } from "react-toastify";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import { Formik } from "formik";
import Input from "components/formik/Input";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import Checkbox from "components/formik/Checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { vehicleDataValidation } from "helpers/yup-validations/management/VehicleManagement";
import { useRouter } from "next/router";
import Textarea from "components/formik/Textarea";
import { useTranslation } from "next-i18next";

const Edit = ({
  id,
  handleModel,
  icon,
  editModel,
  modelButtonMsg,
  className,
  updateAssignedTable,
  updateUnassignedTable,
  onModelButtonClicked,
  redirectPath = "/management/VehicleManagment",
}) => {
  const [data, setData] = useState({});
  const [loadingPage, setLoadingPage] = useState(true);
  const [selectionData, setSelectionData] = useState({});
  const [wirteInOptional, setWirteInOptional] = useState(false);
  const router = useRouter();
  const [groupsOptions, setGroupsOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(["Management", "main"]);
  // fetch group selections data
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
      } catch (error) {
        toast.error(error.response.data?.message);
      }
    };
    fetchData();
  }, []);

  // fetch all selections data(model,manufacturing company,vehicle type)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const respond = await fetchAllSelectionsData();
        setSelectionData(respond);
      } catch (error) {
        toast.error(error.response.data?.message);
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

  // fetch vehicle data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const respond = await editVehicle(id);
        setData(respond.Vehicle);
        setLoadingPage(false);
      } catch (error) {
        toast.error(error.response.data?.message);
        setLoadingPage(false);
      }
    };
    fetchData();
  }, [id]);

  const onSubmit = async (data) => {
    const submitData = {
      ...data,
      LiterPer100KM: data.LiterPer100KM > 0 ? data.LiterPer100KM : null,
      Number: data.Number.trim().length > 0 ? data.Number : null,
      PlateType: data.PlateType > 0 ? data.PlateType : null,
      RequiredRFID: data.RequiredRFID.length > 0 ? 1 : 0,
      HaveIgnition: data.HaveIgnition.length > 0 ? 1 : 0,
      HaveRelay: data.HaveRelay.length > 0 ? 1 : 0,
      JedahIntegrated: data.JedahIntegrated.length > 0 ? 1 : 0,
      MakeID: data.MakeID > 1 ? data.MakeID : 1,
      ModelID: data.ModelID > 1 ? data.ModelID : 1,
      TypeID: data.TypeID > 1 ? data.TypeID : 1,
    };

    setLoading(true);
    try {
      const respond = await updateVehicle(id, submitData);
      toast.success(respond.Vehicle);
      setLoading(false);
      if (editModel) {
        handleModel();
        updateAssignedTable();
        updateUnassignedTable();
      }
      router.push({
        pathname: redirectPath,
      });
    } catch (error) {
      toast.error(error.response.data?.message);
      setLoading(false);
    }
  };

  const getFormData = (values) => {
    // if (
    //   values.Number.trim().length > 0 ||
    //   values.RightLetter.trim().length > 0 ||
    //   values.MiddleLetter.trim().length > 0 ||
    //   values.LeftLetter.trim().length > 0 ||
    //   values.SequenceNumber.trim().length > 0 ||
    //   values.PlateType > 0 ||
    //   values.ImeiNumber.trim().length > 0
    // ) {
    //   setWirteInOptional(true);
    // }
    // else {
    //   setWirteInOptional(false);
    // }
  };

  const ManufacturingYear = data.MakeYear ? data.MakeYear.slice(0, 4) : "";

  const initialValues = {
    DisplayName: data.DisplayName || "",
    PlateNumber: data.PlateNumber || "",
    MakeID: data.MakeID || "",
    ModelID: data.ModelID || "",
    MakeYear: ManufacturingYear,
    TypeID: data.TypeID || "",
    Color: data.Color || "",
    Chassis: data.Chassis || "",
    SpeedLimit: data.SpeedLimit || 0,
    LiterPer100KM: data.LiterPer100KM !== null ? data.LiterPer100KM : 0,
    RequiredRFID: data.RequiredRFID === true ? ["1"] : [],
    HaveIgnition: data.HaveIgnition === true ? ["2"] : [],
    HaveRelay: data.HaveRelay === true ? ["3"] : [],
    JedahIntegrated: data.JedahIntegrated === true ? ["4"] : [],
    Number: data.Number !== null ? data.Number : "",
    RightLetter: data.RightLetter || "",
    MiddleLetter: data.MiddleLetter || "",
    LeftLetter: data.LeftLetter || "",
    SequenceNumber: data.SequenceNumber || "",
    PlateType: data.PlateType !== null ? data.PlateType : "",
    ImeiNumber: data.ImeiNumber || "",
    GroupID: data.GroupID || "",
    MaxParkingTime: data.MaxParkingTime || 0,
    MaxIdlingTime: data.MaxIdlingTime || 0,
    Remarks: data.Remarks || "",
    HeadWieght: +data.HeadWieght || 0,
    TailWeight: +data.TailWeight || 0,
    TotalWeight: +data.TotalWeight || 0,
    MaxVolt: +data.MaxVolt || 0,
    MinVolt: +data.MinVolt || 0,
  };

  return (
    <div className="container-fluid">
      {loadingPage && (
        <h3 className="text-center pt-5 pb-5"> {t("loading...")} </h3>
      )}
      {data && Object.keys(data)?.length > 0 && (
        <Card>
          {!editModel && (
            <Card.Header className="h3">
              {" "}
              {t("Edit Vehicle Information")}{" "}
            </Card.Header>
          )}
          <Card.Body className={`${className}`}>
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

                          <Input
                            placeholder={t("Maximum Parking Time")}
                            label={t("Maximum Parking Time")}
                            name="MaxParkingTime"
                            type="number"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                            min={0}
                            onFocus={(event) => event.target.select()}
                          />

                          <Input
                            placeholder={t("Maximum Idling Time")}
                            label={t("Maximum Idling Time")}
                            name="MaxIdlingTime"
                            type="number"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                            min={0}
                            onFocus={(event) => event.target.select()}
                          />

                          <Row className="d-flex  justify-content-start my-2">
                            <Checkbox
                              name="RequiredRFID"
                              option={[
                                {
                                  value: "1",
                                  key: "Required RFID",
                                },
                              ]}
                              className="col-6 col-lg-3"
                            />
                            <Checkbox
                              name="HaveIgnition"
                              option={[
                                {
                                  value: "2",
                                  key: "HaveIgnition",
                                },
                              ]}
                              className="col-6 col-lg-3"
                            />
                            <Checkbox
                              name="HaveRelay"
                              option={[
                                {
                                  value: "3",
                                  key: "HaveRelay",
                                },
                              ]}
                              className="col-6 col-lg-3"
                            />
                            <Checkbox
                              name="JedahIntegrated"
                              option={[
                                {
                                  value: "4",
                                  key: "JedahIntegrated",
                                },
                              ]}
                              className="col-6 col-lg-3"
                            />
                          </Row>

                          <h4> {t("Edit Groups Information")} </h4>
                          <ReactSelect
                            options={groupsOptions}
                            label={t("Group Name")}
                            placeholder={t("Select a Group Name")}
                            name="GroupID"
                            className={"col-6 mb-3"}
                            isSearchable={true}
                          />
                          <Textarea
                            label={t("Remarks")}
                            placeholder={t("Add Remarks")}
                            name="Remarks"
                            className={"col-6 mb-3"}
                          />

                          <h4> {t("Weight Sensor Setup (Optional)")} </h4>
                          <Input
                            placeholder={t("Head Weight")}
                            label={t("Head Weight")}
                            name="HeadWieght"
                            type="number"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Input
                            placeholder={t("Tail Weight")}
                            label={t("Tail Weight")}
                            name="TailWeight"
                            type="number"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <Input
                            placeholder={t("Cargo Weight")}
                            label={t("Cargo Weight")}
                            name="TotalWeight"
                            type="number"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />
                          <Input
                            placeholder={t("Maximum Voltage")}
                            label={t("Maximum Voltage")}
                            name="MaxVolt"
                            type="number"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />
                          <Input
                            placeholder={t("Minimum Voltage")}
                            label={t("Minimum Voltage")}
                            name="MinVolt"
                            type="number"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />

                          <h4> {t("WASL Integration (Optional)")} </h4>
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
                            placeholder={t("IMEI Number")}
                            label={t("IMEI Number")}
                            name="ImeiNumber"
                            type="text"
                            className={"col-12 col-md-6 col-lg-4 mb-3"}
                          />
                        </Row>
                      </Col>
                    </Row>

                    <Row>
                      <div className="w-25 d-flex flex-wrap flex-md-nowrap">
                        {editModel && (
                          <Button
                            className="px-3 py-2 text-nowrap me-3 ms-0  mb-md-0"
                            type="button"
                            onClick={onModelButtonClicked}
                          >
                            {t(modelButtonMsg)}
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
                          {t("Save Changes")}
                        </Button>
                        <Button
                          className="px-3 py-2 text-nowrap me-3 ms-0"
                          onClick={() => {
                            if (editModel) {
                              handleModel();
                            } else {
                              router.push("/management/VehicleManagment/");
                            }
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

export default Edit;
