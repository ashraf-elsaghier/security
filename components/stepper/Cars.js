import { useState, useMemo, useCallback, memo } from "react";
import { Row, Col, Card } from "react-bootstrap";
import AgGridDT from "components/AgGridDT";
import { fetchAllUserVehicles } from "services/scheduledReports";
import { useTranslation } from "next-i18next";

const Cars = ({ setCarsId, carsId }) => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [DataTable, setDataTable] = useState(null);

  const { t } = useTranslation(["scheduledReports", "common", "main"]);

  // fetch All user vehicles
  const onGridReady = useCallback(async (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    const response = await fetchAllUserVehicles();
    setDataTable(response.vehicles);

    if (carsId?.length) {
      params.api.forEachNode((node, index) => {
        if (carsId?.includes(node.data.VehicleID)) {
          node.setSelected(true);
        }
      });
    }
  }, []);

  // the default setting of the AG grid table .. sort , filter , etc...
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      flex: 1,
      resizable: true,
      filter: true,
    };
  }, []);

  const handleCarsSelection = (e) => {
    const selectedRows = gridApi.getSelectedRows();
    const selectedRowsId = selectedRows.map((row) => row.VehicleID);
    setCarsId(selectedRowsId);
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
        headerName: t("Plate_Number"),
        field: "PlateNumber",
        minWidth: 190,
        maxWidth: 190,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: t("Vehicle_Name"),
        field: "DisplayName",
        minWidth: 200,
        maxWidth: 200,
      },
      {
        headerName: t("Manufacturing_Company"),
        field: "Make",
        minWidth: 200,
        maxWidth: 200,
      },
      {
        headerName: t("Vehicle_Type"),
        field: "TypeName",
        minWidth: 200,
        maxWidth: 200,
      },
      {
        headerName: t("Chassis_Number"),
        field: "Chassis",
        minWidth: 200,
        maxWidth: 200,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: t("Device_Serial_Number"),
        field: "SerialNumber",
        minWidth: 200,
        maxWidth: 200,
        sortable: true,
        unSortIcon: true,
      },
    ],
    []
  );

  return (
    <div className="container-fluid">
      <Row>
        <Col sm="12">
          <Card>
            <Card.Body>
              <AgGridDT
                rowHeight={65}
                columnDefs={columns}
                rowSelection={"multiple"}
                rowMultiSelectWithClick={"true"}
                onSelectionChanged={
                  //   setrowsSelected([...e.api.getSelectedRows()])
                  handleCarsSelection
                }
                onCellMouseOver={(e) => (e.event.target.test = "showActions")}
                // onCellMouseOut={HideActions}
                defaultColDef={defaultColDef}
                onGridReady={onGridReady}
                gridApi={gridApi}
                gridColumnApi={gridColumnApi}
                rowData={DataTable}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default memo(Cars);
