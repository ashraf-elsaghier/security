import { useMemo, useState, useCallback } from "react";
import { Row, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileDownload, faSimCard } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  fetchAllSims,
  fetchAllUnAssignedSims,
  postSimsBulk,
  deleteSim,
} from "services/management/SimManagement";
import HideActions from "hooks/HideActions";
import { toast } from "react-toastify";
import DeleteModal from "components/Modals/DeleteModal";
import AgGridDT from "components/AgGridDT";
import Model from "components/UI/Model";
import Bulk from "components/management/Bulk";
import Edit from "components/management/SimManagement/Edit";
import AddSimToDevice from "components/management/SimManagement/AddSimToDevice";
import { toggle as tourToggle, disableTour, enableTour } from "lib/slices/tour";
import style from "styles/scss/custom/components/tour-step/tourStep.module.scss";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import useStepDashboard from "hooks/useStepDashboard";
import { useDispatch, useSelector } from "react-redux";
import { getSession } from "next-auth/client";
import AddDeviceToSim from "components/management/DeviceManagement/AddDeviceToSim";
import { unassignSimCard } from "services/management/DeviceManagement";
// when click in download template in bulk, excel data will downloaded
const excelData = [
  {
    PhoneNumber: "",
    SimProvider: "",
    SIMSerial: "",
  },
];

const SimManagement = () => {
  const { t } = useTranslation("Management");
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState();
  const [bulkModel, setBulkModel] = useState(false);

  const [assignedSims, setAssignedSims] = useState(null);
  const [assignedGridApi, setAssignedGridApi] = useState(null);
  const [assignedGridColumnApi, setAssignedGridColumnApi] = useState(null);

  const [unassignedSims, setUnassignedSims] = useState(null);
  const [unassignedGridApi, setUnassignedGridApi] = useState(null);
  const [unassignedGridColumnApi, setUnassignedGridColumnApi] = useState(null);

  // unassign SIM from device
  const [unassignSIMModel, setUnassignSIMModel] = useState(false);
  const [unassignSIMObj, setUnassignSIMObj] = useState({});
  const [unassignSIMModelLoading, setUnassignSIMModelLoading] = useState(false);

  // assign SIM to device
  // const [assignSIMModel, setAssignSIMModel] = useState(false);
  // const [assignSIMToDeviceObj, setAssignSIMToDeviceObj] = useState({});
  const [bulkLoading, setBulkLoading] = useState(false);
  const [deleteObj, setDeleteObj] = useState({});
  const [editModalShow, setEditModalShow] = useState(false);
  const [editObj, setEditObj] = useState({});
  const [assignModalShow, setAssignModalShow] = useState(false);
  const [assignId, setAssignId] = useState("");

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
    steps: allSteps["devicesManagement"],
  });
  // fetch Assigned vehicles data
  const onAssigndGridReady = useCallback(async (params) => {
    try {
      const respond = await fetchAllSims();
      setAssignedSims(respond.result);
      setAssignedGridApi(params.api);
      setAssignedGridColumnApi(params.columnApi);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, []);

  // fetch unassigned vehicles data
  const onUnassigndGridReady = useCallback(async (params) => {
    try {
      const respond = await fetchAllUnAssignedSims();
      setUnassignedSims(respond.result);
      setUnassignedGridApi(params.api);
      setUnassignedGridColumnApi(params.columnApi);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, []);

  // delete vehicle
  const onDelete = async () => {
    setLoadingDelete(true);
    try {
      const respond = await deleteSim(deleteObj.id);
      toast.success(respond.message);
      setLoadingDelete(false);
      setShowModalDelete(false);
      if (deleteObj.isAssignTable) {
        setAssignedSims((prev) =>
          prev.filter((ele) => ele.ID !== deleteObj.id)
        );
      } else {
        setUnassignedSims((prev) =>
          prev.filter((ele) => ele.ID !== deleteObj.id)
        );
      }
    } catch (error) {
      toast.error(error.response.data?.message);
      setLoadingDelete(false);
      setShowModalDelete(false);
    }
  };

  // bulk submitted function
  const bulkDataHandler = async (data) => {
    setBulkLoading(true);
    try {
      const respond = await postSimsBulk(data);
      setBulkLoading(false);
      setBulkModel(false);
      toast.success("Bulk added successfully");
    } catch (error) {
      toast.error(error.response.data?.message);
      setBulkLoading(false);
    }
  };
  const unassignSIMToDevice = async () => {
    const submitData = {
      deviceId: unassignSIMObj.DeviceID
    };
    setUnassignSIMModelLoading(true);
    try {
      const respond = await unassignSimCard(unassignSIMObj.ID, submitData);
      onAssigndGridReady();
      onUnassigndGridReady();
      setUnassignSIMModelLoading(false);
      toast.success(respond.message);
      setUnassignSIMModel(false)
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setUnassignSIMModelLoading(false);
    }
  };

  // columns used in assigned ag grid
  const columnsAssigned = useMemo(
    () => [
      {
        headerName: `${t("SIMCard_Serial_Number")}`,
        field: "SimSerialNumber",
        sortable: true,
        unSortIcon: true,
        minWidth: 350,
        cellRenderer: (params) => (
          <>
            <div>{params.value}</div>
            <div className="d-flex justify-content-start gap-1 options flex-wrap">
              <span
                onClick={() => {
                  setEditObj(params.data);
                  setEditModalShow(true);
                }}
                className="visible"
              >
                {t("edit")}
              </span>
              <span
                onClick={() => {
                  setDeleteObj({
                    id: params.data.ID,
                    isAssignTable: true,
                  });
                  setShowModalDelete(true);
                }}
                className="visible"
              >
                | {t("delete")}
              </span>

              <span
                onClick={() => {
                  setUnassignSIMModel(true);
                  setUnassignSIMObj(params.data);
                }}
                className="visible"
              >
                | {t("Unassign SimCards")}
              </span>

            </div>
          </>
        ),
      },
      {
        headerName: `${t("Phone_Number")}`,
        field: "PhoneNumber",
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("Provider_Name")}`,
        field: "ProviderName",
        unSortIcon: true,
      },
    ],
    [t]
  );

  // columns used in unassigned ag grid
  const columnsUnassigned = useMemo(
    () => [
      {
        headerName: `${t("SIMCard_Serial_Number")}`,
        field: "SimSerialNumber",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
        cellRenderer: (params) => (
          <>
            <div>{params.value}</div>
            <div className="d-flex justify-content-start gap-1 options flex-wrap">
              <span
                onClick={() => {
                  setAssignId(params.data.ID);
                  setAssignModalShow(true);
                }}
                className="visible"

              >
                {t("Assign to Device")} |
              </span>
              <span
                onClick={() => {
                  setEditObj(params.data);
                  setEditModalShow(true);
                }}
                className="visible"
              >
                {t("edit")}
              </span>
              <span
                onClick={() => {
                  setDeleteObj({
                    id: params.data.ID,
                    isAssignTable: false,
                  });
                  setShowModalDelete(true);
                }}
                className="visible"
              >
                | {t("delete")}
              </span>
            </div>
          </>
        ),
      },
      {
        headerName: `${t("Phone Number")}`,
        field: "PhoneNumber",
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("Provider_Name")}`,
        field: "ProviderName",
        unSortIcon: true,
      },
    ],
    [t]
  );

  // default properties to ag grid
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      flex: 1,
      resizable: true,
      filter: true,
    };
  }, []);
  return (
    <div className="container-fluid manage-devices">
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
      <Card>
        <Card.Body>
          <Row>
            <h3>{t("Manage SIM Cards")}</h3>
            <Card.Header className="ps-0 d-flex justify-content-between">
              <div className="w-100 header-title d-flex justify-content-between align-items-center p-3">
                <div>
                  <Link href="/management/sim-management/add" passHref>
                    <button
                      type="button"
                      className="btn btn-primary  px-3 py-2 me-3 add-new-sim"
                    >
                      <FontAwesomeIcon
                        className="me-2"
                        icon={faSimCard}
                        size="sm"
                      />
                      {t("Add SIMCard")}
                    </button>
                  </Link>
                  <button
                    type="button"
                    className="btn btn-primary  px-3 py-2 me-3  add-bulk-sim"
                    onClick={() => {
                      setBulkModel(true);
                    }}
                  >
                    <FontAwesomeIcon
                      className="me-2"
                      icon={faSimCard}
                      size="sm"
                    />
                    {t("Add SIMCard Bulk")}
                  </button>
                </div>
              </div>
            </Card.Header>

            <DeleteModal
              show={showModalDelete}
              loading={loadingDelete}
              title={"Are you sure?"}
              description={"Are you sure you want to delete this sim card?"}
              confirmText={"Yes, delete it!"}
              cancelText={"No, cancel"}
              onConfirm={onDelete}
              onCancel={() => {
                setShowModalDelete(false);
              }}
            />
            <div className="sim-table">
              <AgGridDT
                columnDefs={columnsAssigned}
                rowData={assignedSims}
                paginationNumberFormatter={function (params) {
                  return params.value.toLocaleString();
                }}
                defaultColDef={defaultColDef}
                onGridReady={onAssigndGridReady}
                gridApi={assignedGridApi}
                gridColumnApi={assignedGridColumnApi}
                onCellMouseOver={(e) =>
                  (e?.event?.target?.dataset?.test = "showActions")
                }
                onCellMouseOut={HideActions}
              />
            </div>
            <div className="sim-table">
              <h3 className="mt-5 pt-2">{t("Unassigned_SIMCards")} </h3>
              <AgGridDT
                columnDefs={columnsUnassigned}
                rowData={unassignedSims}
                paginationNumberFormatter={function (params) {
                  return params.value.toLocaleString();
                }}
                defaultColDef={defaultColDef}
                onGridReady={onUnassigndGridReady}
                gridApi={unassignedGridApi}
                gridColumnApi={unassignedGridColumnApi}
                onCellMouseOver={(e) =>
                  (e?.event?.target?.dataset?.test = "showActions")
                }
                onCellMouseOut={HideActions}
              />
            </div>
            {/* Bulk Model */}
            <Model
              header={t("Add Sim Cards Bulk")}
              show={bulkModel}
              onHide={() => setBulkModel(false)}
              updateButton={"Update"}
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
                fileName={"SimsPatch"}
                bulkRequest={bulkDataHandler}
                loading={bulkLoading}
              />
            </Model>

            {/* Edit Model */}
            <Model
              header={"Update Sim Card Information"}
              show={editModalShow}
              onHide={() => setEditModalShow(false)}
              updateButton={"Update"}
              footer={false}
              size={"lg"}
              className={"mt-5"}
            >
              <Edit
                handleModel={() => {
                  setEditModalShow(false);
                }}
                editObj={editObj}
                updateAssignedTable={onAssigndGridReady}
                updateUnassignedTable={onUnassigndGridReady}
              />
            </Model>


            {/* unassign SIM from device */}

            <Model
              header={t("Unassign SIM card")}
              show={unassignSIMModel}
              onHide={() => setUnassignSIMModel(false)}
              updateButton={t("Unassign")}
              size={"xl"}
              className={"mt-5"}
              onUpdate={unassignSIMToDevice}
              disabled={unassignSIMModelLoading}
            >
              <h4 className="text-center">
                {t('Are You Sure You Want to Unassign This SIM Card?')}
              </h4>
            </Model>

















            {/* assign sim Model */}
            <Model
              header={"Assign Sim Card Number to the Device"}
              show={assignModalShow}
              onHide={() => setAssignModalShow(false)}
              updateButton={"Update"}
              footer={false}
              size={"lg"}
              className={"mt-5"}
            >
              <AddSimToDevice
                handleModel={() => {
                  setAssignModalShow(false);
                }}
                id={assignId}
                updateAssignedTable={onAssigndGridReady}
                updateUnassignedTable={onUnassigndGridReady}
              />
            </Model>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SimManagement;

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
      ...(await serverSideTranslations(context.locale, ["main", "Management", "Tour", "common"])),
    },
  };
}