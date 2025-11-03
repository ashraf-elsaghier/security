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

const ShowLandMarks = ({
  Data_table,
  setData_table,
  setShowViewMarkModal,
  setShowAddMarkModal,
  setViewLandMarkstoggle,
}) => {
  const L = require("leaflet");

  const { darkMode } = useSelector((state) => state.config);
  const { t } = useTranslation("Table");
  const { myMap } = useSelector((state) => state.mainMap);

  const [marksData, setMarksData] = useState({});
  const [showModalDelete, setshowModalDelete] = useState(false);
  const [loadingDelete, setloadingDelete] = useState(false);

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [loading, setLoading] = useState(false);

  const { locale } = useRouter();

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

  const imgExist = async (path) => {
    const imgSrc = "/assets/images/landmarks/Home.png";
    try {
      const res = await axios.get(`${window.location.origin}${path}`);
      imgSrc = path;
    } catch (error) {}

    return imgSrc;
  };
  const handleShowMarks = async (params) => {
    const newData = Data_table.map((m) => {
      if (m.ID == params.data.ID) {
        m.status = !m.status;
      }
      return m;
    });
    let markerGroup = myMap.groups.markerGroup;
    const show = markerGroup
      .getLayers()
      .filter((x) => x.options.MarksID == params.data.ID);
    if (!show.length) {
      const path = `/assets/images/landmarks/${params?.data?.Icon}`;
      const src = await imgExist(path);
      L?.marker(L.latLng(params.data.Latitude, params.data.Longitude), {
        icon: L.divIcon({
          html: `<div class="landMarksIcon"><img src="${src}" style="width:24px;height:24px;"/><BR><span style="background-color:#fff;padding:1px 2px;border-color: maroon;border-width: 2px;border-style: solid;border-radius:5px;">${params.data.POIName}</span></div>`,
          iconAnchor: new L.Point(12, 12),
          iconSize: new L.Point(24, 24),
        }),
        MarksID: params.data.ID,
      }).addTo(myMap?.groups?.markerGroup);
      myMap?.setView([params.data.Latitude, params.data.Longitude], 15);
    } else {
      markerGroup.removeLayer(L.stamp(show[0]));
      if (markerGroup.getLayers().length < 1) setViewLandMarkstoggle(false);
    }
    setData_table(newData);
  };
  const handleLatitude = (params) => {
    let Latitude = (params?.data?.Latitude || 0)?.toFixed(4);
    return +Latitude;
  };

  const handleLongitude = (params) => {
    let Longitude = params?.data?.Longitude?.toFixed(4);
    return +Longitude;
  };

  const columns = useMemo(() => {
    return [
      {
        headerName: `${t("LandMark_Name")}`,
        field: "POIName",
        cellRenderer: (params) => {
          return (
            <>
              <a>{params.value}</a>
              <div
                className="d-flex gap-2 "
                style={{
                  marginTop: "-15px",
                }}
              >
                <span
                  style={{
                    cursor: "pointer",
                    color: "#1675e0",
                  }}
                  className=" me-1"
                  onClick={() => handleShowMarks(params)}
                >
                  {t(params.data.status ? "Locate" : "Remove")}
                </span>

                <span
                  onClick={() => {
                    setshowModalDelete(true);
                    setMarksData(params.data);
                  }}
                  style={{
                    cursor: "pointer",
                    color: "#1675e0",
                  }}
                >
                  {t("Delete")}
                </span>
              </div>
            </>
          );
        },
      },
      {
        headerName: `${t("Latitude")}`,
        field: "Latitude",
        valueGetter: handleLatitude,
      },
      {
        headerName: `${t("Longitude")}`,
        field: "Longitude",
        valueGetter: handleLongitude,
      },
    ];
  }, [t, Data_table]);
  useEffect(() => {
    if (!Data_table?.length) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axios.get("landmarks");
          const marks = response?.data?.marks.map((m) => ({
            ...m,
            status: true,
          }));
          setData_table(marks);
        } catch (error) {
          toast.error(error?.response?.data?.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      const mapMarkersIDs =
        myMap.groups.markerGroup.getLayers().map((m) => m.options.MarksID) ??
        [];
      setData_table((prev) =>
        prev.map((m) => {
          return {
            ...m,
            status: !mapMarkersIDs.includes(m.ID),
          };
        })
      );
    }
  }, []);

  const onDelete = async () => {
    setloadingDelete(false);
    try {
      let res = await axios.delete(`landmarks/${marksData.ID}`);

      if (res.status === 200) {
        toast.success(`${marksData.POIName} ${t("deleted_successfully")}`);
        let filteredItem = Data_table.filter(
          (itemFiltered) => itemFiltered.ID != marksData.ID
        );

        setData_table([...filteredItem]);
        myMap.groups.markerGroup.clearLayers();
      }
    } catch (e) {
      console.log("Error: " + e.message);
    } finally {
      setloadingDelete(false);
      setshowModalDelete(false);
    }
  };

  const handleAddModal = () => {
    myMap?.groups?.markerGroup.clearLayers();
    setShowViewMarkModal(false);
    setViewLandMarkstoggle(false);
    setShowAddMarkModal(true);
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
            {t("Add_LandMarks")}
          </Button>

          <Button
            variant="outline-secondary p-1 d-flex align-items-center"
            className="me-2 px-3 py-1 m-2 bg-white"
            size="lg"
            style={{ fontSize: "13px", width: "auto" }}
            onClick={() => setShowViewMarkModal(false)}
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
        Height="40vh"
        gridHeight="50%"
        rowHeight={65}
        columnDefs={columns}
        rowData={loading ? t("loading") : Data_table}
        rowSelection={"multiple"}
        // onCellMouseOver={(e) => (e?.event?.target?.dataset?.test = "showActions")}
        // onCellMouseOut={HideActions}
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
      />
      <DeleteModal
        show={showModalDelete}
        loading={loadingDelete}
        title={t("Are_you_sure")}
        description={t("Are_you_sure_you_want_to_delete_this_LandMark")}
        confirmText={t("Yes_delete_it")}
        cancelText={t("No_cancel")}
        onConfirm={onDelete}
        onCancel={() => {
          setshowModalDelete(false);
          setloadingDelete(false);
        }}
      />
    </div>
  );
};

export default ShowLandMarks;
