import React, { useMemo, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Card, Row } from "react-bootstrap";
import { useTranslation } from "next-i18next";
import AgGridDT from "components/AgGridDT";
import moment from "moment";
import { getSession } from "next-auth/client";

function EmailLog({ excelLogData }) {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const { t } = useTranslation(["Table", "common"]);
  const onGridReady = async (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      flex: 1,
      resizable: true,
      filter: true,
    };
  }, []);

  // columns used in ag grid
  const columns = useMemo(
    () => [
      {
        headerName: `${t("Report_Name_key")}`,
        field: "reportName",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("email_key")}`,
        field: "email",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("Start_Time")}`,
        field: "strDate",
        valueGetter: (params) =>
          !params.data.strDate
            ? "N/A"
            : moment(params.data.strDate).local().format("YYYY-MM-DD HH:mm"),
        filter: "agDateColumnFilter",
      },
      {
        headerName: `${t("End_Time")}`,
        field: "endDate",
        valueGetter: (params) =>
          !params.data.endDate
            ? "N/A"
            : moment(params.data.endDate).local().format("YYYY-MM-DD HH:mm"),
        filter: "agDateColumnFilter",
      },
      {
        headerName: `${t("Is_Email_Sent")}`,
        field: "isEmailSent",
        valueGetter: (params) => (params.data.isEmailSent ? "Yes" : "No"),
      },
    ],
    [t]
  );

  return (
    <div className="container-fluid">
      <Row>
        <Card>
          <Card.Body>
            <AgGridDT
              enableRtl={localStorage?.language === "ar"}
              rowHeight={65}
              columnDefs={columns}
              rowData={excelLogData}
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
      </Row>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const userRole =  session?.user?.user?.role?.toLowerCase();
  const isUserOrFleet = userRole === "user" || userRole === "fleet";
  if (!session || isUserOrFleet) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  let data;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/reports/downloadedExcelLog`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.new_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      data = await response.json();
    } else {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error:", error);
    data = null;
  }

  return {
    props: {
      locale: context.locale,
      ...(await serverSideTranslations(context.locale, [
        "Table",
        "main",
        "common",
      ])),
      excelLogData: data?.result?.reverse() || [],
      revalidate: 120,
    },
  };
}

export default EmailLog;
