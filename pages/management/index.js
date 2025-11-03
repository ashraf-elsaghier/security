import React, { useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import Link from "next/link";

// icons
import { FiUsers } from "react-icons/fi";
import { BiCar, BiCreditCardAlt } from "react-icons/bi";
import { BsSdCard } from "react-icons/bs";
import { VscGroupByRefType } from "react-icons/vsc";
import { MdOutlineSensors } from "react-icons/md";
import { RiUserSettingsLine } from "react-icons/ri";
import { GiHouseKeys } from "react-icons/gi";

// translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useSession } from "next-auth/client";
import { getSession } from "next-auth/client";
import { useDispatch, useSelector } from "react-redux";
import { toggle as tourToggle, disableTour, enableTour } from "lib/slices/tour";
import style from "styles/scss/custom/components/tour-step/tourStep.module.scss";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import useStepDashboard from "hooks/useStepDashboard";
const Management = () => {
  const { t } = useTranslation(["Tour"]);
  const dispatch = useDispatch();
  const tourState = useSelector((state) => state.tour.run);
  const allSteps = useStepDashboard();
  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setState({ stepIndex: 0, steps: steps });
      dispatch(tourToggle());
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

      if (index === 11 && action === ACTIONS.PREV) {
        setState({
          stepIndex: nextStepIndex,
          steps: steps,
        });
      } else if (data.action === "close" || data.action === "reset") {
        dispatch(disableTour());
      } else {
        setState({
          stepIndex: nextStepIndex,
          steps: steps,
        });
      }
    }
  };
  const [{ stepIndex, steps }, setState] = useState({
    stepIndex: 0,
    steps: allSteps["managementSteps"],
  });
  const { user } = useSession()[0];
  const userRole = user?.user?.role?.toLowerCase();
  const iconStyle = { fontSize: "3.5rem" };

  const cardsData = () => {
    const { t } = useTranslation("Management");

    return userRole == "fleet"
      ? [
          {
            title: t("Manage_Your_Groups"),
            desc: t(
              "To manage your drivers and assign drivers to your vehicle please click here"
            ),
            icon: <VscGroupByRefType style={iconStyle} />,
            path: "/management/ManageGroupsVehicles",
            btnTitle: t("Manage Groups"),
            id: "manage-groups",
          },
        ]
      : [
          {
            title: t("Manage_Your_Accounts"),
            desc: t("To manage your Accounts and add new accounts click here"),
            icon: <FiUsers style={iconStyle} />,
            // path: `/management/account-management/${user?.id || ""}`
            path: `/management/account-management/${user?.user?.id}`,
            btnTitle: t("Manage_Accounts"),
            id: "manage-accounts",
          },
          {
            title: t("Manage_Users"),
            desc: t(
              "To manage your Users, Add new Users, Manage User's Vehicles and Edit Users Role please click here"
            ),
            icon: <RiUserSettingsLine style={iconStyle} />,
            path: "/management/account-management/manageUsers",
            btnTitle: t("Manage_Users"),
            id: "manage-users",
          },
          {
            title: t("Manage_Your_Vehicles"),
            desc: t("To manage your Vehicles please click here"),
            icon: <BiCar style={iconStyle} />,
            path: "/management/VehicleManagment",
            btnTitle: t("Manage_Vehicles"),
            id: "manage-vehicles",
          },
          {
            title: t("Manage_Devices"),
            desc: t("Manage_Devices_Desc"),
            icon: <MdOutlineSensors style={iconStyle} />,
            path: "/management/device-management",
            btnTitle: t("Manage_Devices"),
            hideItem: userRole !== "admin" && userRole !== "support",
            id: "manage-devices",
          },

          {
            title: t("Manage_Your_SIM_Cards"),
            desc: t("To manage your SIM Cards please click here"),
            icon: <BsSdCard style={iconStyle} />,
            path: "/management/sim-management",
            btnTitle: t("Manage SIM Cards"),
            hideItem: userRole == "admin",
          },
          {
            title: t("Manage_Your_Drivers"),
            desc: t(
              "To manage your drivers and assign drivers to your vehicle please click here"
            ),
            icon: <FiUsers style={iconStyle} />,
            path: "/driversManagement",
            btnTitle: t("Manage Drivers"),
            id: "manage-divers",
          },
          {
            title: t("Manage_Your_Groups"),
            desc: t(
              "To manage your drivers and assign drivers to your vehicle please click here"
            ),
            icon: <VscGroupByRefType style={iconStyle} />,
            path: "/management/ManageGroupsVehicles",
            btnTitle: t("Manage Groups"),
            id: "manage-groups",
          },
          {
            title: t("Manage_Your_PARKING"),
            desc: t("To Manage Your Parking Groups"),
            icon: (
              <svg
                style={iconStyle}
                width="108"
                height="3.5rem"
                viewBox="0 0 108 92"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.266663 91.4667V0.533326H37.4667C43.1023 0.531894 48.6157 2.17633 53.3297 5.26469C58.0437 8.35305 61.7533 12.7509 64.0027 17.9181C62.3847 19.5985 60.9849 21.4761 59.8363 23.5064C57.9349 26.8957 57.9184 30.4256 58.3979 33.0461L60.8779 46.4795C58.1954 50.1752 54.675 53.1824 50.6055 55.2546C46.536 57.3267 42.0333 58.4046 37.4667 58.4H16.8V91.4667H0.266663ZM37.4667 41.8667C39.0951 41.8667 40.7075 41.5459 42.2119 40.9228C43.7164 40.2996 45.0833 39.3862 46.2348 38.2348C47.3862 37.0833 48.2996 35.7164 48.9228 34.2119C49.5459 32.7075 49.8667 31.095 49.8667 29.4667C49.8667 27.8383 49.5459 26.2258 48.9228 24.7214C48.2996 23.2169 47.3862 21.85 46.2348 20.6985C45.0833 19.5471 43.7164 18.6337 42.2119 18.0106C40.7075 17.3874 39.0951 17.0667 37.4667 17.0667H16.8V41.8667H37.4667ZM66.5323 31.5499C66.2294 30.1973 66.4108 28.7813 67.0448 27.5488C69.004 24.0768 74.4848 17.0667 87.0667 17.0667C99.6403 17.0667 105.129 24.0685 107.08 27.5488C107.72 28.7793 107.907 30.1954 107.609 31.5499L99.6237 74.9333H91.2V91.4667H82.9333V74.9333H74.5096L66.5323 31.5499ZM97.4 41.8667L99.4667 30.748C98.0613 28.7144 94.672 25.3333 87.0667 25.3333C79.4613 25.3333 76.072 28.7227 74.6667 30.748L76.7333 41.8667H97.4Z"
                  fill="currentcolor"
                />
              </svg>
            ),
            path: "/management/ManageParkings",
            btnTitle: t("Manage_Parkings"),
            id: "manage-parkings",
          },
          {
            title: t("Manage_API_Keys"),
            desc: t("Manage_API_Keys_Desc"),
            icon: <GiHouseKeys style={iconStyle} />,
            path: "/management/API-Keys-management",
            btnTitle: t("Manage_API"),
            id: "manage-APO-keys",
          },
          {
            title: t("Manage_Your_Payments"),
            desc: t("To manage your invoice"),
            icon: <BiCreditCardAlt style={iconStyle} />,
            path: `/payment/${user?.user?.id || user?.id}`,
            btnTitle: t("Manage_Payments"),
            hideItem: userRole == "admin",
          },
        ];
  };

  return (
    <div className="mx-3" id="management">
      <Joyride
        steps={steps}
        continuous
        callback={handleJoyrideCallback}
        run={tourState}
        stepIndex={stepIndex}
        showSkipButton
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
            zIndex: 50000,
            width: "379px",
            backgroundColor: "#E0EAE9",
          },
        }}
      />

      <Row>
        {cardsData().map(
          ({ title, desc, icon, path, btnTitle, hideItem, id }, idx) => {
            if (hideItem) return null;
            return (
              <Col md="6" key={idx} id={id || ""}>
                <Card
                  className="shadow-sm border-1"
                  style={{ height: "calc(100% - 2rem)" }}
                >
                  <Card.Body>
                    <Row>
                      <Col
                        sm={3}
                        className="mx-auto text-center d-flex align-items-center justify-content-center"
                      >
                        {icon}
                      </Col>
                      <Col sm={9}>
                        <h5 className="mb-2">{title}</h5>
                        <p className="mb-3 fs-6">{desc}</p>
                        <Link href={path}>
                          <a disable className="btn px-3 py-2 btn-primary">
                            {btnTitle}
                          </a>
                        </Link>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            );
          }
        )}
      </Row>
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session?.user?.user?.role?.toLowerCase() == "user") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        "Management",
        "Tour",
        "main",
      ])),
    },
  };
}

export default Management;
