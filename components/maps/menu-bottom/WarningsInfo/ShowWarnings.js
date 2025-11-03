import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { Button } from "react-bootstrap";
import AgGridDT from "../../../AgGridDT";
import HideActions from "hooks/HideActions";
import DeleteModal from "../../../Modals/DeleteModal";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import moment from "moment";

const ShowWarnings = ({
  Data_table,
  setData_table,

  setShowViewWarningModal,
  setShowAddWarningModal,
}) => {
  const L = require("leaflet");

  const { darkMode } = useSelector((state) => state.config);
  const { t } = useTranslation("Table");
  const { myMap } = useSelector((state) => state.mainMap);

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [loading, setLoading] = useState(false);

  const { locale } = useRouter();

  const warning = {
    6: "power cut off",
    8: "Power From internal Battery",
  }
  // 

  //first page to render in the AG grid table
  const onFirstDataRendered = (params) => params.api.paginationGoToPage(0);

  //the setting of the AG grid table .. sort , filter , etc...
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      flex: 1,
      resizable: true,
      filter: true,
    };
  }, []);

  //set the Api of the AG grid table
  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const handleRecordDateTime = (params) => {
    return moment(params?.data?.RecordDateTime)
      .utc()
      .local()
      .format("MMMM D, YYYY h:mm:ss a");
  };

  const columns = useMemo(
    () => [
      {
        headerName: `${t("PlateNumber")}`,
        field: "PlateNumber",
        comparator: (valueA, valueB) => {
          const isValueANumber = !isNaN(valueA);
          const isValueBNumber = !isNaN(valueB);
          if (isValueANumber && isValueBNumber) {
            return valueA - valueB;
          } else if (!isValueANumber && !isValueBNumber) {
            return valueA.localeCompare(valueB);
          } else if (isValueANumber && !isValueBNumber) {
            return -1;
          } else {
            return 1;
          }
        },
        cellRenderer: (params) => (
          <>
            <a>{params.value}</a>
            <div className="d-flex gap-2  options">
              <span className=""> {t("Reset")}</span>
            </div>
          </>
        ),
      },
      {
        headerName: `${t("Time")}`,
        field: "RecordDateTime",
        valueGetter: handleRecordDateTime,
      },

      {
        headerName: `${t("Address")}`,
        field: "Address",
      },

      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Type")}`,
        field: "AlarmType",
        valueGetter: (param) => t(param.data.AlarmType)
      },
    ],
    [t]
  );

  useEffect(() => {
    if (!Data_table?.length) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axios.get("geofences/warnings");
          setData_table(response?.data?.warnings);
        } catch (error) {
          toast.error(error?.response?.data?.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, []);

  const handleAddModal = () => {
    myMap?.groups?.markerGroup.clearLayers();
    setShowAddWarningModal(true);
  };

  return (
    <div
      className="pb-3 add_geofence_track_page"
      style={{
        left: locale === "ar" ? "20px" : "auto",
        right: locale === "ar" ? "auto" : "20px",
        background: darkMode ? "#222738" : "#FFFFFF",
      }}
    >
      {/* <Modal.Body> */}
      <div className="d-flex justify-content-center justify-content-md-between flex-wrap">
        <div className="d-flex justify-content-between flex-wrap mb-4 w-100">
          <Button
            variant="primary p-1 d-flex align-items-center"
            className="mx-2 px-3 py-1 m-2 bg-primary"
            size="lg"
            style={{ fontSize: "13px", width: "auto" }}
            onClick={handleAddModal}
          >
            {t("Settings")}
          </Button>

          <Button
            variant="outline-secondary p-1 d-flex align-items-center"
            className="me-2 px-3 py-1 m-2 bg-white"
            size="lg"
            style={{ fontSize: "13px", width: "auto" }}
            onClick={() => setShowViewWarningModal(false)}
          >
            <svg
              height="24px"
              width="24px"
              viewBox="0 0 24 24"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>close</title>
              <desc>Created with sketchtool.</desc>
              <g
                id="web-app"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                <g id="close" fill="#000000">
                  <polygon
                    id="Shape"
                    points="10.6568542 12.0710678 5 6.41421356 6.41421356 5 12.0710678 10.6568542 17.7279221 5 19.1421356 6.41421356 13.4852814 12.0710678 19.1421356 17.7279221 17.7279221 19.1421356 12.0710678 13.4852814 6.41421356 19.1421356 5 17.7279221"
                  ></polygon>
                </g>
              </g>
            </svg>
          </Button>
        </div>
      </div>

      <AgGridDT
        Height="50vh"
        gridHeight="50%"
        rowHeight={65}
        columnDefs={columns}
        rowData={loading ? t("loading") : Data_table}
        rowSelection={"multiple"}
        onCellMouseOver={(e) => (e?.event?.target?.dataset?.test = "showActions")}
        onCellMouseOut={HideActions}
        paginationNumberFormatter={function (params) {
          return params.value.toLocaleString();
        }}
        onFirstDataRendered={onFirstDataRendered}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        overlayNoRowsTemplate={
          loading && Data_table?.length === 0
            ? t("loading")
            : !loading && Data_table?.length && ""
        }
        gridApi={gridApi}
        gridColumnApi={gridColumnApi}
        paginationPageSize={20}

      />
    </div>
  );
};

export default ShowWarnings;
