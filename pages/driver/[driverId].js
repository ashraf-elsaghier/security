import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faUserClock,
  faRoute,
} from "@fortawesome/free-solid-svg-icons";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  fetchDriverDataByRfid,
  fetchDriverData,
  fetchOverSpeedStatistics,
  fetchWeeklyTripsAndFuel,
  fetchUtzStatisticsAndBehavior,
} from "services/driver";
import { toast } from "react-toastify";
import DriverInfo from "components/driver/DriverInfo";
import DriverSpeedStatisticsChart from "components/driver/DriverSpeedStatisticsChart";
import DriverWeeklyTrip from "components/driver/DriverWeeklyTrip";
import DriverFuelConsumption from "components/driver/DriverFuelConsumption";
import DriverUtilizationStatistics from "components/driver/DriverUtilizationStatistics";
import DriverBehavior from "components/driver/DriverBehavior";
import { useTranslation } from "next-i18next";
import dynamic from "next/dist/shared/lib/dynamic";

const HeatMap = dynamic(() => import("components/maps/driverHeatMap"), {
  ssr: false,
});
const MostVisited = dynamic(() => import("components/maps/mostVistiedMap"), {
  ssr: false,
});

const Driver = ({ query }) => {
  let id = query.driverId;

  const [driverInfo, setDriverInfo] = useState(null);
  const [driverInfoLoading, setDriverInfoLoading] = useState(true);
  const [overSpeedStatistics, setOverSpeedStatistics] = useState([]);
  const [overSpeedStatisticsLoading, setOverSpeedStatisticsLoading] =
    useState(true);
  const [weeklyTripsAndFuel, setWeeklyTripsAndFuel] = useState([]);
  const [weeklyTripsAndFuelLoading, setWeeklyTripsAndFuelLoading] =
    useState(true);

  const [utzStatisticsAndBehavior, setUtzStatisticsAndBehavior] = useState({});
  const [utzStatisticsAndBehaviorLoading, setUtzStatisticsAndBehaviorLoading] =
    useState(true);
  const { t } = useTranslation(["driver"]);

  useEffect(() => {
    // fetch driver info(driver dashboard)
    const fetchDriverInfo = async () => {
      try {
        const respond = isNaN(id)
          ? await fetchDriverDataByRfid(id)
          : await fetchDriverData(id);
        if (respond?.length) return;
        id = respond?.driver[0]?.DriverID ? respond?.driver[0]?.DriverID : id;
        setDriverInfo(respond.driver[0]);
        setDriverInfoLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message);
        setDriverInfoLoading(false);
      }
    };

    fetchDriverInfo();

    // fetch Over Speed Statistics Chart
    const fetchOverSpeedStatisticsChart = async () => {
      try {
        if (isNaN(id)) return;
        const respond = await fetchOverSpeedStatistics(id);
        setOverSpeedStatistics(respond.overSpeed);
        setOverSpeedStatisticsLoading(false);
      } catch (error) {
        setOverSpeedStatisticsLoading(false);
        toast.error(error.response?.data?.message);
      }
    };
    fetchOverSpeedStatisticsChart();

    // fetch Weekly trips and fuel consumption
    const fetchWeeklyTripsAndFuelChart = async () => {
      try {
        if (isNaN(id)) return;
        const respond = await fetchWeeklyTripsAndFuel(id);
        setWeeklyTripsAndFuel(respond);
        setWeeklyTripsAndFuelLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message);
        setWeeklyTripsAndFuelLoading(false);
      }
    };
    fetchWeeklyTripsAndFuelChart();

    // fetch utilization statistics and driver behavior
    const fetchUtzStatisticsAndBehaviorChart = async () => {
      try {
        if (isNaN(id)) return;
        const respond = await fetchUtzStatisticsAndBehavior(id);
        setUtzStatisticsAndBehavior(respond?.getSteps);
        setUtzStatisticsAndBehaviorLoading(false);
      } catch (error) {
        toast.error(error.response.data?.message);
        setUtzStatisticsAndBehaviorLoading(false);
      }
    };
    fetchUtzStatisticsAndBehaviorChart();
  }, [id]);

  const cardsData = [
    {
      title: t("status_key"),
      value:
        utzStatisticsAndBehavior?.VehicleStatus || t("vehicle_disabled_key"),
      icon: faCheckCircle,
      color: "danger",
    },
    {
      title: t("driver_working_hours_key"),
      value:
        utzStatisticsAndBehavior?.W_Hours || t("never_connected_hours_key"),
      icon: faUserClock,
      color: "info",
    },
    {
      title: t("distance_key"),
      value: utzStatisticsAndBehavior?.Mileage || t("never_connected_KM_key"),
      icon: faRoute,
      color: "warning",
    },
  ];

  return (
    <div className="m-3">
      <Card>
        <Card.Body>
          <Row>
            {cardsData?.map(({ title, value, icon, color }, idx) => {
              return (
                <Col key={idx} md="4">
                  <Card className={`bg-soft-${color} my-1`}>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="text-start">
                          <h5 className="counter">{title}</h5>
                          {value}
                        </div>
                        <div
                          className={`bg-soft-${color} rounded p-3 text-center`}
                        >
                          <FontAwesomeIcon className="" icon={icon} size="2x" />
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
            <Col md="8" className="mt-3">
              {driverInfo !== null && (
                <DriverInfo
                  data={driverInfo}
                  behavior={utzStatisticsAndBehavior}
                  loading={driverInfoLoading}
                />
              )}
            </Col>

            <Col md="4" className="mt-3">
              <DriverBehavior
                data={utzStatisticsAndBehavior}
                loading={utzStatisticsAndBehaviorLoading}
              />
            </Col>
            <Col md="4">
              <DriverUtilizationStatistics
                data={utzStatisticsAndBehavior}
                loading={utzStatisticsAndBehaviorLoading}
              />
            </Col>
            <Col md="8">
              <DriverWeeklyTrip
                data={weeklyTripsAndFuel.getSteps}
                loading={weeklyTripsAndFuelLoading}
              />
            </Col>
            <Col md="6">
              <DriverFuelConsumption
                data={weeklyTripsAndFuel.fuels}
                loading={weeklyTripsAndFuelLoading}
              />
            </Col>
            <Col md="6">
              <DriverSpeedStatisticsChart
                data={overSpeedStatistics}
                loading={overSpeedStatisticsLoading}
              />
            </Col>

            <Col md="6">
              <Card className="shadow-sm border border-light">
                <Card.Body className="">
                  <h4 className="text-secondary text-center mb-3">
                    {t("trips_heat_map_key")}
                  </h4>

                  {/* Heat Map */}

                  <HeatMap id={id} />
                </Card.Body>
              </Card>
            </Col>
            <Col md="6">
              <Card className="shadow-sm border border-light">
                <Card.Body className="">
                  <h4 className="text-secondary text-center mb-3">
                    {t("most_visited_places_key")}
                  </h4>
                  <MostVisited idd={id} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};
export default Driver;

// translation ##################################
export async function getServerSideProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["main", "driver"])),
      query: context.query,
    },
  };
}
// translation ##################################
