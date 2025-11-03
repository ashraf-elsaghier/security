import React, { useState, useCallback, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory } from "@fortawesome/free-solid-svg-icons";
// translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Row, Col, Button, Card } from "react-bootstrap";
import Link from "next/link";
import AgGridDT from "components/AgGridDT";
import { viewHistory } from "services/preventiveMaintenance";
import { toast } from "react-toastify";
import Model from "components/UI/Model";

const ViewHistory = () => {
  const { t } = useTranslation(["preventiveMaintenance", "common", "main"]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [DataTable, setDataTable] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceImgSrc, setInvoiceImgSrc] = useState("");
  // fecth all history data and set the Api of the AG grid table for export pdf
  const onGridReady = useCallback(async (params) => {
    try {
      const respond = await viewHistory();
      setDataTable(respond.result);
      setGridApi(params.api);
      setGridColumnApi(params.columnApi);
    } catch (error) {
      toast.error(error.response.data?.message);
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

  // change the value of MaintenanceType that came from http reqeust to its name
  const handleMaintenanceType = (params) => {
    const MaintenanceType = params?.data?.MaintenanceType;
    return t(MaintenanceType);
  };

  // change the value of PeriodType that came from http reqeust to its name
  const handlePeriodType = (params) => {
    const PeriodType = params?.data?.PeriodType;
    return t(PeriodType);
  };

  // change the value of Recurring that came from http reqeust to true/false
  const handleRecurring = (params) => {
    return params.data.Recurring ? t("true") : t("false");
  };

  // change the value of NotifyPeriod that came from http reqeust to its name
  const handleNotifyPeriod = (params) => {
    const allData = {
      1: "percentage_key",
      2: "value_key",
    };
    return t(allData[params?.data?.WhenPeriod]);
  };

  // columns used in ag grid
  const columns = useMemo(
    () => [
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
        minWidth: 170,
        maxWidth: 180,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("Maintenance Cost")}`,
        field: "MaintenanceCost",
        valueGetter: (params) =>
          !params.data.MaintenanceCost ? "N/A" : params.data.MaintenanceCost,
        minWidth: 120,
        unSortIcon: true,
      },

      {
        headerName: `${t("Maintenance")}`,
        field: "MaintenanceType",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
        valueGetter: handleMaintenanceType,
      },
      {
        headerName: `${t("Period_Type")}`,
        field: "PeriodType",
        minWidth: 140,
        sortable: true,
        unSortIcon: true,
        valueGetter: handlePeriodType,
      },
      {
        headerName: `${t("Start_Value")}`,
        field: "StartValue",
        minWidth: 140,
        unSortIcon: true,
      },
      {
        headerName: `${t("maintenance_due_value_key")}`,
        field: "NextValue",
        minWidth: 200,
        sortable: true,
        unSortIcon: true,
      },

      {
        headerName: `${t("notify_period_key")}`,
        field: "NotifPeriod",
        minWidth: 150,
        unSortIcon: true,
        valueGetter: handleNotifyPeriod,
      },
      {
        headerName: `${t("notify_when_value_key")}`,
        field: "WhenValue",
        minWidth: 180,
        sortable: true,
        unSortIcon: true,
      },

      {
        headerName: `${t("Reset Date")}`,
        field: "CreatedDate",
        valueGetter: (params) =>
          !params.data.CreatedDate ? "N/A" : params.data.CreatedDate,
        minWidth: 150,
        unSortIcon: true,
      },
      {
        headerName: `${t("Reset By")}`,
        field: "CreateBy",
        valueGetter: (params) =>
          !params.data.CreateBy ? "N/A" : params.data.CreateBy,
        minWidth: 150,
        unSortIcon: true,
      },
      {
        headerName: `${t("view_invoice_key")}`,
        minWidth: 180,
        cellRenderer: (params) => {
          return (
            <>
              {params?.data?.ImageFileName ? (
                params?.data?.ImageFileName.split(".").pop() === "pdf" ? (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={params.data.ImageUrl}
                  >
                    view
                  </a>
                ) : (
                  <button
                    className="  bg-transparent "
                    style={{ color: "#0d6efd" }}
                    onClick={() => {
                      setShowInvoice(true);
                      setInvoiceImgSrc(params.data.ImageUrl);
                    }}
                  >
                    view
                  </button>
                )
              ) : (
                <button
                  className="  bg-transparent "
                  style={{ color: "#0d6efd" }}
                  onClick={() => {
                    setShowInvoice(true);
                    setInvoiceImgSrc(params.data.ImageUrl);
                  }}
                >
                  view
                </button>
              )}
            </>
          );
        },
      },
      // {
      //   headerName: `${t("current_value_key")}`,
      //   field: "CurrentValue",
      //   minWidth: 150,
      //   unSortIcon: true,
      // },
    ],
    [t]
  );

  return (
    <div className="container-fluid">
      <Row>
        <Col sm="12">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-center justify-content-md-between flex-wrap">
                <div className="d-flex justify-content-center flex-wrap mb-4">
                  <Link href="/preventiveMaintenance" passHref>
                    <Button
                      variant="primary p-1 d-flex align-items-center"
                      className="m-1"
                      style={{ fontSize: "13px" }}
                    >
                      <FontAwesomeIcon
                        className="me-2"
                        icon={faHistory}
                        size="sm"
                      />
                      {t("back_key")}
                    </Button>
                  </Link>
                </div>
              </div>
              {showInvoice && (
                <Model
                  header={t("view_invoice_key")}
                  show={showInvoice}
                  onHide={() => {
                    setShowInvoice(false);
                    setInvoiceImgSrc("");
                  }}
                  footer={false}
                  size="md"
                >
                  {invoiceImgSrc ? (
                    <img
                      src={invoiceImgSrc}
                      alt="invoice"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        // maxWidth: "300px",
                      }}
                      className="img-fluid object-fit-cover mx-auto d-block"
                    />
                  ) : (
                    <p className="border fs-5 rounded-2 p-3 text-center text-secondary">
                      there is No Invoice to show
                    </p>
                  )}
                </Model>
              )}

              <AgGridDT
                rowHeight={65}
                columnDefs={columns}
                rowData={DataTable}
                paginationNumberFormatter={function (params) {
                  return params.value.toLocaleString();
                }}
                defaultColDef={defaultColDef}
                onGridReady={onGridReady}
                gridApi={gridApi}
                gridColumnApi={gridColumnApi}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ViewHistory;

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "preventiveMaintenance",
        "common",
        "main",
        "Table",
      ])),
    },
  };
}
// translation ##################################
