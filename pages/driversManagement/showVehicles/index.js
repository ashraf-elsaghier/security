import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, Row } from "react-bootstrap";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { toast } from "react-toastify";
import AgGridDT from "components/AgGridDT";
import {
  getDriverAssignedVehicles,
  fitchUnassignedVehicles,
  addVehicleToDriver,
  UnAssignVehicle,
} from "services/driversManagement";
import { useTranslation } from "next-i18next";
import Switcher from "components/Switcher";
import { useDispatch } from "react-redux";
import { updateVehicleDriverID } from "lib/slices/StreamData";

export default function ShowVehicles() {
  const router = useRouter();
  const { id } = router.query;
  const [AssignedVehicles, setAssignedVehicles] = useState(null);
  const [UnAssignedVehicles, setUnAssignedVehicles] = useState(null);
  const [gridApiUnassigned, setGridApiUnassigned] = useState(null);
  const [gridColumnApiUnassigned, setGridColumnApiUnassigned] = useState(null);
  const [loadingAssignRq, setloadingAssignRq] = useState(false);
  const [loadingUnAssignRq, setloadingUnAssignRq] = useState(false);
  const [EmailUsers, setEmailUsers] = useState(false);
  const { t } = useTranslation("driversManagement");
  const dispatch = useDispatch();
  // fetch assigned vehicles to driver
  useEffect(() => {
    if (!id) {
      router.back();
    } else {
      const fetchVehicles = async () => {
        try {
          const respond = await getDriverAssignedVehicles(id);
          setAssignedVehicles([...respond?.vehicles]);
        } catch (error) {
          toast.error(error.response?.data?.message);
        }
      };
      fetchVehicles();
    }
  }, [id]);

  // fitch Unassigned Vehicles data
  const onGridUnassignReady = useCallback(async (params) => {
    try {
      const respond = await fitchUnassignedVehicles();
      setUnAssignedVehicles([...respond?.unAssingedVehs]);
      setGridApiUnassigned(params.api);
      setGridColumnApiUnassigned(params.columnApi);
    } catch (error) {
      toast.error(error.response.data?.message);
    }
  }, []);

  // unassign vehicle from driver
  const UnAssignVehicleRq = async (ele) => {
    setloadingUnAssignRq(true);
    try {
      const respond = await UnAssignVehicle(id, ele.VehicleID, EmailUsers);
      toast.success("Vehicle UnAssigned Successfully");

      setAssignedVehicles((prev) => [
        ...prev.filter((vehicle) => vehicle.VehicleID != ele.VehicleID),
      ]);
      setUnAssignedVehicles((prev) => [...prev, ele]);
      setloadingUnAssignRq(false);
      dispatch(
        updateVehicleDriverID({ VehicleID: ele.VehicleID, DriverID: null })
      );
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setloadingUnAssignRq(false);
    }
  };

  // assign vehicles to driver
  const AssignVehicleRq = async (ele) => {
    setloadingAssignRq(true);
    try {
      const respond = await addVehicleToDriver(id, ele.VehicleID, EmailUsers);
      toast.success("Vehicle Assigned Successfully");
      setUnAssignedVehicles((prev) => [
        ...prev.filter((vehicle) => vehicle.VehicleID != ele.VehicleID),
      ]);
      setAssignedVehicles((prev) => [ele, ...prev]);
      setloadingAssignRq(false);
      dispatch(
        updateVehicleDriverID({ VehicleID: ele.VehicleID, DriverID: id })
      );
    } catch (error) {
      setloadingAssignRq(false);
      toast.error(error?.response?.data?.message);
    }
  };

  // columns used in ag grid
  const AssignedVecColumns = useMemo(
    () => [
      {
        headerName: t("group_name_key"),
        field: "GroupName",
        sortable: true,
        valueGetter: (params) => params.data.GroupName ?? "N/A",
      },
      {
        headerName: t("plate_number_key"),
        field: "PlateNumber",
      },
      {
        headerName: t("display_name_key"),
        field: "DisplayName",
      },
      {
        headerName: t("color_key"),
        field: "Color",
        valueGetter: (params) =>
          params?.data?.Color?.length === 0 ||
          params?.data?.Color === null ||
          params?.data?.Color === "null"
            ? "N/A"
            : params?.data?.Color,
      },
      { headerName: t("makeYear_key"), field: "MakeYear" },
      { headerName: t("typeID_key"), field: "TypeID" },
      { headerName: t("modelID_key"), field: "ModelID" },
      {
        headerName: t("actions_key"),
        cellRenderer: (params) => (
          <Button
            disabled={loadingUnAssignRq}
            onClick={() => UnAssignVehicleRq(params.data)}>
            {t("unassign_vehicle_key")}
          </Button>
        ),
      },
    ],
    [loadingUnAssignRq, t, EmailUsers]
  );
  const UnAssignedVecColumns = useMemo(
    () => [
      {
        headerName: t("group_name_key"),
        field: "GroupName",
        sortable: true,
        valueGetter: (params) => params.data.GroupName ?? "N/A",
      },
      {
        headerName: t("plate_number_key"),
        field: "PlateNumber",
        minWidth: 150,
      },
      {
        headerName: t("display_name_key"),
        field: "DisplayName",
      },
      {
        headerName: t("color_key"),
        field: "Color",
        valueGetter: (params) =>
          params?.data?.Color?.length === 0 || params?.data?.Color === null
            ? "N/A"
            : params?.data?.Color,
      },
      { headerName: t("makeYear_key"), field: "MakeYear" },
      { headerName: t("typeID_key"), field: "TypeID" },
      { headerName: t("modelID_key"), field: "ModelID" },
      {
        headerName: t("actions_key"),
        cellRenderer: (params) => {
          return (
            <Button
              disabled={loadingAssignRq}
              onClick={() => {
                AssignVehicleRq(params.data);
              }}>
              {t("assign_vehicle_key")}
            </Button>
          );
        },
      },
    ],
    [loadingAssignRq, EmailUsers]
  );
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      flex: 1,
      resizable: true,
      filter: true,
      minWidth: 100,
    };
  }, []);
  return (
    <>
      <Card>
        <Card.Header className="h3">{t("assigned_vehicles_key")}</Card.Header>
        <Card.Body>
          <div className="container d-flex align-items-center justify-content-start ms-0">
            <div>Email Users:</div> <Switcher setData={setEmailUsers} />
          </div>
          <Row>
            <AgGridDT
              rowHeight={"auto"}
              columnDefs={AssignedVecColumns}
              rowData={AssignedVehicles}
              defaultColDef={defaultColDef}
              paginationNumberFormatter={function (params) {
                return params.value.toLocaleString();
              }}
              onFirstDataRendered={(params) => {
                params.api.sizeColumnsToFit();
              }}
            />
            <AgGridDT
              rowHeight={65}
              defaultColDef={defaultColDef}
              columnDefs={UnAssignedVecColumns}
              rowData={UnAssignedVehicles}
              paginationNumberFormatter={function (params) {
                return params.value.toLocaleString();
              }}
              onFirstDataRendered={(params) => {
                params.api.sizeColumnsToFit();
              }}
              onGridReady={onGridUnassignReady}
              gridApi={gridApiUnassigned}
              gridColumnApi={gridColumnApiUnassigned}
            />
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["main", "driversManagement"])),
    },
  };
}
// translation ##################################
