import { useCallback, useEffect, useMemo, useState } from "react";
import { Row, Col, Card, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlug,
  faUsersCog,
  faCar,
  faUserSlash,
  faEdit,
  faSimCard,
  faFileExport,
  faTrash,
  faUserEdit, faFileDownload,
  faExternalLinkAlt,
  // faFileCsv,
} from "@fortawesome/free-solid-svg-icons";

import HideActions from "hooks/HideActions";
// translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CardCountStart from "../../../../components/CardCountStart";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicles } from "../../../../lib/slices/vehicleInfo";
import { useRouter } from "next/router";
import AgGridDT from "../../../../components/AgGridDT";
import { deleteVehicle, fetchAllUnAssignedVehicles, fetchAllVehicles, fetchVehilceStatistics, postVehiclesBulk } from "services/management/VehicleManagement";
import Bulk from "components/management/Bulk";
import Model from "components/UI/Model";
import AssignDevice from "components/management/VehicleManagement/AssignDevice";
import { toast } from "react-toastify";
import Edit from "components/management/VehicleManagement/Edit";
import DeleteModal from "components/Modals/DeleteModal";

const ItemVehicleManagment = () => {
  const { t } = useTranslation("Management");
  const dispatch = useDispatch();
  const [unassignedVehicles, setUnassignedVehicles] = useState(null);
  const [unassignedGridApi, setUnassignedGridApi] = useState(null);
  const [unassignedGridColumnApi, setUnassignedGridColumnApi] = useState(null);
  const [vehiclesStatistics, setVehiclesStatistics] = useState({})
  const { AllData /* loading */ } = useSelector((state) => state.vehicleInfo);
  const Assigned = AllData?.filter((ele) => ele.VehicleID !== null);
  const [assignedVehicleID, setAssignVehicleID] = useState(null)
  const [assignModalShow, setAssignModalShow] = useState(false);
  const [editID, setEditID] = useState("");
  const [editModalShow, setEditModalShow] = useState(false);
  const [showModalDelete, setshowModalDelete] = useState(false);
  const [loadingDelete, setloadingDelete] = useState(false);
  const [deleteObj, setDeleteObj] = useState({});
  const [assignedVehicles, setAssignedVehicles] = useState([]);
  const [assignedGridApi, setAssignedGridApi] = useState(null);
  const [assignedGridColumnApi, setAssignedGridColumnApi] = useState(null);
  // const UnAssigned = AllData?.filter((ele) => ele.VehicleID === null);
  const { query } = useRouter();
  const [bulkModel, setBulkModel] = useState(false);
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
  const [bulkLoading, setBulkLoading] = useState(false);

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
  const onUnassigndGridReady = useCallback(async (params) => {
    try {
      const respond = await fetchAllUnAssignedVehicles(query.id);
      setUnassignedVehicles(respond.unAssingedVehicles);
      setUnassignedGridApi(params.api);
      setUnassignedGridColumnApi(params.columnApi);
    } catch (error) {
      // toast.error(error?.response?.data?.message);
    }
  }, []);


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

  const [, /* gridColumnApi */ setGridColumnApi] = useState(null);
  const [, setGridApi] = useState(null);

  useEffect(() => {
    const data = { id: query.id };

    dispatch(fetchVehicles(data));
  }, [dispatch]);

  const rowHeight = 65;
  useEffect(() => {
    const fetchVehiclesStatistics = async () => {
      try {
        const respond = await fetchVehilceStatistics(query.id);
        setVehiclesStatistics(respond);
      } catch (error) {
        toast.error(error.response.data?.message);
      }
    };
    fetchVehiclesStatistics();
  }, []);

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

  // useEffect(() => {
  //   if(AllData) 
  //     setAssignedVehicles(AllData?.filter((ele) => ele.VehicleID !== null))
  // }, [AllData])
  const columnsAssigned = useMemo(
    () => [
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
        // valueGetter: handleFullName,
        cellRenderer: (params) => (
          <>
            <Link href={`/vehicle/${params?.data?.VehicleID}`}>
              <a className="text-decoration-underline">{params.value}</a>
            </Link>
            <div className="d-flex justify-content-start flex-wrap gap-1 options ">

              <span className=" px-2 mt-0">

                {t("edit")}
              </span>
              <span className="px-2  mt-0">
                x

                {t("delete")}
              </span>
              <span className=" px-2 mt-0">


                {t("Deactivate")}
              </span>
              <span className="px-2  mt-0">
                {/* <FontAwesomeIcon className="pe-2" icon={faCar} size="lg" /> */}
                {/* {t("reset_password")} */}

                {t("Show_Vehicles")}
              </span>

            </div>
          </>
        ),
        minWidth: 350,
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
        field: "VehicleStatus",
        minWidth: 150,
        // valueFormatter:
        //   'value?.slice(5).replace("T", " ").replace(".000Z", "")',
        unSortIcon: true,
      },
      {
        headerName: `${t("Chassis_Number")}`,
        field: "Chassis",
        minWidth: 120,
        //  valueFormatter: "value?.toFixed(2)",
        unSortIcon: true,
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
        field: "PlateNumber",
        minWidth: 120,
        //  valueFormatter: "value?.toFixed(2)",
        unSortIcon: true,
      },
      {
        headerName: `${t("Device_Type")}`,
        field: "PlateType",
        minWidth: 120,
        //  valueFormatter: "value?.toFixed(2)",
        unSortIcon: true,
      },
      {
        headerName: `${t("WASL_Integration")}`,
        field: "LeftLetter",
        minWidth: 120,
        //  valueFormatter: "value?.toFixed(2)",
        unSortIcon: true,
      },
      // {
      //   headerName: "Actions",
      //   field: "DriverID",
      //   minWidth: 420,
      //   cellRenderer: () => (
      //     <div>
      //       <>
      //         <button className="btn btn-outline-primary m-1">
      //           <FontAwesomeIcon className="pe-2" icon={faEdit} size="lg" />
      //           {/* {t("user_role")} */}
      //           edit
      //         </button>
      //         <button className="btn btn-outline-primary m-1">
      //           <FontAwesomeIcon className="pe-2" icon={faTrash} size="lg" />
      //           {/* {t("user_info")} */}
      //           delete
      //         </button>
      //         <button className="btn btn-outline-primary m-1">
      //           <FontAwesomeIcon
      //             className="pe-2"
      //             icon={faUserSlash}
      //             size="lg"
      //           />
      //           {/* {t("manage_vehicles")} */}
      //           Deactivate
      //         </button>
      //         <button className="btn btn-outline-primary m-1">
      //           <FontAwesomeIcon className="pe-2" icon={faCar} size="lg" />
      //           {/* {t("reset_password")} */}
      //           Show Vehicles
      //         </button>
      //       </>
      //     </div>
      //   ),
      // },
    ],
    [t]
  );

  // const columnsUnassigned = useMemo(
  //   () => [
  //     {
  //       headerName: `${t("Device_Serial_Number")}`,
  //       field: "PlateNumber",
  //       minWidth: 100,
  //       sortable: true,
  //       unSortIcon: true,
  //     },
  //     {
  //       headerName: `${t("Device_Type")}`,
  //       field: "TypeName",
  //       minWidth: 100,
  //       //  valueFormatter: "value?.toFixed(2)",
  //       unSortIcon: true,
  //     },
  //     {
  //       headerName: `${t("Actions")}`,
  //       field: "DriverID",
  //       minWidth: 190,
  //       cellRenderer: () => (
  //         <div>
  //           <>
  //             <button className="btn btn-outline-primary m-1">
  //               <FontAwesomeIcon className="pe-2" icon={faUserEdit} size="lg" />
  //               {t("Complete_User_Creation")}
  //             </button>
  //           </>
  //         </div>
  //       ),
  //     },
  //   ],
  //   [t]
  // );

  // columns used in unassigned ag grid
  const columnsUnAssigned = useMemo(
    () => [
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
        minWidth:300,
        cellRenderer: (params) => (
          <>
            <div>{params.value ?? "N/A"}</div>
            <div className="d-flex align-items-center  justify-content-start gap-2 optionsShow flex-wrap">
              <span
                onClick={() => {
                  setAssignModalShow(true);
                  setAssignVehicleID(params.data.VehicleID);
                }}
                className="text-primary"
              >
                {t("Assign Device")} |
              </span>
              <span
                onClick={() => {
                  setEditID(params.data.VehicleID);
                  setEditModalShow(true);
                }}
                className="text-primary"
              >
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
                className="text-primary"
              >
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
        field: "MakeYear",
        valueFormatter: (params) => params?.value ?? "N/A",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("Vehicle_Type")}`,
        field: "TypeName",
        valueFormatter: (params) => params?.value ?? "N/A",

        minWidth: 150,
        unSortIcon: true,
      },
      {
        headerName: `${t("Chassis_Number")}`,
        field: "Chassis",
        valueFormatter: (params) => params?.value ?? "N/A",

        minWidth: 120,
        unSortIcon: true,
      },
      {
        headerName: `${t("Manufacturing_Year")}`,
        field: "MakeYear",
        valueFormatter: (params) => params?.value?.slice(0, 4) ?? "N/A",

        minWidth: 120,
        sortable: true,
        unSortIcon: true,

      },
    ],
    [t]
  );

  const onFirstDataRendered = (params) => {
    params.api.paginationGoToPage(0);
  };
  // Make style for table
  const getRowStyle = (params) => {
    if (params.data.id % 2) {
      return {
        backgroundColor: "#FFE7D9",
        color: "#7A0C2E",
      };
    } else {
      return {
        backgroundColor: "#C8FACD",
        color: "#196759",
      };
    }
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      flex: 1,
      resizable: true,
      filter: true,
    };
  }, []);

  // =======================|Modal Number 2|==============================
  return (
    <div className="container-fluid">
      <Row>
        <Card>
          <Card.Body>
            <Row>
              <CardCountStart
                icon={faCar}
                iconColor="primary"
                title="Active_Vehicles"
                countEnd={vehiclesStatistics?.active_Vehicles || 0}
                desc={t("Vehicles that is currently live and send data.")}
              />
              <CardCountStart
                icon={faPlug}
                iconColor="success"
                title="Inactive_Vehicles"
                countEnd={vehiclesStatistics?.Inactive_Vehicles || 0}
                desc={t("Vehicles that didn't send any data for more than one minute.")}
              />
              <CardCountStart
                icon={faUsersCog}
                iconColor="warning"
                title="Unassigned_Devices"
                countEnd={vehiclesStatistics?.unassignedDevices || 0}
                desc={t("Devices that are Added to the system but not yet assigned to a vehicle.")}
              />
              <CardCountStart
                icon={faUserEdit}
                iconColor="info"
                title="Active_Accounts"
                countEnd={vehiclesStatistics?.activeAccounts || 0}
                desc={t("Accounts that are active on the system.")}
              />

              <Col sm="12">
                <Card>
                  <Card.Header className="d-flex justify-content-between">
                    <div className="d-flex flex-column w-100">
                      <div className="w-100 header-title d-flex justify-content-between align-items-center p-3">
                        <div>
                          <Link href="/management/AddVehicleInfo" passHref>
                            <button
                              type="button"
                              className="btn btn-primary  px-3 py-2 me-3 "
                            >
                              <FontAwesomeIcon
                                className="me-2"
                                icon={faSimCard}
                                size="sm"
                              />
                              {t("Add_Vehicle")}

                            </button>
                          </Link>

                          {/* <button
                            type="button"
                            className="btn btn-primary  px-3 py-2 me-3 "
                          // onClick={() =>
                          //   setShowMyVerticallyCenteredModal(
                          //     true
                          //   )
                          // }
                          >
                            <FontAwesomeIcon
                              className="me-2"
                              icon={faSimCard}
                              size="sm"
                            />
                            {t("Add_Vehicle_Bulk")}

                          </button> */}
                          <button
                            type="button"
                            className="btn btn-primary  px-3 py-2 me-3  add-bulk"
                            onClick={() => {
                              setBulkModel(true);
                            }}
                          >
                            <FontAwesomeIcon
                              className="me-2"
                              icon={faSimCard}
                              size="sm"
                            />
                            {t("Add_Vehicle_Bulk")}
                          </button>
                        </div>
                      </div>
                      <div>
                        <h3>{t("Assigned_Vehicles")}</h3>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <AgGridDT
                      rowHeight={rowHeight}
                      columnDefs={columnsAssigned}
                      rowData={assignedVehicles}
                      paginationNumberFormatter={function (params) {
                        return params.value.toLocaleString();
                      }}
                      onFirstDataRendered={onFirstDataRendered}
                      defaultColDef={defaultColDef}
                      onCellMouseOver={(e) =>
                        (e?.event?.target?.dataset?.test = "showActions")
                      }
                      onCellMouseOut={HideActions}
                      onGridReady={onAssigndGridReady}
                      gridApi={assignedGridApi}
                      gridColumnApi={assignedGridColumnApi}
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col sm="12">
                <Card>
                  <Card.Body>
                    <div className="w-100 card-title mb-4 h3">
                      {t("Unassigned_Vehicles")}
                    </div>
                    <div className="d-flex flex-column justify-content-end flex-wrap w-100">
                      <Form.Floating className="custom-form-floating custom-form-floating-sm form-group">
                        <Form.Control
                          type="search"
                          className=""
                          id="floatingInput5"
                          placeholder="Search..."
                        />
                        <label htmlFor="floatingInput">
                          {t("main:search")}
                        </label>
                      </Form.Floating>
                      <AgGridDT
                        rowHeight={rowHeight}
                        columnDefs={columnsUnAssigned}
                        rowData={unassignedVehicles}
                        paginationNumberFormatter={function (params) {
                          return params.value.toLocaleString();
                        }}
                        onFirstDataRendered={onFirstDataRendered}
                        defaultColDef={defaultColDef}
                        // getRowStyle={getRowStyle}
                        gridColumnApi={unassignedGridColumnApi}
                        gridApi={unassignedGridApi}
                        onGridReady={onUnassigndGridReady}
                        showNoRowsOverlay={() => t("NO_Data_Available")}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
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
      <Model
        header={t("Update Vehicle Information")}
        show={editModalShow}
        onHide={() => setEditModalShow(false)}
        updateButton={"Update"}
        footer={false}
        size={"xl"}
        className={"mt-5"}
      >
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
          redirectPath={`/management/ItemVehicleManagment/${query.id}`}
        />
      </Model>
      <Model
        header={"Assign Device to Vehicle"}
        show={assignModalShow}
        onHide={() => setAssignModalShow(false)}
        updateButton={"Update"}
        footer={false}
        size={"xl"}
        className={"mt-5"}
      >
        <AssignDevice
          handleModel={() => {
            setAssignModalShow(false);
          }}
          id={assignedVehicleID}
          updateAssignedTable={onAssigndGridReady}
          updateUnassignedTable={onUnassigndGridReady}
        />
      </Model>
      <Model
        header={t("Add_Vehicle_Bulk")}
        show={bulkModel}
        onHide={() => setBulkModel(false)}
        updateButton={t("Update")}
        footer={false}
        size={"xl"}
        className={"mt-5"}
      >
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
};
export default ItemVehicleManagment;

// translation ##################################
export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["Management", "main", "common"])),
    },
  };
}
// translation ##################################
