import React, { useState, useMemo, useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
// translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import style from "styles/scss/custom/components/tour-step/tourStep.module.scss";
import { Row, Col, Card, Button } from "react-bootstrap";
import DeleteModal from "components/Modals/DeleteModal";
import { toast } from "react-toastify";
import HideActions from "hooks/HideActions";
import AgGridDT from "components/AgGridDT";
import { fetchAllDrivers, deleteDriver } from "services/driversManagement";
import Model from "components/UI/Model";
import Link from "next/link";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import Edit from "components/driversManagement/Edit";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import Joyride from "react-joyride";
import { handleJoyrideCallback } from "lib/slices/tour";
import useStepDashboard from "hooks/useStepDashboard";
import { getSession } from "next-auth/client";
import axios from "axios";

function DriversManagement() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showModalDelete, setshowModalDelete] = useState(false);
  const [loadingDelete, setloadingDelete] = useState();
  const [Driver, setDriver] = useState({});
  const { t } = useTranslation(["driversManagement", "Tour"]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [DataTable, setDataTable] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [editID, setEditID] = useState("");

  const tourState = useSelector((state) => state.tour.run);
  const allSteps = useStepDashboard();

  // Tour Steps State
  const [{ stepIndex, steps }, setState] = useState({
    stepIndex: 0,
    steps: allSteps["driverManagmentSteps"],
  });
  const onDataReady = async (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  // fecth all drivers and set the Api of the AG grid table for export pdf
  const onGridReady = useCallback(async (params) => {
    try {
      const respond = await fetchAllDrivers();

      const filterdArray = respond?.drivers.map((driver) => {
        const {
          ASPNetID,
          FirstName,
          DateOfBirth,
          MobileNumber,
          LastName,
          AccountID,
          DateOfBirthHijri,
          DLClass,
          DateOfJoin,
          EmployeeID,
          EndTime,
          IsDeleted,
          Nationality,
          Image,
          StartTime,
          WorkingDays,
          referencKey,
          IdentityNumber,
          AssignedVehiclesCount,
          DLNumber,
          DLExpirationDate,
          ...rest
        } = driver;
        const FullName = `${FirstName} ${LastName}`;
        const WASLIntegration = AssignedVehiclesCount;
        const LicenseNumber = DLNumber;
        const LicenseExpirationDate = DLExpirationDate;
        return {
          FullName,
          ...rest,
          LicenseNumber,
          LicenseExpirationDate,
          WASLIntegration,
        };
      });
      setDataTable(filterdArray);
      setGridApi(params.api);
      setGridColumnApi(params.columnApi);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, []);

  // delete driver
  const onDelete = async () => {
    setloadingDelete(true);
    try {
      const respond = await deleteDriver(Driver.DriverID);
      toast.success(Driver.FullName + " deleted successfully");
      setDataTable((prev) =>
        prev.filter((diver) => diver.DriverID !== Driver.DriverID)
      );
      setloadingDelete(false);
      setshowModalDelete(false);
    } catch (error) {
      toast.error(error.response.data?.message);
      setloadingDelete(false);
      setshowModalDelete(false);
    }
  };

  // display full name that came from http reqeust
  const handleFullName = (params) => {
    return `${params.data.FirstName} ${params.data.LastName}`;
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

  // columns used in ag grid
  const columns = useMemo(
    () => [
      {
        headerName: `${t("full_name_key")}`,
        field: "FullName",
        // valueGetter: handleFullName,
        cellRenderer: (params) => (
          <>
            <Link
              href={{
                pathname: `/driver/[driverId]`,
                query: { driverId: params.data.DriverID },
              }}
              passHref
            >
              {params.value}
            </Link>
            <div
              className="d-flex justify-content-start gap-1 flex-wrap"
              style={{
                marginTop: "-20px",
              }}
            >
              <Link
                href={`/driversManagement/showVehicles?id=${params.data.DriverID}`}
                passHref
              >
                <span style={{ fontSize: "13px", cursor: "pointer" }}>
                  {t("vehicles_key")} |
                </span>
              </Link>
              <span
                onClick={() => {
                  setEditID(params?.data?.DriverID);
                  setModalShow(true);
                }}
                style={{ fontSize: "13px", cursor: "pointer" }}
              >
                {t("edit_key")} |
              </span>
              <span
                style={{ fontSize: "13px", cursor: "pointer" }}
                onClick={() => {
                  setshowModalDelete(true);
                  setDriver(params.data);
                }}
                className=""
              >
                {t("delete_key")}
              </span>
            </div>
          </>
        ),
        minWidth: 190,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("phone_number_key")}`,
        field: "PhoneNumber",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("email_key")}`,
        field: "Email",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("department_key")}`,
        field: "Department",
        minWidth: 120,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("license_number_key")}`,
        field: "LicenseNumber",
        minWidth: 120,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("license_expiration_date_key")}`,
        field: "LicenseExpirationDate",
        minWidth: 140,
        unSortIcon: true,
      },
      {
        headerName: `${t("RFID_key")}`,
        field: "RFID",
        minWidth: 120,
        unSortIcon: true,
      },
      {
        headerName: `${t("wasl_integration_key")}`,
        field: "WASLIntegration",
        minWidth: 120,
        unSortIcon: true,
      },
    ],
    [t]
  );

  const getAllDrivers = async () => {
    try {
      const response = await axios.get(`/dashboard/drivers`);

      if (response.data?.drivers) {
        const data = response.data.drivers.map((driver) => {
          const {
            ASPNetID,
            FirstName,
            DateOfBirth,
            MobileNumber,
            LastName,
            AccountID,
            DateOfBirthHijri,
            DLClass,
            DateOfJoin,
            EmployeeID,
            EndTime,
            IsDeleted,
            Nationality,
            Image,
            StartTime,
            WorkingDays,
            referencKey,
            IdentityNumber,
            AssignedVehiclesCount,
            DLNumber,
            DLExpirationDate,
            ...rest
          } = driver;

          const FullName = `${FirstName ?? ""} ${LastName ?? ""}`.trim();
          const WASLIntegration = AssignedVehiclesCount;
          const LicenseNumber = DLNumber;
          const LicenseExpirationDate = DLExpirationDate;

          return {
            FullName,
            ...rest,
            LicenseNumber,
            LicenseExpirationDate,
            WASLIntegration,
          };
        });
        setDataTable(data);
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  useEffect(() => {
    getAllDrivers();
  }, []);
  return (
    <div className="container-fluid">
      <Joyride
        steps={steps}
        continuous
        run={tourState}
        showSkipButton
        callback={(data) => dispatch(handleJoyrideCallback(data))}
        locale={{
          skip: <span className={style["skip-tour"]}>{t("skip_tour")}</span>,
          back: <span className={style["skip-tour"]}>{t("back")}</span>,
          next: <span>{t("next")}</span>,
          last: <span>{t("last")}</span>,
        }}
        styles={{
          options: {
            primaryColor: "#2C7BC6",
            overlayColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 10901,
            width: "379px",
            // padding: "16px",
            backgroundColor: "#E0EAE9",
          },
        }}
      />
      <Row>
        <Col sm="12">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-center justify-content-md-between flex-wrap">
                <div className="d-flex justify-content-center flex-wrap mb-4">
                  <Link href="driversManagement/add">
                    <a>
                      <Button
                        id="add-new-driver"
                        variant="primary p-2"
                        className="mb-2 mb-md-0"
                        style={{ fontSize: "13px" }}
                      >
                        <FontAwesomeIcon
                          className="me-2"
                          icon={faCog}
                          size="sm"
                        />
                        {t("add_new_driver_key")}
                      </Button>
                    </a>
                  </Link>
                </div>
              </div>

              <AgGridDT
                enableRtl={localStorage?.language === "ar"}
                rowHeight={65}
                columnDefs={columns}
                rowData={DataTable}
                // onCellMouseOver={(e) =>
                //   (e?.event?.target?.dataset?.test = "showActions")
                // }
                // onCellMouseOut={HideActions}
                paginationNumberFormatter={function (params) {
                  return params.value.toLocaleString();
                }}
                defaultColDef={defaultColDef}
                onGridReady={onDataReady}
                gridApi={gridApi}
                gridColumnApi={gridColumnApi}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <DeleteModal
        show={showModalDelete}
        loading={loadingDelete}
        confirmText={t("yes,_delete_key")}
        title={t("delete_driver_key")}
        description={t("are_you_sure_you_want_to_delete_this_driver?")}
        cancelText={t("No,cancel")}
        onConfirm={onDelete}
        onCancel={() => {
          setshowModalDelete(false);
          setDriver({});
        }}
      />

      <Model
        header={t("update_driver_key")}
        show={modalShow}
        onHide={() => setModalShow(false)}
        updateButton={t("update_key")}
        footer={false}
      >
        <Edit
          handleModel={() => {
            setModalShow(false);
          }}
          icon={faExternalLinkAlt}
          model={true}
          id={editID}
          modelButtonMsg={t("open_in_new_tab_key")}
          className={`p-0 m-0`}
          updateTable={onGridReady}
        />
      </Model>
    </div>
  );
}
export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  // let data = null;
  // try {
  //   const response = await fetch(
  //     `${process.env.NEXT_PUBLIC_API_URL}/dashboard/drivers`,
  //     {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${session?.user?.new_token}`,
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  //   if (response.ok) {
  //     const respond = await response.json();
  //     data = respond?.drivers.map((driver) => {
  //       const {
  //         ASPNetID,
  //         FirstName,
  //         DateOfBirth,
  //         MobileNumber,
  //         LastName,
  //         AccountID,
  //         DateOfBirthHijri,
  //         DLClass,
  //         DateOfJoin,
  //         EmployeeID,
  //         EndTime,
  //         IsDeleted,
  //         Nationality,
  //         Image,
  //         StartTime,
  //         WorkingDays,
  //         referencKey,
  //         IdentityNumber,
  //         AssignedVehiclesCount,
  //         DLNumber,
  //         DLExpirationDate,
  //         ...rest
  //       } = driver;
  //       const FullName = `${FirstName} ${LastName}`;
  //       const WASLIntegration = AssignedVehiclesCount;
  //       const LicenseNumber = DLNumber;
  //       const LicenseExpirationDate = DLExpirationDate;
  //       return {
  //         FullName,
  //         ...rest,
  //         LicenseNumber,
  //         LicenseExpirationDate,
  //         WASLIntegration,
  //       };
  //     });
  //   } else {
  //     throw new Error(`Failed to fetch data: ${response.statusText}`);
  //   }
  // } catch (error) {
  //   console.error("Error:", error);
  // }
  const userRole = session?.user?.user?.role?.toLowerCase();
  const isUserOrFleet = userRole === "user" || userRole === "fleet";
  if (isUserOrFleet) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      locale: context.locale,
      ...(await serverSideTranslations(context.locale, [
        "driversManagement",
        "main",
        "forms",
        "management",
        "vehiclesCamera",
        "common",
        "Tour",
      ])),
      // data: data || [],
    },
  };
}
export default DriversManagement;
