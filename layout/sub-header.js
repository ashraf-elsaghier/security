import React, { useEffect, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import { i18n } from "next-i18next.config";
import { useSelector } from "react-redux";
import HeaderImg from "icons/HeaderImg";
import Circle from "icons/Circle";
const SubHeader = ({ pageName = "" }) => {
  const { t } = useTranslation("main");
  const router = useRouter();

  const { language } = useSelector((state) => state.config);
  useEffect(() => {
    router.push(pageName);
  }, [pageName, router.pathname]);

  const [state, setState] = useState("");
  useEffect(() => {
    switch (pageName) {
      case "/":
        setState("Dashboard");
        break;
      case "/preventiveMaintenance":
        setState("Preventive_Maintenance");
        break;
      case "/preventiveMaintenance/add":
        setState("Add_Preventive");
        break;
      case "/preventiveMaintenance/edit":
        setState("Update_Preventive");
        break;
      case "/scheduledReports":
        setState("Scheduled_Reports");
        break;
      case "/scheduledReports/add":
        setState("Add_Scheduled_Report");
        break;
      case "/reports":
        setState("Reports");
        break;
      case "/driver/[driverId]":
        setState(t("driver_dashboard_key"));
        break;
      case "/vehicle/[vehicleId]":
        setState(t("vehicle_dashboard_key"));
        break;
      case "/driversManagement":
        setState("Drivers_Management");
        break;
      case "/EmailLog":
        setState("Email_Log");
        break;
      case "/track-sheet":
        setState("track_sheet");
        break;
      case "/driversManagement/add":
        setState("Add_Driver");
        break;
      case "/VehiclesCamera":
        setState("Vehicles_Camera");
        break;
      case "/management":
        setState("Management");
        break;
      case "/notify":
        setState("Notify");
        break;
      case "/Setting":
        setState("Setting");
        break;
      case "/payment/[id]":
        setState("Payment");
        break;
      case "/management/account-management/[id]":
        setState("Account_Management");
        break;
      case "/command-center":
        setState("Command Center");
        break;
      case "/management/account-management/AccountWizard":
        setState("Add_Account");
        break;
      case "/management/account-management/Users/[id]":
        setState("Manage Vehicles");
        break;
      case "/management/account-management/CreateAdminUser":
        setState("Create_Administrator_User");
        break;
      case "/management/account-management/SubScription":
        setState("Add_Subscription");
        break;
      case "/management/account-management/Confirmation":
        setState("Confirmation");
        break;
      case "/management/account-management/ManageUsers":
        setState("Manage_Users");
        break;
      case "/management/account-management/manageUsers":
        setState("Manage_Users");
        break;
      case "/management/account-management/AddUser1":
        setState("Add_User_Info");
        break;
      case "/management/account-management/AddUser2":
        setState("Select_User_Role");
        break;
      case "/management/account-management/AddUser3":
        setState("Add_Subscription");
        break;
      case "/management/account-management/AddUser4":
        setState("Confirmation");
        break;
      case "/management/account-management/SelectUserRole":
        setState("Select_User_Role");
        break;
      case "/management/account-management/CutomizePermissions":
        window.location.href = setState("Cutomize_Permissions");
        break;
      case "/management/account-management/EditUser":
        setState("Edit_User_Info");
        break;
      case "/management/account-management/manageDevices":
        setState("manage_Devices");
        break;
      case "/management/account-management/AddDevicesInfo":
        setState("Add_Devices_Info");
        break;
      case "/management/account-management/AddDevicesInfo2":
        setState("Add_Devices_Info2");
        break;
      case "/management/VehicleManagment":
        setState("Vehicle_Managment");
        break;
      case "/management/ManageParkings":
        setState("Parkings_Management");
      case "/management/ManageGroupsVehicles":
        setState("Groups_Management");
        break;
      case "/management/ItemVehicleManagment/[id]":
        setState("Vehicle_Managment");
        break;
      case "/management/AddVehicleInfo":
        setState("Add_Vehicle");
        break;
      case "/management/AddVehicleInfo2":
        setState("");
        break;
      case "/management/AddVehicleInfo3":
        setState("");
        break;
      case "/management/AddVehicleInfo4":
        setState("");
        break;
      case "/driversManagement/showVehicles":
        setState("Show_Vehicles");
        break;
      case "/management/sim-management":
        setState("Sim Card Management");
        break;
      case "/management/sim-management/add":
        setState("Add Sim Card");
        break;
      case "/management/API-Keys-management":
        setState("API-Keys-Management");
        break;
      case "/management/device-management":
        setState("Devices_Management");
        break;
      case "/management/device-management/add/add-device":
        setState("Add new device");
        break;
      case "/management/device-management/add/add-sim":
        setState("Add Sim card to the device");
        break;

      default:
        setState("");
        break;
    }
  }, [pageName]);
  return (
    <>
      <Head>
        <title>{t(state) || "Saferoad FMS"}</title>
      </Head>
      <div className="iq-navbar-header" style={{ height: "190px" }}>
        <Container fluid className=" iq-container">
          <Row>
            <Col md="12">
              <div className="d-flex justify-content-between flex-wrap">
                <div>
                  <h1 className={` ${state == "track_sheet" ? "fs-2" : ""} `}>
                    {t(state)}
                  </h1>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        {/* {{!-- rounded-bottom if not using animation --}} */}
        <div className={`iq-header-img ${language == "ar" ? "ar" : ""}`}>
          {/* header icons  (imgs) */}
          <HeaderImg
            className={language == "ar" ? "banner-leftImg" : "banner-rightImg"}
          />
          <Circle
            className={language !== "ar" ? "banner-leftImg" : "banner-rightImg"}
          />
        </div>
      </div>
    </>
  );
};

export default SubHeader;
