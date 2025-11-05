import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import axios from "axios";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import HideActions from "hooks/HideActions";
import AgGridDT from "components/AgGridDT";

const Warning = ({
  setWarningToggle,
  Data_table,
  setData_table,
  setWarningViewToggle,
  warning,
  setWarning,
  warningToggle,
}) => {
  const { darkMode } = useSelector((state) => state.config);
  const { t } = useTranslation("Table");

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const { locale } = useRouter();

  //first page to render in the AG grid table
  const onFirstDataRendered = (params) => {
    params.api.paginationGoToPage(0);
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

  //set the Api of the AG grid table
  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const columns = useMemo(
    () => [
      {
        headerName: `${t("Geofence_Name")}`,
        field: "GeofenceName",
      },
      {
        headerName: `${t("Geofence_Type")}`,
        field: "GeoFenceType",
      },
      {
        headerName: `${t("Geofence_Speed")}`,
        field: "Speed",
      },
    ],
    [t]
  );

  useEffect(() => {
    if (warningToggle) {
      if (warning.length > 0) {
        setData_table([...warning]);
      } else {
        const fetchData = async () => {
          try {
            const response = await axios.get(`warning/dev`);
            let handledData = response.data?.allGeoFences?.map(
              (item) => item.handledData
            );
            await handledData?.map((item) => {
              // check if a circle
              if (item.GeoFenceType === 2) {
                let GeofencePath = [];
                item.GeofencePath?.map((item) => {
                  item?.map((item) => GeofencePath.push(+item));
                });
                item.GeofencePath = GeofencePath;
              } else {
                item.GeofencePath = item.GeofencePath?.map((item) =>
                  item?.map((item) => +item)
                );
              }
            });

            setWarning(handledData);
            setData_table(handledData);
          } catch (error) {
            toast.error(error?.message);
          }
        };

        fetchData();
      }
    }
  }, [warning.length, warningToggle]);

  const handleCloseSettings = () => {
    setWarning(false);
    // setEditGeofence(false);
    setWarningToggle(false);
  };

  const handleSettings = () => {
    setWarning(true);
    // setEditGeofence(false);
    setWarningToggle(false);
    setWarningViewToggle(false);
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
      <div className="d-flex justify-content-center justify-content-md-between flex-wrap">
        <div className="d-flex justify-content-between flex-wrap mb-4 w-100">
          <Button
            variant="primary p-1 d-flex align-items-center"
            className="mx-2 px-3 py-1 m-2 bg-primary"
            size="lg"
            style={{ fontSize: "13px", width: "auto" }}
            onClick={handleSettings}
          >
            {t("Settings")}
          </Button>

          <Button
            variant="outline-secondary p-1 d-flex align-items-center"
            className="me-2 px-3 py-1 m-2 bg-white"
            size="lg"
            style={{ fontSize: "13px", width: "auto" }}
            onClick={handleCloseSettings}
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
        rowData={Data_table}
        rowSelection={"multiple"}
        onCellMouseOver={(e) => (e?.event?.target?.dataset?.test = "showActions")}
        onCellMouseOut={HideActions}
        paginationNumberFormatter={function (params) {
          return params.value.toLocaleString();
        }}
        onFirstDataRendered={onFirstDataRendered}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        overlayNoRowsTemplate={t("loading")}
        gridApi={gridApi}
        gridColumnApi={gridColumnApi}
      />
    </div>
  );
};

export default Warning;
