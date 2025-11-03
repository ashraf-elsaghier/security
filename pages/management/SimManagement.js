import { useEffect, useMemo, useState } from "react";
import { Row, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faFileExport,
  faSimCard,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { fetchAllSimCards, fetchData } from "../../helpers/helpers";
import axios from "axios";
import { toast } from "react-toastify";
import DeleteModal from "../../components/Modals/DeleteModal";
import AgGridDT from "../../components/AgGridDT";
import { getSession } from "next-auth/client";

const SimManagement = () => {
  const { t } = useTranslation("Management");
  const allDataSimCard = useSelector((state) => state?.simCard);
  const [, setLoading] = useState(false);

  const [, /* gridColumnApi */ setGridColumnApi] = useState(null);

  const [gridApi, setGridApi] = useState(null);
  const [gridApiUnassigned] = useState(null);
  const [allDataGrid, setAllDataGrid] = useState([]);
  const [unassignedDevices, setUnassignedDevices] = useState([]);

  const [showModalDelete, setshowModalDelete] = useState(false);
  const [loadingDelete, setloadingDelete] = useState();
  const [Driver, setDriver] = useState({});
  useEffect(() => {
    allDataSimCard?.length === 0 &&
      fetchAllSimCards(setLoading, setAllDataGrid);
    unassignedDevices?.length === 0 &&
      fetchData(
        setLoading,
        setUnassignedDevices,
        `/dashboard/management/sim/unassigned`
      );
  }, [allDataSimCard]);

  const onDelete = async () => {
    setloadingDelete(true);
    await axios
      .delete(`/dashboard/management/sim/${Driver.ID}`)
      .then(() => toast.success(Driver.FirstName + " deleted successfully"))
      .catch((error) => toast.error("Error: " + error?.message))
      .finally(() => {
        setloadingDelete(false);
        setshowModalDelete(false);
      });
  };

  const columns = useMemo(
    () => [
      {
        headerName: `${t("SIMCard_Serial_Number")}`,
        field: "SimSerialNumber",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("Phone Number")}`,
        field: "PhoneNumber",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("Provider_Name")}`,
        field: "Provider Name",
        minWidth: 150,
        // valueFormatter:
        //   'value?.slice(5).replace("T", " ").replace(".000Z", "")',
        unSortIcon: true,
      },
      {
        headerName: "Actions",
        field: "ID",
        minWidth: 440,
        cellRenderer: (params) => (
          <div>
            <button className="btn btn-outline-primary m-1">
              <FontAwesomeIcon className="pe-2" icon={faEdit} size="lg" />
              {/* {t("user_role")} */}
              edit
            </button>
            <button
              className="btn btn-outline-primary m-1"
              onClick={() => {
                setshowModalDelete(true);
                setDriver(params.data);
              }}
            >
              <FontAwesomeIcon className="pe-2" icon={faTrash} size="lg" />
              delete
            </button>
          </div>
        ),
      },
    ],
    [t, allDataSimCard]
  );

  const columnsUnassigned = useMemo(
    () => [
      {
        headerName: `${t("Device_Serial_Number")}`,
        field: "SimSerialNumber",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("Device Type")}`,
        field: "SimSerialNumber",
        minWidth: 120,
        //  valueFormatter: "value?.toFixed(2)",
        unSortIcon: true,
      },
      {
        headerName: "Actions",
        field: "DriverID",
        minWidth: 200,
        cellRenderer: () => (
          <div>
            <button className="btn btn-outline-primary m-1">
              <FontAwesomeIcon className="pe-2" icon={faEdit} size="lg" />
              {/* {t("manage_vehicles")} */}
              Assin to Device
            </button>
            <button className="btn btn-outline-primary m-1">
              <FontAwesomeIcon className="pe-2" icon={faEdit} size="lg" />
              {/* {t("user_role")} */}
              edit
            </button>
            <button className="btn btn-outline-primary m-1">
              <FontAwesomeIcon className="pe-2" icon={faTrash} size="lg" />
              {/* {t("user_info")} */}
              delete
            </button>
          </div>
        ),
      },
    ],
    [t, allDataSimCard]
  );

  const onFirstDataRendered = (params) => {
    params.api.paginationGoToPage(0);
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  //the export btn func
  const onBtnExport = () => {
    gridApi.exportDataAsCsv();
  };

  const onBtnExportUnassigned = () => {
    gridApiUnassigned.exportDataAsCsv();
  };
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      flex: 1,
      resizable: true,
      filter: true,
    };
  }, []);

  return (
    <div className="container-fluid">
      <Card>
        <Card.Body>
          <Row>
            <h4>Manage SIMCards</h4>
            <Card.Header className="d-flex justify-content-between">
              <div className="w-100 header-title d-flex justify-content-between align-items-center p-3">
                <div>
                  <Link href="/management/AddSimCard" passHref>
                    <button
                      type="button"
                      className="btn btn-primary  px-3 py-2 me-3 "
                    >
                      <FontAwesomeIcon
                        className="me-2"
                        icon={faSimCard}
                        size="sm"
                      />
                      Add SIMCard
                    </button>
                  </Link>

                  <button
                    type="button"
                    className="btn btn-primary  px-3 py-2 me-3 "
                  >
                    <FontAwesomeIcon
                      className="me-2"
                      icon={faSimCard}
                      size="sm"
                    />
                    Add SIMCard Bulk
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary  px-3 py-2 me-3 "
                    onClick={onBtnExport}
                  >
                    <FontAwesomeIcon
                      className="me-2"
                      icon={faFileExport}
                      size="sm"
                    />
                    Export Assigned SIMCards
                  </button>
                </div>
              </div>
            </Card.Header>

            <DeleteModal
              show={showModalDelete}
              loading={loadingDelete}
              // title={"Are you sure?"}
              // description={"Are you sure you want to delete this table?"}
              // confirmText={"Yes, delete it!"}
              // cancelText={"No, cancel"}
              onConfirm={onDelete}
              onCancel={() => {
                setshowModalDelete(false);
                setDriver({});
              }}
            />

            <AgGridDT
              columnDefs={columns}
              rowData={allDataGrid}
              paginationNumberFormatter={function (params) {
                return params.value.toLocaleString();
              }}
              onFirstDataRendered={onFirstDataRendered}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              overlayNoRowsTemplate="Loading..."
            />

            <h4>{t("Unassigned_SIMCards")}</h4>
            <Card.Header className="d-flex justify-content-between">
              <div className="w-100 header-title d-flex justify-content-between align-items-center p-3">
                <div>
                  <button
                    type="button"
                    className="btn btn-primary  px-3 py-2 me-3"
                    onClick={onBtnExportUnassigned}
                  >
                    <FontAwesomeIcon
                      className="me-2"
                      icon={faFileExport}
                      size="sm"
                    />
                    {t("Export_Unassigned_SIMCards")}
                  </button>
                </div>
              </div>
            </Card.Header>
            <AgGridDT
              columnDefs={columnsUnassigned}
              rowData={unassignedDevices}
              paginationNumberFormatter={function (params) {
                return params.value.toLocaleString();
              }}
              onFirstDataRendered={onFirstDataRendered}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              overlayNoRowsTemplate="Loading..."
            />
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
}
