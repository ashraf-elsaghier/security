import AgGridDT from "components/AgGridDT";
import { colorStyles, getKey, iconUrl, VStatusToColor } from "helpers/helpers";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Card, Col, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import Select from "react-select";
import Link from "next/link";
import StreamHelper from "helpers/streamHelper";
import { useVehicleContext } from "context/VehiclesContext";

export default function TrackTable() {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  // const [paginationSize, setPaginationSize] = useState(500);
  const darkMode = useSelector((state) => state.config.darkMode);
  const markersRef = useRef({});
  const { getVehicleBySerialNumber } = useVehicleContext();
  const socket = useSelector((state) => state.socket.socket);
  const { aggregate, isBefore } = StreamHelper();
  const VehFullData = useSelector((state) => state.streamData.VehFullData);
  const vehicles = VehFullData.map((v) => {
    const lastRecord = getVehicleBySerialNumber(v.SerialNumber);
    return lastRecord ? { ...v, ...lastRecord } : v;
  });
  useEffect(() => {
    if (!socket) return;
    if (VehFullData.length) {
      markersRef.current = Object.fromEntries(
        VehFullData.map((marker) => {
          const latestUpdate = getVehicleBySerialNumber(marker.SerialNumber);
          const newData = {
            ...latestUpdate,
            RecordDateTime: new Date(
              latestUpdate?.RecordDateTime.toString() + "z"
            ),
          };
          return [marker.SerialNumber, newData];
        })
      );
      const updateVehicleData = (data) => {
        if (!data) return;
        const marker = markersRef.current[data.SerialNumber];
        if (!marker) return;
        const dataDate = new Date(data.RecordDateTime.toString() + "z");
        const currentDate = new Date(marker.RecordDateTime);
        if (isBefore(dataDate, currentDate)) return;
        marker.RecordDateTime = data.RecordDateTime.toString() + "z";
        const newData = aggregate(data, marker);
        markersRef.current[data.SerialNumber] = newData;
        gridApi?.applyTransaction({ update: [newData] });
      };
      socket.on("update", updateVehicleData);
      return () => {
        if (socket) socket.off("update", updateVehicleData);
      };
    }
  }, [aggregate, isBefore]);

  const { t } = useTranslation(["common"]);
  const onGridReady = useCallback(async (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  }, []);
  const getRowId = useCallback((params) => params.data.SerialNumber, []);

  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      flex: 1,
      resizable: true,
      filter: true,
      cellClass: "selectable-cell",
    };
  }, []);
  const columns = useMemo(
    () => [
      {
        headerName: `${t("status_icon")}`,
        field: "VehicleStatus",
        minWidth: 100,
        width: 100,
        maxWidth: 100,
        cellRenderer: (params) => (
          <div
            className={`position-relative mt-1   d-flex justify-content-center rounded-1`}
            style={{ padding: "3px", transform: "rotate(90deg)" }}
          >
            <Image
              src={iconUrl(
                params.data?.configJson,
                "/assets/images/cars/car0/",
                params.data?.VehicleStatus
              )}
              width={22}
              height={40}
              alt={params.data?.SerialNumber}
              title={params.data?.SerialNumber}
            />
          </div>
        ),
      },
      {
        headerName: `${t("display_name")}`,
        field: "DisplayName",
        minWidth: 150,
        maxWidth: 340,
        valueGetter: (params) => params.data?.DisplayName || t("N/A"),
      },
      {
        headerName: `${t("group_name")}`,
        field: "GroupName",
        minWidth: 100,
        maxWidth: 180,
        valueGetter: (params) => params.data?.GroupName || t("N/A"),
      },
      {
        headerName: `${t("plate_number")}`,
        field: "PlateNumber",
        maxWidth: 270,
        valueGetter: (params) => params.data?.PlateNumber || t("N/A"),
      },
      {
        headerName: `${t("vehicle_status")}`,
        field: "VehicleStatus",
        minWidth: 150,
        maxWidth: 150,
        valueGetter: (params) =>
          t(getKey(params.data.VehicleStatus).toLocaleLowerCase()),
        cellStyle: (params) => ({
          color: VStatusToColor(params.data.VehicleStatus),
        }),
      },
      {
        headerName: `${t("driver_id")}`,
        field: "DriverID",
        minWidth: 110,
        maxWidth: 110,
        valueGetter: (params) => {
          const drivers = JSON.parse(localStorage.getItem("drivers"));
          const driverId = params.data?.DriverID ?? params.data?.IButtonID;
          const driver = drivers?.filter(
            (driver) => driver.RFID == driverId
          )[0];
          return (
            (driver?.DriverID ??
              params.data?.DriverID ??
              params.data?.IButtonID ??
              params.data?.RFID) ||
            t("N/A")
          );
        },
      },
      {
        headerName: `${t("driver_name")}`,
        field: "DriverName",
        minWidth: 100,
        maxWidth: 170,
        valueGetter: (params) => {
          const drivers = JSON.parse(localStorage.getItem("drivers"));
          const driverId = params.data?.DriverID ?? params.data?.IButtonID;
          const driver = drivers?.filter(
            (driver) => driver.RFID == driverId
          )[0];
          return (
            (driver
              ? driver?.FirstName + " " + driver?.LastName
              : params.data?.DriverName) || t("N/A")
          );
        },
      },
      {
        headerName: `${t("mileage")}`,
        field: "Mileage",
        minWidth: 90,
        maxWidth: 130,
        valueGetter: (params) => params.data?.Mileage / 1000 || t("N/A"),
      },
      {
        headerName: `${t("weight")}`,
        field: "WeightReading",
        minWidth: 120,
        maxWidth: 130,
        valueGetter: (params) => params.data?.WeightReading || t("N/A"),
      },
      {
        headerName: `${t("speed")}`,
        field: "Speed",
        minWidth: 100,
        maxWidth: 90,
        valueFormatter: (params) => {
          const speed = params.value;
          return speed != null ? speed.toFixed(0) : t("N/A");
        },
        filter: "agNumberColumnFilter",
      },
      {
        headerName: `${t("address")}`,
        field: "Address",
        minWidth: 350,
        maxWidth: 500,
        cellRenderer: (params) => {
          const { Latitude, Longitude, Address } = params.data;
          return Address ? (
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${Latitude},${Longitude}`}
              passHref
            >
              <a target="_blank" rel="noopener noreferrer">
                {Address}
              </a>
            </Link>
          ) : (
            <span>{t("N/A")}</span>
          );
        },
      },
    ],
    [t]
  );

  // const [customColumns, setCustomColumns] = useState([]);
  // const [filterCol, setFilterCol] = useState([]);

  // useEffect(() => {
  //   setFilterCol(columns.map((v) => ({ label: v.headerName, value: v.field })));
  //   setCustomColumns(columns);
  // }, [columns]);

  // const onChange = (e) => {
  //   const selectedCol = e?.map((el) =>
  //     columns.find((col) => col.field === el?.value)
  //   );
  //   setCustomColumns(e?.length > 0 ? selectedCol : columns);
  // };

  // const paginationHandleChange = (e) => {
  //   gridApi.paginationSetPageSize(e.value);
  //   setPaginationSize(e.value);
  // };
  // const paginationsOptions = useMemo(
  //   () => [
  //     { value: 10, label: 10 },
  //     { value: 20, label: 20 },
  //     { value: 30, label: 30 },
  //     { value: 40, label: 40 },
  //     { value: 50, label: 50 },
  //     { value: 100, label: 100 },
  //     { value: 200, label: 200 },
  //     { value: 300, label: 300 },
  //     { value: 400, label: 400 },
  //     { value: 500, label: 500 },
  //   ],
  //   [paginationSize]
  // );
  // const PaginationPageComponent = (
  //   <Form.Group
  //     className=" d-flex align-items-center gap-2  "
  //     controlId="paginationSizeSelect"
  //   >
  //     <Form.Label className="order-1 mb-0">{t("rows_per_page")}</Form.Label>
  //     <Select
  //       defaultValue={paginationSize}
  //       placeholder={paginationSize}
  //       name="paginationSize"
  //       options={paginationsOptions}
  //       onChange={paginationHandleChange}
  //       isSearchable={false}
  //       classNamePrefix="select"
  //       className="order-2"
  //       styles={colorStyles(darkMode)}
  //       menuPlacement="top"
  //     />
  //   </Form.Group>
  // );
  return (
    <>
      {/* <div className="px-4 mt-n3 mb-2 d-flex     justify-content-end ">
        <div style={{ width: "450px" }}>
          <Select
            isMulti
            options={filterCol}
            className="basic-multi-select w-100"
            classNamePrefix="select"
            placeholder={t("Select Columns to Export")}
            onChange={onChange}
            styles={colorStyles(darkMode)}
          />
        </div>
      </div> */}

      <Col sm="12" className="mt-5">
        <Card className="mb-0">
          <Card.Body className="px-3 py-0 track-sheet">
            <AgGridDT
              Height={vehicles?.length > 10 ? "99vh" : "500px"}
              rowHeight={40}
              columnDefs={columns}
              suppressRowClickSelection
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              gridApi={gridApi}
              gridColumnApi={gridColumnApi}
              rowData={vehicles}
              paginationPageSize={vehicles?.length}
              autoSize={false}
              DomLayout={"normal"}
              getRowId={getRowId}
              footer={false}
              // paginationPageComponent={PaginationPageComponent}
            />
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}
