import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Joyride from "react-joyride";
import axios from "axios";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/client";
import style from "styles/scss/custom/components/tour-step/tourStep.module.scss";

const Google = dynamic(() => import("components/dashboard/google"), {
  ssr: false,
});

import Progress from "components/dashboard/Progress/index";

// Chart Components
import AverageUtilizationChart from "components/dashboard/Charts/AverageUtilizationChart";
import AllViolationsChart from "components/dashboard/Charts/AllViolationsChart";

import VehiclesStatusChart from "components/dashboard/Charts/VehiclesStatusChart";
import AverageSpeedAndDistanceChart from "components/dashboard/Charts/AverageSpeedAndDistanceChart";
import OverallPreventiveMaintenance from "components/dashboard/Charts/OverallPreventiveMaintenance";

// import NextrepairplansTable
import NextrepairplansTable from "components/dashboard/NextrepairplansTable";

// import CardsForRates
import CardsForRates from "components/dashboard/CardsForRates";
import { useDispatch, useSelector } from "react-redux";
import useStreamDataState from "hooks/useStreamDataState";
import dynamic from "next/dynamic";
import { updateStRunning } from "lib/slices/StreamData";
import { useSession } from "next-auth/client";
import useStepDashboard from "../hooks/useStepDashboard";
import TagManager from "react-gtm-module";
import { handleJoyrideCallback } from "lib/slices/tour";
import { useTranslation } from "next-i18next";
import usefetchHomeData from "hooks/usefetchHomeData";
import ParkingGroupsChart from "components/dashboard/Charts/ParkingGroupsChart";

const Home = () => {
  const tourState = useSelector((state) => state.tour.run);
  const dashboardSteps = useStepDashboard();
  const [{ steps }, setState] = useState({
    steps: dashboardSteps["dashboard"],
  });

  const {
    speedChartData,
    speedChartDataLoading,
    preventiveChartData,
    preventiveChartDataLoading,
    averageUtilizationChart,
    averageUtilizationChartLoading,
    DashboardData,
  } = usefetchHomeData();

  const [session] = useSession();

  const gtmDataLayer = {
    userId: session?.user?.user?.id ?? "Guest",
    userProject: "FMS",
    page: "index",
  };
  const gtmArgs = {
    dataLayer: gtmDataLayer,
    dataLayerName: "PageDataLayer",
  };

  TagManager.dataLayer(gtmArgs);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [allViolationChart, setAllViolationChart] = useState([]);
  const [allViolationLoading, setAllViolationLoading] = useState(false);
  const [parkingGroupChart, setParkingGroupChart] = useState([]);
  const [parkingGroupLoading, setParkingGroupLoading] = useState(false);

  const { t } = useTranslation("Tour");
  const { VehTotal, running } = useSelector((state) => state.streamData);

  const { myMap } = useSelector((state) => state.mainMap);
  const { darkMode } = useSelector((state) => state.config);

  const { trackStreamLoader } = useStreamDataState();

  const fetchAllViolationData = async () => {
    setAllViolationLoading(true);
    try {
      const respond = await axios.get(
        `dashboard/mainDashboard/averageViolations`
      );
      setAllViolationChart(respond?.data?.AverageViolationCount);

      setAllViolationLoading(false);
    } catch (error) {
      setAllViolationLoading(false);
    }
    // return true;
  };
  const fetchParkingGroupsData = async () => {
    setAllViolationLoading(true);
    try {
      const respond = await axios.get(
        `dashboard/management/parking/vehiclesCount`
      );
      setParkingGroupChart(respond?.data?.result);
      setParkingGroupLoading(false);
    } catch (error) {
      setParkingGroupLoading(false);
    }
  };
  // progress count up wait till loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(VehTotal).length > 0) {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [VehTotal]);

  useEffect(() => {
    if (myMap && !running) {
      myMap?.deselectAll();
      trackStreamLoader();
      dispatch(updateStRunning());
    }
  }, [myMap]);

  useEffect(() => {
    const htmlTag = document.getElementsByTagName("html")[0];
    darkMode
      ? htmlTag.setAttribute("darkMode", true)
      : htmlTag.setAttribute("darkMode", false);
  }, [darkMode]);

  useEffect(() => {
    fetchAllViolationData();
    fetchParkingGroupsData();
    const intervalId = setInterval(() => {
      fetchAllViolationData();
    }, 2 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  return (
    <div className="p-3">
      <Joyride
        steps={steps}
        continuous
        callback={(data) => dispatch(handleJoyrideCallback(data))}
        run={tourState}
        showSkipButton
        beaconComponent={false}
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
            zIndex: 10000,
          },
        }}
      />

      <>
        <Row>
          {/* ############################  progress bars + Map  ############################################## */}

          <Col lg="6">
            <Row>
              <div id="progress-bar">
                <Progress loading={loading} />
              </div>
            </Row>
          </Col>
          {/* map */}
          <Col lg="6" id="map-section">
            <Card style={{ height: "calc(100% - 2rem)" }}>
              <Card.Body className="p-0 position-relative">
                <Google myMap={myMap} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {/* ############################  Charts  ############################################## */}
        <Row>
          {/* charts part one */}
          <AllViolationsChart
            data={allViolationChart}
            loading={allViolationLoading}
          />
        </Row>
        <Row>
          <VehiclesStatusChart />
          {/* charts part two */}
          {/* charts part two */}
          <AverageUtilizationChart
            data={averageUtilizationChart}
            loading={averageUtilizationChartLoading}
          />
        </Row>
        <Row>
          <ParkingGroupsChart
            data={parkingGroupChart}
            loading={parkingGroupLoading}
          />
        </Row>
        <Row>
          {/* chart part three */}

          <AverageSpeedAndDistanceChart
            data={speedChartData}
            loading={speedChartDataLoading}
          />

          {/* chart part four */}
          <OverallPreventiveMaintenance
            data={preventiveChartData?.allMaintenance || []}
            loading={preventiveChartDataLoading}
          />
        </Row>
        {/* ############################ cards for rates  ############################################## */}
        <Row>
          <CardsForRates data={DashboardData} />
        </Row>
        {/* ############################ table  ############################################## */}
        <Row>
          <NextrepairplansTable
            data={preventiveChartData?.Upcoming_Maintenance_Plans || []}
          />
        </Row>
      </>
    </div>
  );
};
// test
// translation ##################################
export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (session?.user?.user?.role?.toLowerCase() === "user") {
    return {
      redirect: {
        destination: "/track",
        permanent: false,
      },
    };
  }
  if (session?.user?.user?.role?.toLowerCase() === "supportrepresentative") {
    return {
      redirect: {
        destination: "/support-representative",
        permanent: false,
      },
    };
  }

  return {
    props: {
      locale: context.locale,
      ...(await serverSideTranslations(context.locale, [
        "Dashboard",
        "main",
        "Tour",
      ])),
    },
  };
}
export default Home;

// translation ##################################
