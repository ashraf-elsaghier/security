import { memo, useMemo } from "react";
import { Card, Col } from "react-bootstrap";
import Styles from "../../../styles/Dashboard.module.scss";
import { useTranslation } from "next-i18next";
import AgGridDT from "components/AgGridDT";

const Index = ({ data }) => {
  const { t } = useTranslation("Dashboard");

  // change the value of MaintenanceType that came from http request to its name
  // const handleMaintenanceType = (params) => {
  //   const allData = {
  //     1: t("engine_oil_change_key"),
  //     2: t("change_vehicle_brakes_key"),
  //     3: t("vehicle_license_renew_key"),
  //     4: t("vehicle_wash_key"),
  //     5: t("tires_change_key"),
  //     6: t("transmission_oil_change_key"),
  //     7: t("filter_change_key"),
  //     8: t("others_key"),
  //   };
  //   return allData[params?.data?.MaintenanceType];
  // };

  // change the value of PeriodType that came from http request to its name
  // const handlePeriodType = (params) => {
  //   const allData = {
  //     1: t("by_mileage_key"),
  //     3: t("by_fixed_date_key"),
  //     2: t("by_working_hours_key"),
  //   };
  //   return allData[params.data.PeriodType];
  // };

  // the default setting of the AG grid table .. sort , filter , etc...
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      flex: 1,
      resizable: true,
      filter: true,
    };
  }, []);

  const columns = useMemo(
    () => [
      {
        headerName: `${t("display_name_key")}`,
        field: "DisplayName",
        minWidth: 170,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("group_name_key")}`,
        field: "groupName",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("maintenance_type_key")}`,
        field: "MaintenanceType",
        // valueGetter: handleMaintenanceType,
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("next_value_key")}`,
        field: "NextValue",
        minWidth: 140,
        unSortIcon: true,
      },
      {
        headerName: `${t("period_type_key")}`,
        field: "PeriodType",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
        // valueGetter: handlePeriodType,
      },
    ],
    [t]
  );

  return (
    <>
      <Col sm="12" id="repair-table">
        <Card>
          <Card.Header className="d-flex justify-content-between">
            <h4 className={"card-title " + Styles.head_title}>
              {t("next_repair_plans_key")}
            </h4>
          </Card.Header>
          <Card.Body>
            <AgGridDT
              rowHeight={65}
              columnDefs={columns}
              rowData={data || []}
              paginationNumberFormatter={function (params) {
                return params.value.toLocaleString();
              }}
              defaultColDef={defaultColDef}
              footer={false}
            />
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export default memo(Index);
