import { useEffect, useMemo, useState, useCallback } from "react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { Button, Form, Modal, Row } from "react-bootstrap";
import AgGridDT from "../../../AgGridDT";
import HideActions from "../../../../hooks/HideActions";
import DeleteModal from "../../../Modals/DeleteModal";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import MenuTree from "../MenuTree";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

import "leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

const ShowGeofence = ({
  Data_table,
  setData_table,
  setID,
  setShowViewFencModal,
  setShowAddFencModal,
  setShowEditFencModal,
  setGeofencesViewToggle,
  geofencesViewToggle,
}) => {
  const L = require("leaflet");

  const { darkMode } = useSelector((state) => state.config);
  const { t } = useTranslation("Table");
  const { myMap } = useSelector((state) => state.mainMap);
  const geofenceConfig =
    localStorage.getItem("geofenceConfigs") &&
    JSON.parse(localStorage.getItem("geofenceConfigs"));

  const [GeoFenceData, setGeoFenceData] = useState({});
  const [showModalDelete, setshowModalDelete] = useState(false);
  const [loadingDelete, setloadingDelete] = useState(false);

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [loading, setLoading] = useState(false);
  const [vehicleId, setVehicleId] = useState(0);

  const [showVehicleModal, setShowVehicleModal] = useState(false);

  const [treeFilter, setTreeFilter] = useState("");

  const [vehicleIds, setVehicleIds] = useState([]);
  const [vehicleIdsChecked, setVehicleIdsChecked] = useState([]);
  const [geoVehicles, setGeoVehicles] = useState([]);
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

  const handleGeoFenceType = (params) => {
    const allData = {
      1: "Circle",
      2: "Polygon",
      3: "Rectangle",
    };
    return allData[params.data.GeoFenceType];
  };

  const handleShowVehicle = async (params) => {
    setGeoVehicles(params.data?.vehicleIds?.split(","));
    setShowVehicleModal(true);
    setVehicleId(params?.data?.ID);
  };

  const DrawShape = useCallback(
    (item) => {
      switch (item.GeoFenceType) {
        case 2: // Polygon
          L.polygon(item.GeofencePath, { color: "red" }).addTo(
            myMap.groups.drawGroup
          );
          break;

        case 1: // Circle
          // L.circle(item.GeofencePath, {
          L.circle(
            [item.GeofenceCenterPoint.lat, item.GeofenceCenterPoint.lng],
            {
              color: "red",
              radius: +item.GeofenceRadius || 253126.81953653818,
            }
          ).addTo(myMap.groups.drawGroup);
          break;

        case 3: // Rectangle
          L.rectangle(item.GeofenceBounds, { color: "red" }).addTo(
            myMap.groups.drawGroup
          );
          break;
      }
    },
    [L, myMap?.groups?.drawGroup]
  );

  const handleShowFence = async (params) => {
    myMap.groups.drawGroup.clearLayers();
    try {
      toast.info("Loading Geofence");
      const response = await axios.get(`geofences/filter/${params.data.ID}`);
      if (response.data?.geofence) {
        if (response?.data?.geofence.GeoFenceType === 1) {
          const { GeofenceCenterPoint } = await response.data?.geofence;
          myMap?.setView(
            [GeofenceCenterPoint?.lat, GeofenceCenterPoint?.lng],
            7
          );
        } else if (response?.data?.geofence.GeoFenceType === 3) {
          const { GeofenceBounds } = await response.data?.geofence;
          myMap?.setView([GeofenceBounds[0].lat, GeofenceBounds[0].lng], 6);
        } else if (response?.data?.geofence.GeoFenceType === 2) {
          const { GeofencePath } = response.data.geofence;
          myMap?.setView([GeofencePath[0].lat, GeofencePath[0].lng], 7);
        }
        DrawShape(response.data.geofence);
        toast.success("Geofence Loaded");
        setShowViewFencModal(false);
      } else {
        toast.warning(t("There_is_no_GeoFences_Right_Now!"));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const columns = useMemo(
    () => [
      {
        headerName: `${t("ID")}`,
        field: "ID",
        maxWidth: 150,
        minWidth: 150,
      },
      {
        headerName: `${t("Geofence_Name")}`,
        field: "GeofenceName",
        minWidth: 450,
        cellRenderer: (params) => (
          <>
            <Link
              href={`#`}
              // href={`Driver/${params.ID}`}
              className="text-decoration-underline"
            >
              <p
                style={{
                  height: "25px",
                }}
              >
                {params.value}
              </p>
            </Link>
            <div className="d-flex gap-2">
              <span
                style={{
                  color: "#1675e0",
                  cursor: "pointer",
                }}
                onClick={() => {
                  myMap.groups.drawGroup.clearLayers();
                  setShowViewFencModal(false);
                  setShowEditFencModal(true);
                  setID(params.data.ID);
                }}
              >
                {t("Edit_Geofence")} |{" "}
              </span>

              <span
                style={{
                  color: "#1675e0",
                  cursor: "pointer",
                }}
                onClick={() => handleShowFence(params)}
              >
                {t("Show_Geofence")} |{" "}
              </span>

              <span
                style={{
                  color: "#1675e0",
                  cursor: "pointer",
                }}
                onClick={() => handleShowVehicle(params)}
              >
                {t("Show_Vehicle")}
              </span>
              <span
                onClick={() => {
                  setshowModalDelete(true);
                  setGeoFenceData(params.data);
                }}
                style={{
                  color: "#1675e0",
                  cursor: "pointer",
                }}
              >
                {" "}
                | {t("Delete")}
              </span>
            </div>
          </>
        ),
      },
      {
        headerName: `${t("Geofence_Type")}`,
        field: "GeoFenceType",
        valueGetter: handleGeoFenceType,
        minWidth: 150,
        maxWidth: 250,
      },
      {
        headerName: `${t("Geofence_Speed")}`,
        field: "Speed",
        minWidth: 150,
      },
    ],
    [t, Data_table, geofencesViewToggle]
  );
  console.log({ Data_table });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!Data_table.length) {
          setLoading(true);
          const response = await axios.get("geofences");
          let handledData = response.data?.allGeoFences?.map(
            (item) => item.handledData
          );
          setData_table(handledData);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [Data_table.length]);

  const onDelete = async () => {
    setloadingDelete(false);
    try {
      let res = await axios.delete(`geofences/${GeoFenceData.ID}`);

      if (res.status === 200) {
        toast.success(
          `${GeoFenceData.GeofenceName} ${t("deleted_successfully")}`
        );
        let Layers = myMap.groups.drawGroup.getLayers();
        // let filteredItem = Data_table.filter(
        //   (itemFiltered) => itemFiltered.ID != GeoFenceData.ID
        // );

        setData_table(
          Data_table.filter(
            (itemFiltered) => itemFiltered.ID != GeoFenceData.ID
          )
        );

        if (Layers.length > 0) {
          // let options = {
          //   color: "red",
          // };

          myMap.groups.drawGroup.clearLayers();

          // filteredItem?.map((item) => {
          //   let path = item.GeofencePath;
          //   switch (item.GeoFenceType) {
          //     case 1: // polygon
          //       L.polygon(path, options).addTo(myMap.groups.drawGroup);
          //       break;
          //     case 2: // circle
          //       L.circle(path, {
          //         ...options,
          //         radius: +item.GeofenceRadius,
          //       }).addTo(myMap.groups.drawGroup);
          //       break;
          //     case 3: // rectangle
          //       L.rectangle(path, options).addTo(myMap.groups.drawGroup);
          //       break;
          //   }
          // });
        }

        // setData_table([...filteredItem]);
      }
    } catch (e) {
      console.log("Error: " + e.message);
    } finally {
      setloadingDelete(false);
      setshowModalDelete(false);
      // setShowViewFencModal(false);
    }
  };

  const handleAddModal = () => {
    setShowViewFencModal(false);
    setShowAddFencModal(true);
  };

  const handleSaveAssignedVehicles = async (name) => {
    if (name === "save") {
      setLoading(true);
      try {
        let handleRequest = async (api, geoId, vhsId) => {
          return await axios.post(api, {
            geoId: String(geoId),
            vhsId,
          });
        };
        handleRequest(`geofences/assignVhs`, vehicleId, vehicleIdsChecked).then(
          (resp) => {
            if (resp.status === 201) {
              setTimeout(() => {
                toast.success("Add Vehicles to Geofence is Successfully.");
                setLoading(false);
                setShowVehicleModal(false);
              }, 500);
            } else {
              toast.error(`Error: Can Not Add Geofence `);
            }
          }
        );
      } catch (e) {
        console.log(" Error:  " + e.response.data?.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
          setShowVehicleModal(false);
        }, 500);
      }
    } else {
      setShowVehicleModal(false);
    }
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
            disabled={
              geofenceConfig?.canAdd == false ||
              Data_table.length >= geofenceConfig?.numGeofences
            }
          >
            {t("Add_Geofence")}
          </Button>

          <Button
            variant="outline-secondary p-1 d-flex align-items-center"
            className="me-2 px-3 py-1 m-2 bg-white"
            size="lg"
            style={{ fontSize: "13px", width: "auto" }}
            // onClick={handleCloseModal}
            onClick={() => setShowViewFencModal(false)}
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
        onCellMouseOver={(e) => (e.event.target.dataset.test = "showActions")}
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
      />
      <DeleteModal
        show={showModalDelete}
        loading={loadingDelete}
        title={t("Are_you_sure")}
        description={t("Are_you_sure_you_want_to_delete_this_GeoFence")}
        confirmText={t("Yes_delete_it")}
        cancelText={t("No_cancel")}
        onConfirm={onDelete}
        onCancel={() => {
          setshowModalDelete(false);
          setloadingDelete(false);
        }}
      />

      <Modal
        show={showVehicleModal}
        onHide={() => {
          handleSaveAssignedVehicles("modal");
          setTreeFilter("");
        }}
        name="modal"
        centered
      >
        <Modal.Header
          closeButton
          style={{
            background: darkMode ? "#222738" : "#FFFFFF",
            borderBottomColor: darkMode ? "#151824" : "#DDD",
          }}
        >
          <Modal.Title>{t("Select_Vehicles")}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            background: darkMode ? "#222738" : "#FFFFFF",
          }}
        >
          <Row>
            <Form.Group controlId="Geofence Speed">
              <Form.Control
                className="border-primary form-control fw-bold col-12 col-md-3 mb-3"
                name="Speed"
                value={treeFilter}
                onChange={(e) => setTreeFilter(e.target.value)}
                type="text"
                placeholder={t("Enter_Displayed_Name")}
                required={true}
                // onKeyPress={handleSpeedOnKeyPress}
              />
              {/* <Button
                variant="primary"
                size="lg"
                onClick={() => setShowAssignedVehicles(!showAssignedVehicles)}
                className="col-12 col-md-5 mb-3"
              >
                Show Assigned Vehicles
              </Button> */}
            </Form.Group>
          </Row>
          <MenuTree
            setVehicleId={setVehicleId}
            vehicleId={vehicleId}
            treeFilter={treeFilter}
            vehicleIds={vehicleIds}
            setVehicleIds={setVehicleIds}
            setVehicleIdsChecked={setVehicleIdsChecked}
            vehicleIdsChecked={vehicleIdsChecked}
            geoVehicles={geoVehicles}
            // showAssignedVehicles={showAssignedVehicles}
          />
        </Modal.Body>
        <Modal.Footer
          style={{
            background: darkMode ? "#222738" : "#FFFFFF",
            borderTopColor: darkMode ? "#151824" : "#DDD",
          }}
        >
          <Button
            variant="secondary"
            className="px-2 py-1 d-inline-flex justify-content-center align-items-center"
            onClick={() => {
              setShowVehicleModal(false);
            }}
          >
            <FontAwesomeIcon className="mx-2" icon={faTimes} size="sm" />
            <span>{t("Cancel")}</span>
          </Button>
          <Button
            variant="primary"
            name="save"
            className="px-2 py-1 d-inline-flex justify-content-center align-items-center"
            onClick={async () => {
              setShowViewFencModal(false);
              await handleSaveAssignedVehicles("save");
              setShowViewFencModal(true);
            }}
            disabled={loading}
          >
            {!loading ? (
              <FontAwesomeIcon className="mx-2" icon={faCheck} size="sm" />
            ) : (
              <FontAwesomeIcon
                className="mx-2 fa-spin"
                icon={faSpinner}
                size="sm"
              />
            )}
            <span>{t("Save")}</span>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ShowGeofence;
