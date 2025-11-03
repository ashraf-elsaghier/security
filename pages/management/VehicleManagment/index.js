import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faUsersCog,
  faExternalLinkAlt,
  faPlug,
  faSimCard,
  faFileDownload,
} from "@fortawesome/free-solid-svg-icons";
import CardCountStart from "components/CardCountStart";
import {
  fetchVehilceStatistics,
  fetchAllVehicles,
  fetchAllUnAssignedVehicles,
  deleteVehicle,
  postVehiclesBulk,
} from "services/management/VehicleManagement";
import Edit from "components/management/VehicleManagement/Edit";
import Bulk from "components/management/Bulk";
import AssignDevice from "components/management/VehicleManagement/AssignDevice";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Row, Col, Card, Button } from "react-bootstrap";
import DeleteModal from "components/Modals/DeleteModal";
import Link from "next/link";
import HideActions from "hooks/HideActions";
import AgGridDT from "components/AgGridDT";
import WaslIntegration from "components/icons/WaslIntegration";
import { toast } from "react-toastify";
import router from "next/router";
import Model from "components/UI/Model";
import { useDispatch, useSelector } from "react-redux";
import { toggle as tourToggle, disableTour, enableTour } from "lib/slices/tour";
import style from "styles/scss/custom/components/tour-step/tourStep.module.scss";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import useStepDashboard from "hooks/useStepDashboard";
import { getSession } from "next-auth/client";
import { resetData } from "lib/slices/addNewVehicle";
// data for download bulk
const excelData = [
  {
    GroupID: "",
    MaxParkingTime: "",
    MaxIdlingTime: "",
    Remarks: "",
    DisplayName: "",
    PlateNumber: "",
    MakeID: "",
    ModelID: "",
    MakeYear: "",
    TypeID: "",
    Color: "",
    Chassis: "",
    SpeedLimit: "",
    LiterPer100KM: "",
    RequiredRFID: "",
    HaveIgnition: "",
    HaveRelay: "",
    Number: "",
    RightLetter: "",
    MiddleLetter: "",
    LeftLetter: "",
    SequenceNumber: "",
    PlateType: "",
    ImeiNumber: "",
    deviceTypeId: "",
    serialNumber: "",
    phoneNumber: "",
    provider: "",
    simSerialNumber: "",
  },
];

function VehicleManagment() {
  const { t } = useTranslation(["Management"]);
  const [showModalDelete, setshowModalDelete] = useState(false);
  const [loadingDelete, setloadingDelete] = useState(false);

  const [vehiclesStatistics, setVehiclesStatistics] = useState({});
  const [assignedVehicles, setAssignedVehicles] = useState(null);
  const [assignedGridApi, setAssignedGridApi] = useState(null);
  const [assignedGridColumnApi, setAssignedGridColumnApi] = useState(null);

  const [unassignedVehicles, setUnassignedVehicles] = useState(null);
  const [unassignedGridApi, setUnassignedGridApi] = useState(null);
  const [unassignedGridColumnApi, setUnassignedGridColumnApi] = useState(null);
  const [deleteObj, setDeleteObj] = useState({});
  const [editID, setEditID] = useState("");
  const [assignVehicleID, setAssignVehicleID] = useState("");
  const [editModalShow, setEditModalShow] = useState(false);
  const [assignModalShow, setAssignModalShow] = useState(false);
  const [bulkModel, setBulkModel] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const { darkMode } = useSelector((state) => state.config);
  const dispatch = useDispatch();
  const tourState = useSelector((state) => state.tour.run);
  const allSteps = useStepDashboard();
  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setState({ stepIndex: 0, steps: steps });
      dispatch(tourToggle());
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

      if (index === 11 && action === ACTIONS.PREV) {
        setState({
          stepIndex: nextStepIndex,
          steps: steps,
        });
      } else if (data.action === "close" || data.action === "reset") {
        dispatch(disableTour());
      } else {
        setState({
          stepIndex: nextStepIndex,
          steps: steps,
        });
      }
    }
  };
  const [{ stepIndex, steps }, setState] = useState({
    stepIndex: 0,
    steps: allSteps["vehiclesManagement"],
  });
  // fetch vehicle Statistics(main page)
  useEffect(() => {
    const fetchVehiclesStatistics = async () => {
      try {
        const respond = await fetchVehilceStatistics();
        setVehiclesStatistics(respond);
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    };
    fetchVehiclesStatistics();
    dispatch(resetData());
  }, []);

  //fetch Assigned vehicles data
  const onAssigndGridReady = useCallback(async (params) => {
    try {
      const respond = await fetchAllVehicles();
      setAssignedVehicles(respond.Vehicles);
      setAssignedGridApi(params.api);
      setAssignedGridColumnApi(params.columnApi);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, []);

  //fetch unassigned vehicles data
  const onUnassigndGridReady = useCallback(async (params) => {
    try {
      const respond = await fetchAllUnAssignedVehicles();
      setUnassignedVehicles(respond?.unAssingedVehicles || []);
      setUnassignedGridApi(params.api);
      setUnassignedGridColumnApi(params.columnApi);
    } catch (error) {
      // toast.error(error?.response?.data?.message);
    }
  }, []);

  // delete vehicle
  const onDelete = async () => {
    setloadingDelete(true);

    try {
      const respond = await deleteVehicle(deleteObj.id);
      toast.success(respond.message);
      setloadingDelete(false);
      setshowModalDelete(false);
      if (deleteObj.isAssignTable) {
        setAssignedVehicles((prev) =>
          prev.filter((ele) => ele.VehicleID !== deleteObj.id)
        );
      } else {
        setUnassignedVehicles((prev) =>
          prev.filter((ele) => ele.VehicleID !== deleteObj.id)
        );
      }
    } catch (error) {
      toast.error(error.response.data?.message);
      setloadingDelete(false);
      setshowModalDelete(false);
    }
  };

  // bulk submited function
  const bulkDataHandler = async (data) => {
    setBulkLoading(true);
    try {
      const respond = await postVehiclesBulk(data);
      setBulkLoading(false);
      setBulkModel(false);
      toast.success("Bulk added successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setBulkLoading(false);
    }
  };

  //the setting of the AG grid table .. sort , filter , etc...
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      flex: 1,
      resizable: true,
      filter: true,
    };
  }, []);

  // columns used in assigned ag grid
  const columnsAssigned = useMemo(
    () => [
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
        cellRenderer: (params) => (
          <>
            <div className="nav-veh">
              <Link
                href={{
                  pathname: `/vehicle/[vehicleId]`,
                  query: { vehicleId: params.data.VehicleID },
                }}
                passHref>
                {params.value}
              </Link>
            </div>
            <div
              className="d-flex align-items-center  justify-content-start gap-2 options flex-wrap "
              style={{ width: "120%" }}>
              <p
                className="edit-vehicle"
                onClick={() => {
                  setEditID(params.data.VehicleID);
                  setEditModalShow(true);
                }}
                style={{ cursor: "pointer" }}>
                {t("Edit")}
              </p>

              <p
                onClick={() => {
                  setshowModalDelete(true);
                  setDeleteObj({
                    id: params.data.VehicleID,
                    isAssignTable: true,
                  });
                }}
                className="m-0 delete-vehicle"
                style={{ cursor: "pointer" }}>
                {t("Delete")}
              </p>

              {/* <p className='m-0' style={{ cursor: 'pointer' }}>{t("Deactivate")}</p>
              <p className='m-0' style={{ cursor: 'pointer' }}>{t("Show_Vehicles")} </p> */}

              <span
                onClick={() => {
                  setshowModalDelete(true);
                  setDeleteObj({
                    id: params.data.VehicleID,
                    isAssignTable: true,
                  });
                }}
                className="">
                | {t("Edit Accessories")}
              </span>
            </div>
          </>
        ),

        minWidth: 300,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("Manufacturing_Company")}`,
        field: "manufacturingCompany",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("Vehicle_Type")}`,
        field: "TypeName",
        minWidth: 150,
        unSortIcon: true,
      },
      {
        headerName: `${t("Chassis_Number")}`,
        field: "Chassis",
        minWidth: 120,
        unSortIcon: true,
        valueGetter: (params) =>
          params?.data?.Chassis === null || params?.data?.Chassis === "null"
            ? "N/A"
            : params?.data?.Chassis,
      },
      {
        headerName: `${t("Manufacturing_Year")}`,
        field: "MakeYear",
        minWidth: 120,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("Device_Serial_Number")}`,
        field: "SerialNumber",
        minWidth: 120,
        unSortIcon: true,
      },
      {
        headerName: `${t("Device_Type")}`,
        field: "DeviceType",
        minWidth: 120,
        unSortIcon: true,
      },
      {
        headerName: `${t("WASL_Integration")}`,
        field: "WASLIntegration",
        valueGetter: (params) => t(params.data.WASLIntegration),
        minWidth: 300,
        unSortIcon: true,
      },
    ],
    [t]
  );

  // columns used in unassigned ag grid
  const columnsUnAssigned = useMemo(
    () => [
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
        cellRenderer: (params) => (
          <>
            <div>{params.value ?? "N/A"}</div>
            <div className="d-flex align-items-center  justify-content-start gap-2 optionsShow flex-wrap">
              <span
                onClick={() => {
                  setAssignModalShow(true);
                  setAssignVehicleID(params.data.VehicleID);
                }}>
                {t("Assign Device")} |
              </span>
              <span
                onClick={() => {
                  setEditID(params.data.VehicleID);
                  setEditModalShow(true);
                }}
                className="">
                {t("edit")}
              </span>
              <span
                onClick={() => {
                  setshowModalDelete(true);
                  setDeleteObj({
                    id: params.data.VehicleID,
                    isAssignTable: false,
                  });
                }}
                className="">
                | {t("delete")}
              </span>
            </div>
          </>
        ),
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
        valueFormatter: (params) => params?.value ?? "N/A",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("Manufacturing_Company")}`,
        field: "Make",
        valueFormatter: (params) => params?.value ?? "N/A",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("Vehicle_Type")}`,
        field: "TypeName",
        minWidth: 150,
        unSortIcon: true,
      },
      {
        headerName: `${t("Chassis_Number")}`,
        field: "Chassis",
        minWidth: 120,
        unSortIcon: true,
      },
      {
        headerName: `${t("Manufacturing_Year")}`,
        field: "MakeYear",
        minWidth: 120,
        sortable: true,
        unSortIcon: true,
        valueFormatter: function (params) {
          return params.value?.slice(0, 4);
        },
      },
    ],
    [t, darkMode]
  );

  return (
    <div className="container-fluid manage-vehicles">
      <Joyride
        steps={steps}
        continuous
        callback={handleJoyrideCallback}
        run={tourState}
        stepIndex={stepIndex}
        showSkipButton
        locale={{
          skip: <span className={style["skip-tour"]}>{t("skip_tour")}</span>,
          back: <span className={style["skip-tour"]}>{t("back")}</span>,
          next: <span>{t("next")}</span>,
          last: <span>{t("last")}</span>,
        }}
        styles={{
          options: {
            primaryColor: "#2C7BC6",
            overlayColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 50000,
            width: "379px",
            backgroundColor: "#E0EAE9",
          },
        }}
      />
      <Row>
        <Col sm="12">
          <Card>
            <Card.Header>
              <Row className="vehicles-stats">
                <CardCountStart
                  icon={faCar}
                  iconColor="primary"
                  title={t("Active_Vehicles")}
                  countEnd={vehiclesStatistics.active_Vehicles}
                  desc={t("Vehicles that is currently live and send data.")}
                />
                <CardCountStart
                  icon={faPlug}
                  iconColor="success"
                  title={t("Inactive_Vehicles")}
                  countEnd={vehiclesStatistics.Inactive_Vehicles}
                  desc={t(
                    "Vehicles that didn't send any data for more than one minute."
                  )}
                />
                <CardCountStart
                  icon={faUsersCog}
                  iconColor="warning"
                  title={t("Unassigned_Devices")}
                  countEnd={vehiclesStatistics.unassignedDevices}
                  desc={t(
                    "Devices that are Added to the system but not yet assigned to a vehicle."
                  )}
                />
                <CardCountStart
                  iconColor="info"
                  title={t("Registered_Vehicle_to_WASL")}
                  countEnd={vehiclesStatistics.registerdtoWASL}
                  desc={t("Registered Vehicle to WASL.")}>
                  <WaslIntegration width={"40px"} fill={"currentColor"} />
                </CardCountStart>
              </Row>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-column w-100">
                <div className="w-100 header-title d-flex justify-content-between align-items-center py-3">
                  <div>
                    <h3 className="mb-3">{t("Manage_Vehicles")}</h3>

                    <Link href="/management/VehicleManagment/add/vehicle-data">
                      <a>
                        <Button
                          type="button"
                          className="btn btn-primary  px-3 py-2 me-3  add-new-vehicle">
                          <FontAwesomeIcon
                            className="me-2"
                            icon={faSimCard}
                            size="sm"
                          />
                          {t("Add_Vehicle")}
                        </Button>
                      </a>
                    </Link>

                    <button
                      type="button"
                      className="btn btn-primary  px-3 py-2 me-3  add-bulk"
                      onClick={() => {
                        setBulkModel(true);
                      }}>
                      <FontAwesomeIcon
                        className="me-2"
                        icon={faSimCard}
                        size="sm"
                      />
                      {t("Add_Vehicle_Bulk")}
                    </button>
                    {/* <Link href="" passHref> */}
                    {/* <button
                      type="button"
                      className="btn btn-primary  px-3 py-2 me-3 "
                    >
                      <FontAwesomeIcon
                        className="me-2"
                        icon={faSimCard}
                        size="sm"
                      />
                      {t("Transfer_Device_to_Account")}
                    </button> */}
                    {/* </Link> */}
                  </div>
                </div>
              </div>
              <div className="vehicles-table">
                <AgGridDT
                  columnDefs={columnsAssigned}
                  rowData={assignedVehicles}
                  onCellMouseOver={(e) =>
                    (e.event.target.dataset.test = "showActions")
                  }
                  enableRtl={true}
                  onCellMouseOut={HideActions}
                  paginationNumberFormatter={function (params) {
                    return params.value.toLocaleString();
                  }}
                  defaultColDef={defaultColDef}
                  onGridReady={onAssigndGridReady}
                  gridApi={assignedGridApi}
                  gridColumnApi={assignedGridColumnApi}
                />
              </div>

              <h3 className="mt-5">{t("UnAssigned_Vehicles")}</h3>
              <div className="unassigned-vehicles">
                <AgGridDT
                  columnDefs={columnsUnAssigned}
                  rowData={unassignedVehicles || []}
                  onCellMouseOver={(e) =>
                    (e.event.target.dataset.test = "showActions")
                  }
                  onCellMouseOut={HideActions}
                  autoSize={true}
                  paginationNumberFormatter={function (params) {
                    return params.value.toLocaleString();
                  }}
                  defaultColDef={defaultColDef}
                  onGridReady={onUnassigndGridReady}
                  gridApi={unassignedGridApi}
                  gridColumnApi={unassignedGridColumnApi}
                  // overlayNoRowsTemplate={"No Data to Show"}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <DeleteModal
        show={showModalDelete}
        loading={loadingDelete}
        title={t("Delete Vehicle")}
        description={t("Are you sure you want to delete this Vehicle?")}
        confirmText={t("Yes, delete it!")}
        cancelText={t("No, cancel")}
        onConfirm={onDelete}
        onCancel={() => {
          setshowModalDelete(false);
        }}
      />
      {/* Edit Model */}
      <Model
        header={t("Update Vehicle Information")}
        show={editModalShow}
        onHide={() => setEditModalShow(false)}
        updateButton={"Update"}
        footer={false}
        size={"xl"}
        className={"mt-5"}>
        <Edit
          handleModel={() => {
            setEditModalShow(false);
          }}
          icon={faExternalLinkAlt}
          editModel={true}
          id={editID}
          modelButtonMsg={"Open in new tab"}
          className={`p-0 m-0`}
          onModelButtonClicked={() => {
            window.open(
              `/management/VehicleManagment/edit/${editID}`,
              "_blank",
              "noopener,noreferrer"
            );

            // router.push({
            //   pathname: "/management/VehicleManagment/edit/[editId]",
            //   query: { editId: editID },
            // });
          }}
          updateAssignedTable={onAssigndGridReady}
          updateUnassignedTable={onUnassigndGridReady}
        />
      </Model>
      {/* assign device Model */}
      <Model
        header={"Assign Device to Vehicle"}
        show={assignModalShow}
        onHide={() => setAssignModalShow(false)}
        updateButton={"Update"}
        footer={false}
        size={"xl"}
        className={"mt-5"}>
        <AssignDevice
          handleModel={() => {
            setAssignModalShow(false);
          }}
          id={assignVehicleID}
        />
      </Model>
      {/* Bulk Model */}
      <Model
        header={t("Add_Vehicle_Bulk")}
        show={bulkModel}
        onHide={() => setBulkModel(false)}
        updateButton={t("Update")}
        footer={false}
        size={"xl"}
        className={"mt-5"}>
        <Bulk
          excelData={excelData}
          handleModel={() => {
            setBulkModel(false);
          }}
          modelButtonMsg={t("Download Template")}
          icon={faFileDownload}
          fileName={t("VehiclesPatch")}
          bulkRequest={bulkDataHandler}
          loading={bulkLoading}
        />
      </Model>
    </div>
  );
}

export default VehicleManagment;

// translation ##################################
export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const userRole = session?.user?.user?.role?.toLowerCase();
  const isUserOrFleet = userRole === "user" || userRole === "fleet";

  if (!session || isUserOrFleet) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        "main",
        "Management",
        "Tour",
        "common",
      ])),
    },
  };
}
