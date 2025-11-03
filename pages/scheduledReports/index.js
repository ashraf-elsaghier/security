import { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Row, Col, Button, Card } from "react-bootstrap";
import * as lodash from "lodash";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faUser,
  faEdit,
  faTrash,
  faUserSlash,
  faCar,
} from "@fortawesome/free-solid-svg-icons";
import { convertJsonToExcel } from "../../helpers/helpers";

import Link from "next/link";
import DeleteModal from "components/Modals/DeleteModal";
import UsersModal from "components/Modals/UsersModal";
import VehiclesModal from "components/Modals/VehiclesModal";
import { getSession } from "next-auth/client";

import { toast } from "react-toastify";
import AgGridDT from "components/AgGridDT";
import { useRouter } from "next/router";
import {
  fetchAllScheduledReports,
  deactivateReport,
  activateReport,
  fetchAllUserVehicles,
  fetchAllUsers,
  deleteReport,
} from "services/scheduledReports";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toggle as tourToggle, disableTour } from "lib/slices/tour";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import style from "styles/scss/custom/components/tour-step/tourStep.module.scss";
import useStepDashboard from "hooks/useStepDashboard";
import { encryptName } from "helpers/encryptions";

const ScheduledReports = () => {
  const { t } = useTranslation([
    "scheduledReports",
    "common",
    "main",
    "Management",
    "Tour",
  ]);
  const { vehData } = JSON.parse(
    localStorage.getItem(encryptName("userData")) ?? "{}"
  );
  const userInfos = useSelector((state) => state?.userInfo);
  const [showModalDelete, setshowModalDelete] = useState(false);
  const [showModalUsers, setshowModalUsers] = useState(false);
  const [showModalVehicles, setshowModalVehicles] = useState(false);
  const [loadingDelete, setloadingDelete] = useState();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowsSelected, setrowsSelected] = useState([]);
  const [DataTable, setDataTable] = useState([]);
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const allSteps = useStepDashboard();
  const tourState = useSelector((state) => state.tour.run);
  const [{ stepIndex, steps }, setState] = useState({
    stepIndex: 0,
    steps: allSteps["scheduledReports"],
  });
  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setState({ stepIndex: 0, steps: steps });
      dispatch(tourToggle());
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

      if (index === 11 && action === ACTIONS.PREV) {
        setToggleMinuTrack((prev) => !prev);
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
  // fetch All scheduled reports
  const fetchAllScheduledReportsData = async () => {
    const response = await fetchAllScheduledReports();
    const data = response?.userReport;
    setDataTable(data.reverse());
  };
  useEffect(() => {
    fetchAllScheduledReportsData();
  }, []);

  const onGridReady = useCallback(async (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  }, []);

  // delete selected data
  const deleteSelectedReport = rowsSelected?.map((row) => row._id);

  const [deleteSelectedReportString, setDeleteSelectedReportString] =
    useState();

  // the default setting of the AG grid table .. sort , filter , etc...
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      flex: 1,
      resizable: true,
      filter: true,
    };
  }, []);

  const onDeleteSelected = async (params) => {
    setshowModalDelete(true);

    if (rowsSelected?.length > 0) {
      setDeleteSelectedReportString(deleteSelectedReport);
    } else {
      setDeleteSelectedReportString(params.data._id);
    }
  };

  const onDelete = async () => {
    if (!deleteSelectedReportString) return;
    setloadingDelete(true);
    try {
      const deletedSelectedReport = await deleteReport(
        deleteSelectedReportString
      );

      if (deletedSelectedReport.message == "deleted") {
        // for one selected item
        if (
          rowsSelected.length === 1 ||
          typeof deleteSelectedReportString == "string"
        ) {
          const filteredData = DataTable?.filter((report, idx) => {
            return typeof deleteSelectedReportString === "object"
              ? deleteSelectedReportString[0] !== report._id
              : deleteSelectedReportString !== report._id;
          });
          setDataTable(filteredData);
        } else {
          // for multi selected deleted items
          let DataAfterMultiSelectedDeletedItems = DataTable.filter(
            (item) => !deleteSelectedReportString.includes(item._id)
          );
          setDataTable(DataAfterMultiSelectedDeletedItems);
        }

        toast.success(t("Report_Deleted_Successfully"));
        setDataTable(filteredData);
        setloadingDelete(false);
        setshowModalDelete(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setloadingDelete(false);
      setshowModalDelete(false);
    } finally {
      setrowsSelected([]);
      setDeleteSelectedReportString([]);
    }
  };

  const deactiveHandler = (e) => {
    e.data.disabled
      ? activateReport(e.data._id).then((res) => {
          toast.success(t("Report_Activated_Successfully"));
          fetchAllScheduledReportsData();
          setrowsSelected([]);
        })
      : deactivateReport(e.data._id).then((res) => {
          toast.success(t("Report_Deactivated_Successfully"));
          fetchAllScheduledReportsData();
          setrowsSelected([]);
        });
  };

  const showVehicles = useCallback(async (e) => {
    setshowModalVehicles(true);
    // const response = await fetchAllUserVehicles();
    const ids = new Set(e);
    setVehicles(vehData?.filter((vehicle) => ids.has(vehicle.VehicleID)));
  }, []);

  const fetchUsers = useCallback(async (e) => {
    setLoadingUsers(true);
    setshowModalUsers(true);
    const response = await fetchAllUsers();
    setUsers(response.users.filter((user) => e.includes(user.ProfileID)));
    setLoadingUsers(false);
  }, []);

  const DownloadReport = async (report) => {
    try {
      toast.info(t("Downloading_Report"));
      const responce = await axios.get(
        `/dashboard/reports/download/${report?._id}`
      );
      if (responce?.data?.result.length > 0) {
        convertJsonToExcel(responce?.data?.result ?? [], "Report Data");
        toast.success(t("Report_Downloaded_Successfully"));
      } else {
        toast.info(t("No_Data_Found"));
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  // columns
  const columns = useMemo(
    () => [
      {
        headerName: "",
        field: "Select",
        maxWidth: 50,
        sortable: false,
        unSortIcon: false,
        checkboxSelection: true,
        headerCheckboxSelection: true,
      },
      {
        headerName: `${t("Reports_Type")}`,
        field: "data.reportName",
        minWidth: 440,
        sortable: true,
        unSortIcon: true,
        cellRenderer: (params) => {
          return (
            <>
              {!lodash.isEmpty(userInfos) && (
                <div className="py-1">
                  <div
                    style={{
                      lineHeight: "20px",
                    }}
                    className="mb-1"
                  >
                    {t(params.value)}
                  </div>
                  <div className="d-flex align-items-center gap-13px">
                    <button
                      className="btn text-primary delete-button"
                      onClick={() => {
                        onDeleteSelected(params);
                      }}
                    >
                      {t("delete")}
                    </button>
                    <button
                      className="btn text-primary edit-button"
                      onClick={() => {
                        router.push({
                          pathname: "/scheduledReports/edit/[id]",
                          query: { id: params.data._id },
                        });
                      }}
                    >
                      {t("edit")}
                    </button>
                    <button
                      className="btn text-primary  activate-button"
                      onClick={() => deactiveHandler(params)}
                      disabled={params.data.disabled === null}
                    >
                      {params.data.disabled ? t("activate") : t("deactivate")}
                    </button>

                    <button
                      className="btn text-primary vec-button"
                      onClick={() => {
                        showVehicles(params.data?.data?.vehID);
                      }}
                    >
                      {t("Show_Vehicles")}
                    </button>
                    <button
                      className="btn text-primary users-button"
                      onClick={() => {
                        fetchUsers(params.data?.data?.ScheduleUserIds);
                      }}
                    >
                      {t("Show_Users")}
                    </button>

                    <button
                      className="btn text-primary download-button"
                      onClick={() => {
                        DownloadReport(params.data);
                      }}
                    >
                      {t("Download")}
                    </button>
                  </div>
                </div>
              )}
            </>
          );
        },
      },
      {
        headerName: `${t("Frequency_Type")}`,
        field: "data.FrequencyTitle",
        minWidth: 130,
        maxWidth: 140,
        valueGetter: (params) => t(params?.data?.data?.FrequencyTitle),
      },
      {
        headerName: `${t("Number_of_Vehicles")}`,
        field: "data.vehID.length",
        valueFormatter: (params) => params?.value?.length,
        minWidth: 150,
        maxWidth: 150,
      },

      {
        headerName: `${t("Last_Run")}`,
        field: "lastRunAt",

        valueGetter: (params) =>
          params?.data?.lastRunAt &&
          moment(params?.data?.lastRunAt).format("YYYY-MM-DD / h:mm a"),
        minWidth: 150,
        maxWidth: 200,
      },
      {
        headerName: `${t("Next_Run")}`,
        field: "nextRunAt",

        valueGetter: (params) =>
          params?.data?.nextRunAt &&
          moment(params?.data?.nextRunAt).format("YYYY-MM-DD / h:mm a"),
        minWidth: 180,
        maxWidth: 200,
      },
      {
        headerName: `${t("Additional_Emails")}`,
        field: "data.to",
        valueGetter: (params) => params.data.data.to.join(","),
        minWidth: 250,
        sortable: true,
        unSortIcon: true,
      },

      {
        headerName: `${t("Description")}`,
        field: "data.Description",

        minWidth: 160,
        maxWidth: 170,
        sortable: true,
        unSortIcon: true,
      },
    ],
    [t]
  );

  return (
    <div className="container-fluid" id="locate">
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
            // padding: "16px",
            backgroundColor: "#E0EAE9",
          },
        }}
      />
      <Row>
        <Col sm="12">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-center justify-content-md-between flex-wrap">
                <div className="d-flex justify-content-center flex-wrap mb-4">
                  <Link href="/scheduledReports/add">
                    <a>
                      <Button
                        variant="primary py-1 px-2 d-flex align-items-center"
                        className="m-1"
                        style={{ fontSize: "13px" }}
                        id="add-report"
                      >
                        <FontAwesomeIcon
                          className="me-2"
                          icon={faCog}
                          size="sm"
                        />
                        {t("Add_Scheduled_Report")}
                      </Button>
                    </a>
                  </Link>

                  <Button
                    disabled={!rowsSelected.length}
                    variant="primary p-1 d-flex align-items-center"
                    className="m-1"
                    style={{ fontSize: "13px" }}
                    onClick={onDeleteSelected}
                    id="delete-report"
                  >
                    <FontAwesomeIcon
                      className="me-2"
                      icon={faTrash}
                      size="sm"
                    />
                    {t("Delete Selected")}
                  </Button>
                </div>
              </div>
              <div id={"reports-data"}>
                <AgGridDT
                  rowHeight={65}
                  columnDefs={columns}
                  rowSelection={"multiple"}
                  rowMultiSelectWithClick={"true"}
                  onSelectionChanged={(e) =>
                    setrowsSelected([...e.api.getSelectedRows()])
                  }
                  suppressRowClickSelection
                  defaultColDef={defaultColDef}
                  onGridReady={onGridReady}
                  gridApi={gridApi}
                  gridColumnApi={gridColumnApi}
                  rowData={DataTable}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <DeleteModal
        show={showModalDelete}
        loading={loadingDelete}
        title={t("Delete_Scheduled_Report")}
        // description={
        //   deleteSelectedDate.length === 1
        //   ? t("are_you_sure_you_want_to_delete_this_maintenance_plan?")
        //   : t("are_you_sure_you_want_to_delete_the_maintenance_plans?")
        // }
        description={t("asking_for_delete")}
        confirmText={t("Yes,delete!")}
        cancelText={t("No,cancel")}
        onConfirm={onDelete}
        onCancel={() => {
          setshowModalDelete(false);
        }}
      />

      <UsersModal
        show={showModalUsers}
        onCancel={() => {
          setshowModalUsers(false);
          setUsers([]);
        }}
        users={users}
        loadingUsers={loadingUsers}
      />

      <VehiclesModal
        show={showModalVehicles}
        onCancel={() => {
          setshowModalVehicles(false);
          setVehicles([]);
        }}
        vehicles={vehicles}
      />
    </div>
  );
};

export default ScheduledReports;

// translation ##################################
export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const userRole = session?.user?.user?.role?.toLowerCase();
  if (userRole == "support" || userRole == "user") {
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
        "scheduledReports",
        "common",
        "main",
        "Tour",
      ])),
    },
  };
}
