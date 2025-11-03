import React, { useMemo, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  Card,
  Col,
  Modal,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { useTranslation } from "next-i18next";
import AgGridDT from "components/AgGridDT";
import { getSession } from "next-auth/client";
import SupportHeader from "components/support-representative/SupportHeader";
import axios from "axios";
import { toast } from "react-toastify";
import { popupData } from "components/maps/Resources";
import { useSelector } from "react-redux";
import PopupActions from "components/support-representative/PopupActions";
import Spinner from "components/UI/Spinner";
import StreamHelper from "helpers/streamHelper";
import dynamic from "next/dynamic";

const TrackMap = dynamic(
  () => import("components/support-representative/TrackMap"),
  { ssr: false }
);
const ReportsContent = dynamic(
  () => import("components/history/ReportsContent"),
  { ssr: false }
);
function Index({ reportData }) {
  console.log("====================================");
  console.log(reportData);
  console.log("====================================");
  const [searchParam, setSearchParam] = useState("");
  const { CalcVstatus } = StreamHelper();
  const [activeFilter, setActiveFilter] = useState(null);
  const [accountData, setAccountData] = useState([]);
  const [vehiclesData, setVehiclesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [vehiclePopupData, setVehiclePopupData] = useState([]);
  const [popupVehicle, setPopupVehicle] = useState("");
  const [showColumnState, setShowColumnState] = useState("");
  const [reportVehicles, setReportVehicles] = useState([]);
  const onHide = () => setModalShow(false);
  const darkMode = useSelector((state) => state.config.darkMode);

  const Dark = darkMode ? "bg-dark" : "";
  const searchOptions = [
    { displayText: "serial Number", id: 2, value: "serialNumber" },
    { displayText: "plate Number", id: 3, value: "plateNumber" },
    { displayText: "User Email", id: 4, value: "userEmail" },
    { displayText: "Account Email", id: 5, value: "accountEmail" },
    { displayText: "Cr.", id: 6, value: "mainCr" },
    { displayText: "Account Name", id: 7, value: "accountName" },
    { displayText: "Phone Number", id: 8, value: "phoneNumber" },
    { displayText: "Username", id: 9, value: "username" },
    { displayText: "displayName", id: 10, value: "displayName" },
    { displayText: "accountId", id: 12, value: "accountId" },
  ];
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.get(
        `/support/mobilysearch?${activeFilter}=${searchParam}`
      );
      setAccountData(res.data.accounts);
      setVehiclesData(res.data.vehicles);
      setShowColumnState(activeFilter);
    } catch (error) {
      toast.error(error?.response?.data?.message ?? "Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };
  const handleAccountVehicle = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/support/mobily/getaccountvehs?accountId=${id}`
      );
      const accVehicles = res.data.vehicles;
      const seen = new Set();
      const uniqueArray = [];
      const length = accVehicles.length;
      for (let i = 0; i < length; i++) {
        const vehicle = accVehicles[i];
        const vehicleId = vehicle.VehicleID;
        if (!seen.has(vehicleId)) {
          seen.add(vehicleId);
          uniqueArray.push({
            ...vehicle,
            GroupID: null,
            GroupName: null,
            ParentGroupID: null,
          });
        }
      }
      setReportVehicles(uniqueArray);
      setVehiclesData(accVehicles);
    } catch (error) {
      toast.error(error?.response?.data?.message ?? "Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };
  const fetchRedisData = async (serialNumbers) => {
    try {
      const res = await axios.post("/vehicles/lastUpdateBySerials", {
        lite: 0,
        serialNumbers: [serialNumbers],
      });
      return res.data[0];
    } catch (error) {
      console.log(error);
    }
  };
  const showVehicleLastRecord = async (vehicle) => {
    try {
      setVehiclePopupData([]);
      setPopupVehicle(null);
      setLoading(true);
      setModalShow(true);
      const data = await fetchRedisData(vehicle.SerialNumber);
      const newData = {
        ...vehicle,
        ...data,
        VehicleStatus: CalcVstatus({ ...vehicle, ...data }),
      };
      const veh = popupData(newData);
      setPopupVehicle(newData);
      setVehiclePopupData(veh);
    } catch (error) {
      toast.error(error?.response?.data?.message ?? "Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };
  const updateModalData = (newData) => {
    const veh = popupData(newData);
    setPopupVehicle(newData);
    setVehiclePopupData(veh);
  };
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const { t } = useTranslation(["Table", "common"]);
  const onGridReady = async (params) => {
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
  const userFilterKeys = ["userEmail", "phoneNumber", "username"];
  const AccColumns = useMemo(
    () => [
      {
        headerName: `${t("accountId")}`,
        field: "accountId",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("accountName")}`,
        field: "accountName",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
        valueGetter: (params) => params.data.accountName ?? "N/A",
      },
      {
        headerName: `${t("emailAddress")}`,
        field: "emailAddress",
        valueGetter: (params) => params.data.emailAddress ?? "N/A",
      },
      {
        headerName: `${t("useremail")}`,
        field: "userEmail",
        valueGetter: (params) =>
          params.data.userEmail ? params.data.userEmail : "N/A",
        hide: !userFilterKeys.includes(activeFilter),
      },
      {
        headerName: `${t("username")}`,
        field: "username",
        valueGetter: (params) => params.data.username ?? "N/A",
        hide: !userFilterKeys.includes(activeFilter),
      },

      {
        headerName: `${t("Action")}`,
        cellRenderer: (params) => (
          <>
            <button
              className="btn  p-0"
              disabled={loading}
              onClick={() => handleAccountVehicle(params.data.accountId)}
            >
              <span
                className="text-decoration-underline"
                style={{ color: "#2855AE" }}
              >
                {t("View_Account_Vehicles")}
              </span>
            </button>
          </>
        ),
        minWidth: 150,
        sortable: false,
        filter: false,
      },
    ],
    [t, showColumnState, loading]
  );
  const vehicleColumns = [
    {
      headerName: `${t("Display_Name")}`,
      field: "DisplayName",
      minWidth: 150,
      sortable: true,
      unSortIcon: true,
      valueGetter: (params) => params.data.DisplayName ?? "N/A",
    },
    {
      headerName: `${t("DriverID")}`,
      field: "DriverID",
      minWidth: 150,
      sortable: true,
      unSortIcon: true,
      valueGetter: (params) => params.data.DriverID ?? "N/A",
    },
    {
      headerName: `${t("Mileage")}`,
      field: "Mileage",
      minWidth: 150,
      valueGetter: (params) => params.data.Mileage ?? "N/A",
    },
    {
      headerName: `${t("Over_Speed")}`,
      field: "OverSpeed",
      minWidth: 150,
      valueGetter: (params) =>
        params.data.OverSpeed === true
          ? "true"
          : params.data.OverSpeed === false
          ? "false"
          : "N/A",
    },
    {
      headerName: `${t("Plate_Number")}`,
      field: "PlateNumber",
      minWidth: 150,
      valueGetter: (params) => params.data.PlateNumber ?? "N/A",
    },
    {
      headerName: `${t("PowerCutOff")}`,
      field: "PowerCutOff",
      minWidth: 150,
      valueGetter: (params) =>
        params.data.PowerCutOff === true
          ? "true"
          : params.data.PowerCutOff === false
          ? "false"
          : "N/A",
    },
    {
      headerName: `${t("Serial_Number")}`,
      field: "SerialNumber",
      minWidth: 150,
      valueGetter: (params) => params.data.SerialNumber ?? "N/A",
    },
    {
      headerName: `${t("SoSHighJack")}`,
      field: "SoSHighJack",
      minWidth: 150,
      valueGetter: (params) =>
        params.data.SoSHighJack === true
          ? "true"
          : params.data.SoSHighJack === false
          ? "false"
          : "N/A",
    },
    {
      headerName: `${t("Speed")}`,
      field: "Speed",
      minWidth: 150,
      valueGetter: (params) => params.data.Speed ?? "N/A",
    },
    {
      headerName: `${t("VehicleID")}`,
      field: "VehicleID",
      minWidth: 150,
    },
    {
      headerName: `${t("Action")}`,
      cellRenderer: (params) => (
        <>
          <button
            className="btn   p-0"
            disabled={loading}
            onClick={() => showVehicleLastRecord(params.data)}
          >
            <span
              className="text-decoration-underline  "
              style={{ color: "#2855AE" }}
            >
              View
            </span>
          </button>
        </>
      ),
      minWidth: 150,
      sortable: false,
      filter: false,
    },
  ];
  return (
    <section className="representative-section">
      <SupportHeader
        setSearchParam={setSearchParam}
        handleSearch={handleSearch}
        loading={loading}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        searchOptions={searchOptions}
        searchParam={searchParam}
      />
      <div className="container-fluid mt-3">
        <Row>
          <Card className="my-5">
            <Card.Body>
              <AgGridDT
                enableRtl={localStorage?.language === "ar"}
                rowHeight={65}
                columnDefs={AccColumns}
                rowData={accountData}
                paginationNumberFormatter={function (params) {
                  return params.value.toLocaleString();
                }}
                defaultColDef={defaultColDef}
                onGridReady={onGridReady}
                gridApi={gridApi}
                gridColumnApi={gridColumnApi}
                loading={loading}
              />
            </Card.Body>
          </Card>
          <Card className="my-5">
            <Card.Body>
              <AgGridDT
                enableRtl={localStorage?.language === "ar"}
                rowHeight={65}
                columnDefs={vehicleColumns}
                rowData={vehiclesData}
                loading={loading}
                paginationNumberFormatter={function (params) {
                  return params.value.toLocaleString();
                }}
                defaultColDef={defaultColDef}
                onGridReady={onGridReady}
                gridApi={gridApi}
                gridColumnApi={gridColumnApi}
              />
            </Card.Body>
          </Card>
        </Row>
        <Row>
          <div className="my-5 px-3">
            <h3 className="mb-3">Reports</h3>
            <div>
              {reportData.length > 0 && reportVehicles.length > 0 && (
                <ReportsContent
                  dataSideBar={reportData}
                  treeData={reportVehicles}
                  setTreeData={setReportVehicles}
                  fromSupport={true}
                />
              )}
            </div>
          </div>
        </Row>
        <Modal
          show={modalShow}
          onHide={onHide}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className={`px-2 modal representative-modal `}
          size="xl"
        >
          {vehiclePopupData.length > 0 && (
            <>
              {loading && <Spinner />}
              <Modal.Header
                closeButton
                className={` ${Dark} d-flex justify-content-center w-100 border-0 pb-4`}
              >
                <Modal.Title
                  as={"h6"}
                  id="contained-modal-title-vcenter "
                  style={{ fontSize: "18px" }}
                >
                  {popupVehicle.DisplayName}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className={`${Dark} pt-0`}>
                <Row className="p-3">
                  <Col sm="12" lg="7" xl="8">
                    {popupVehicle && (
                      <TrackMap
                        vehicleData={popupVehicle}
                        updateModalData={updateModalData}
                      />
                    )}
                  </Col>
                  <Col sm="12" lg="5" xl="4">
                    <Row>
                      {vehiclePopupData.map((key, index) => (
                        <OverlayTrigger
                          placement="left"
                          overlay={
                            <Tooltip id={`tooltip-${index}`}>
                              {t(key.Tooltip)}
                            </Tooltip>
                          }
                        >
                          <Col
                            sm={`${key.Tooltip === "Address" ? "12" : "6"}`}
                            className={`px-0 py-2 ${
                              index === vehiclePopupData.length - 1
                                ? ""
                                : "border-bottom"
                            }`}
                          >
                            <p className="d-flex align-items-center gap-2 h-100">
                              <i className={`${key.icon}`}></i>
                              <span className="ms-1">{key.val}</span>
                            </p>
                          </Col>
                        </OverlayTrigger>
                      ))}
                    </Row>
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer className={`${Dark} pb-3`}>
                <PopupActions selectedVehicles={popupVehicle} />
              </Modal.Footer>
            </>
          )}
        </Modal>
      </div>
    </section>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const userRole = session?.user?.user?.role?.toLowerCase();
  if (userRole !== "supportrepresentative") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  let reportData = null;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/management/users/reports`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.user?.new_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      reportData = await response.json();
      const groupedReports = {};

      reportData?.reports.forEach((report, index) => {
        const {
          ReportCategory,
          imgGreen,
          imgWhite,
          ReportName,
          ReportApi,
          DateStatus,
        } = report;

        if (!groupedReports[ReportCategory]) {
          groupedReports[ReportCategory] = {
            id: index + 1,
            imgGreen,
            imgWhite,
            title: `${ReportCategory}_reports_key`,
            subTitle: [],
          };
        }

        groupedReports[ReportCategory].subTitle.push({
          id: report.ReportId,
          name: ReportName,
          api: ReportApi,
          dateStatus: DateStatus ? "two" : "one",
          pagination: true,
        });
      });
      const reportsData = Object.values(groupedReports).sort(
        (a, b) => a.id - b.id
      );
      reportData = reportsData;
    } else {
      throw new Error(`Failed to fetch report data: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching report data:", error);
  }
  if (reportData) {
    reportData.forEach((report) => {
      report.subTitle.sort((a, b) => a.id - b.id);
    });
  }

  return {
    props: {
      reportData: reportData || [],
      locale: context.locale,
      ...(await serverSideTranslations(context.locale, [
        "Table",
        "main",
        "common",
        "reports",
        "preventiveMaintenance",
        "Tour",
      ])),
    },
  };
}

export default Index;
