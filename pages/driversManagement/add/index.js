import {
  faCar,
  faCheck,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React, { useMemo, useState, useCallback } from "react";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { toast } from "react-toastify";
import Model from "components/UI/Model";
import AgGridDT from "components/AgGridDT";
import { useTranslation } from "next-i18next";
import { Formik } from "formik";
import Input from "components/formik/Input";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import { addEditOperateDriver } from "helpers/yupValidations";
import nationalities from "public/dummyData/nationalities.json";
import {
  fitchUnassignedVehicles,
  addDriver,
  // addVehicleToDriver,
} from "services/driversManagement";
import { FileImageDimensionsHandler } from "helpers/helpers";
import { MdInfoOutline } from "react-icons/md";
export default function Index() {
  const router = useRouter();
  const [vehiclesData, setVehiclesData] = useState(null);
  const [rowSelected, setRowSelected] = useState("");
  const { t } = useTranslation("driversManagement");
  const [vehicleIDVehicleID, setVehicleIDVehicleID] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [loading, setloading] = useState(false);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [selectedPage, setSelectedPage] = useState("");
  const [dimensionsErr, setDimensionsErr] = useState('')

  //fetch vehicle Data
  const onGridReady = useCallback(async (params) => {
    try {
      const respond = await fitchUnassignedVehicles();
      setVehiclesData(respond.unAssingedVehs);
      setGridApi(params?.api);
      setGridColumnApi(params?.columnApi);
    } catch (error) {
      toast.error(error.response.data?.message);
    }
  }, []);

  // func pass selected vehicle to ag grid when open vehciles list
  const onFirstDataRendered = useCallback(
    (e) => {
      e.api.paginationGoToPage(selectedPage);
      e.api.forEachNode((node) =>
        node.setSelected(
          !!node.data && node.data.VehicleID === vehicleIDVehicleID
        )
      );
    },
    [vehicleIDVehicleID, selectedPage]
  );

  // columns for ag grid
  const columns = useMemo(
    () => [
      {
        headerName: `${t("select_key")}`,
        field: "Select",
        maxWidth: 70,
        sortable: false,
        unSortIcon: false,
        checkboxSelection: true,
        filter: false,
      },
      {
        headerName: `${t("vehicle_id_key")}`,
        field: "VehicleID",
      },
      {
        headerName: `${t("vehicle_name_key")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("plate_name_key")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("manufacturing_year_key")}`,
        field: "MakeYear",
      },
      {
        headerName: `${t("group_name_key")}`,
        field: "GroupName",
      },
    ],
    [t]
  );

  //the setting of the AG grid table .. sort , filter , etc...
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      flex: 1,
      resizable: true,
      filter: true,
    };
  }, []);

  // make min birthday is 17 years old from today
  const date = new Date().setFullYear(new Date().getFullYear() - 17);
  const maxLicenceBirthDate = new Date(date).toISOString().slice(0, 10);

  //make min licence expire Date is today
  const minLicenceExDate = new Date().toISOString().slice(0, 10);

  const getFormData = (values) => {
    setVehicleIDVehicleID(values.VehicleID);
  };
  const initialValues = {
    FirstName: "",
    LastName: "",
    DateOfBirth: "",
    Nationality: "",
    PhoneNumber: "",
    Email: "",
    DLNumber: "",
    DLExpirationDate: "",
    Department: "",
    RFID: "",
    // Image: "",
    VehicleID: "",
    IdentityNumber: "",
    DateOfBirthHijri: "",
    MobileNumber: "",
    DisplayName: "",
  };
  //  to remove null value from payloads
  function filterObject(obj) {
    const result = {};

    for (const key in obj) {
      const value = obj[key];
      if (
        value !== "" &&
        value !== null &&
        value !== "undefined" &&
        value !== undefined
      ) {
        result[key] = value;
      }
    }
    return result;
  }

  const onSubmit = async (data) => {
    const { DisplayName, ...others } = data;
    const submitData = {
      ...others,
      MobileNumber: `${data.MobileNumber}`,
      DLNumber: `${data.DLNumber}`,
      PhoneNumber: `${data.PhoneNumber}`,
      DLClass: "1",
      UDID: "1",
      WorkingDays: "h",
      ASPNetID: null,
      IsDeleted: 0,
      EmployeeID: "12121212",
      DateOfJoin: "2018-01-31T00:00:00.000Z",
      referencKey: null,
    };
    setloading(true);
    try {
      if (!dimensionsErr) {
        let formData = new FormData();
        Object.keys(submitData).forEach((ele) => {
          formData.append(ele, submitData[ele]);
        })
        const respond = await addDriver(formData);
        toast.success("Driver Add Successfully.");
        setloading(false);
        router.push("/driversManagement");
      } else {
        setloading(false);
      }

    } catch (error) {
      setloading(false);
      toast.error(error.response.data?.message);
    }
  };



  const keyPresHandler = e => {
    const regex = /^[a-zA-Z]*$/
    if (!regex.test(e.key)) e.preventDefault();
  };

  return (
    <>
      <Card>
        <Card.Header className="h3">{t("add_new_driver_key")}</Card.Header>
        <Card.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={addEditOperateDriver(t)}
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
                          placeholder={t("first_name_key")}
                          label={t("first_name_key")}
                          name="FirstName"
                          type="text"
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                          onKeyPress={keyPresHandler}
                        />

                        <Input
                          placeholder={t("last_name_key")}
                          label={t("last_name_key")}
                          name="LastName"
                          type="text"
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                          onKeyPress={keyPresHandler}
                        />
                        <Form.Group
                          className={"col-12 col-md-6 col-lg-4"}
                          controlId="exampleForm.ControlInput1"
                        >
                          <Input
                            type="date"
                            label={t("date_of_birth")}
                            name="DateOfBirth"
                            className="order-2 w-100  bg-transparent"
                            placeholder={t("Select_Date_key")}
                            min="1900-01-01"
                            max={`${maxLicenceBirthDate}`}
                          />
                        </Form.Group>
                        <ReactSelect
                          options={nationalities}
                          label={t("nationality_key")}
                          name="Nationality"
                          placeholder={t("nationality_key")}
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                        />

                        <Input
                          placeholder={t("phone_number_key")}
                          label={t("phone_number_key")}
                          name="PhoneNumber"
                          type="number"
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                          min={0}
                        />

                        <Input
                          label={t("email_address_key")}
                          placeholder={t("email_address_key")}
                          name="Email"
                          type="email"
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                        />

                        <Input
                          placeholder={t("license_number_key")}
                          label={t("license_number_key")}
                          name="DLNumber"
                          type="number"
                          min={0}
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                        />

                        <Form.Group
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                          controlId="exampleForm.ControlInput1"
                        >
                          <Input
                            placeholder={t("license_expiration_date_key")}
                            label={t("license_expiration_date_key")}
                            name="DLExpirationDate"
                            type="date"
                            className="order-2 w-100  bg-transparent"
                            min={new Date().toISOString().slice(0, 10)}
                          />

                        </Form.Group>
                        <Input
                          placeholder={t("department_key")}
                          label={t("department_key")}
                          name="Department"
                          type="text"
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                        />

                        <Input
                          placeholder={t("RFID_key")}
                          label={t("RFID_key")}
                          name="RFID"
                          type="text"
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                        />

                        <Form.Group
                          controlId="formFile"
                          className="col-12 col-md-6 col-lg-4 mb-3"
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <Form.Label>{t("upload_image_key")}</Form.Label>
                            <span data-text="240 * 240 recommended" className="hint-info"><MdInfoOutline /> </span>
                          </div>

                          <Form.Control
                            className="border-primary custom-file-input"
                            id="customFileUpload"
                            type="file"
                            accept="image/jpeg, image/png, image/jpg"
                            name="Image"
                            onChange={(event) => {
                              FileImageDimensionsHandler(event, setDimensionsErr, t)
                              formik.setFieldValue(
                                "Image",
                                event.currentTarget.files[0]
                              );
                            }}
                          />
                          {dimensionsErr && <span className="text-danger" style={{ fontSize: "12px" }}> {dimensionsErr} </span>}

                        </Form.Group>

                        <Input
                          placeholder={t("selected_vehicle_VehicleID_key")}
                          label={t("selected_vehicle_VehicleID_key")}
                          name="VehicleID"
                          type="text"
                          disabled={true}
                          className={"col-12 col-md-6 col-lg-4 mb-3 d-none"}
                        />

                        <Input
                          placeholder={t("selected_vehicle_DisplayName_key")}
                          label={t("selected_vehicle_DisplayName_key")}
                          name="DisplayName"
                          type="text"
                          disabled={true}
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                        />

                        <h4>{t("WASL_Integration_(Optional)_key")}</h4>
                        <Input
                          placeholder={t("identity_number_key")}
                          label={t("identity_number_key")}
                          name="IdentityNumber"
                          type="text"
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                        />

                        <Input
                          placeholder={t("date_of_birth_hijri_key")}
                          label={t("date_of_birth_hijri_key")}
                          name="DateOfBirthHijri"
                          type="text"
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                        />

                        <Input
                          placeholder={t("mobile_number_key")}
                          label={t("mobile_number_key")}
                          name="MobileNumber"
                          type="string"
                          min={0}
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                        />
                      </Row>
                    </Col>
                  </Row>
                  <Model
                    header={t("vehicles_list_key")}
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    onUpdate={() => {
                      setModalShow(false);
                      formik.setFieldValue("VehicleID", rowSelected.VehicleID);
                      formik.setFieldValue(
                        "DisplayName",
                        rowSelected.DisplayName
                      );
                    }}
                    disabled={rowSelected ? false : true}
                    updateButton={t("assign_to_driver_key")}
                  >
                    <AgGridDT
                      rowHeight={"auto"}
                      columnDefs={columns}
                      rowData={vehiclesData}
                      rowSelection={"single"}
                      paginationPageSize={10}
                      defaultColDef={defaultColDef}
                      onGridReady={onGridReady}
                      onSelectionChanged={(e) => {
                        setSelectedPage(e.api.paginationProxy.currentPage);
                        setRowSelected([...e.api.getSelectedRows()][0]);
                      }}
                      onFirstDataRendered={onFirstDataRendered}
                      gridApi={gridApi}
                      gridColumnApi={gridColumnApi}
                    />
                  </Model>
                  <Row>
                    <div className="w-25 d-flex flex-wrap flex-md-nowrap ">
                      <Button
                        className="px-3 py-2 text-nowrap me-3 mb-2 mb-md-0 d-flex align-items-center"
                        onClick={(e) => {
                          e.preventDefault();
                          setModalShow(true);
                        }}
                      >
                        <FontAwesomeIcon
                          className="me-2"
                          icon={faCar}
                          size="sm"
                        />
                        {t("assign_vehicle_to_driver_key")}
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="px-3 py-2 text-nowrap me-3 mb-2 mb-md-0 d-flex align-items-center"
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
                        className="px-3 py-2 text-nowrap me-3 ms-0 d-flex align-items-center"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push("/driversManagement");
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
                  </Row>
                </Form>
              );
            }}
          </Formik>
        </Card.Body>
      </Card>
    </>
  );
}

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["main", "driversManagement"])),
    },
  };
}
// translation ##################################
