import React, { useEffect, useState } from "react";
import { Card, Col, Row, Container } from "react-bootstrap";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import VehicleInfo from "components/vehicle/VehicleInfo";
import VehicleBehavior from "components/vehicle/VehicleBehavior";
import VehicleUtilization from "components/vehicle/VehicleUtilization";
import VehicleAvgHumidity from "components/vehicle/VehicleAvgHumidity";
import VehicleAvgWeight from "components/vehicle/VehicleAvgWeight";
import VehicleWeight from "components/vehicle/VehicleWeight";
import VehicleTemp from "components/vehicle/VehicleTemp";
import VehicleHumidity from "components/vehicle/VehicleHumidity";
import VehicleAvgTemp from "components/vehicle/VehicleAvgTemp";
import VehicleMaintenance from "components/vehicle/VehicleMaintenance";
import VehicleViolations from "components/vehicle/VehicleViolations";
import {
  fetchVehicleData,
  fetchVehicleBehaviorAndUtiz,
  fetchVehicleWeight,
  fetchVehicleHumidity,
  fetchVehicleTemperature,
  fetchVehicleMaintenance,
  fetchVehiclePositions,
} from "services/vehicle/index";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import EmptyMess from "components/UI/ChartErrorMsg";
import Spinner from "components/UI/Spinner";
import { useTranslation } from "next-i18next";

const Vector = dynamic(() => import("components/maps/vector.js"), {
  ssr: false,
});

const VehiclesDashboard = ({ query }) => {
  const { t } = useTranslation(["vehicle"]);

  const L = require("leaflet");
  const { vehicleId } = query;
  const [vehicleInfo, setVehicleInfo] = useState({});
  const [vehicleInfoLoading, setVehicleInfoLoading] = useState(true);
  const [vehicleBehaviorAndUtiz, setVehicleBehaviorAndUtiz] = useState(null);
  const [vehicleBehaviorAndUtizLoading, setVehicleBehaviorAndUtizLoading] =
    useState(true);
  const [vehicleWeight, setVehicleWeight] = useState({});
  const [vehicleWeightLoading, setVehicleWeightLoading] = useState(true);
  const [vehicleHumidity, setVehicleHumidity] = useState({});
  const [vehicleHumidityLoading, setVehicleHumidityLoading] = useState(true);
  const [vehicleTemp, setVehicleTemp] = useState({});
  const [vehicleTempLoading, setVehicleTempLoading] = useState(true);
  const [vehicleMaintenance, setVehicleMaintenance] = useState([]);
  const [vehicleMaintenanceLoading, setVehicleMaintenanceLoading] =
    useState(true);
  const [mapPins, setMapPins] = useState([]);
  const [mapPinsLoading, setMapPinsLoading] = useState(true);

  const { myMap } = useSelector((state) => state.mainMap);

  const {
    config: { darkMode },
  } = useSelector((state) => state);

  useEffect(() => {
    // fetch vehicle info
    (async () => {
      try {
        const respond = await fetchVehicleData(vehicleId);
        setVehicleInfo(respond.Vehicle);
        setVehicleInfoLoading(false);
      } catch (error) {
        toast.error(error.response.data?.message);
        setVehicleInfoLoading(false);
      }
    })();

    // fetch vehicle behavior and utilization
    (async () => {
      try {
        const respond = await fetchVehicleBehaviorAndUtiz(vehicleId);
        setVehicleBehaviorAndUtiz(respond);
        setVehicleBehaviorAndUtizLoading(false);
      } catch (error) {
        toast.error(error.response.data?.message);
        setVehicleBehaviorAndUtizLoading(false);
      }
    })();

    // fetch vehicle Humidity
    (async () => {
      try {
        const respond = await fetchVehicleHumidity(vehicleId);
        setVehicleHumidity(respond);
        setVehicleHumidityLoading(false);
      } catch (error) {
        toast.error(error.response.data?.message);
        setVehicleHumidityLoading(false);
      }
    })();

    // fetch vehicle Temperature
    (async () => {
      try {
        const respond = await fetchVehicleTemperature(vehicleId);
        setVehicleTemp(respond);
        setVehicleTempLoading(false);
      } catch (error) {
        toast.error(error.response.data?.message);
        setVehicleTempLoading(false);
      }
    })();

    // fetch vehicle weight
    (async () => {
      try {
        const respond = await fetchVehicleWeight(vehicleId);
        setVehicleWeight(respond);
        setVehicleWeightLoading(false);
      } catch (error) {
        toast.error(error.response.data?.message);
        setVehicleWeightLoading(false);
      }
    })();

    // fetch Vehicle Maintenance
    (async () => {
      try {
        const respond = await fetchVehicleMaintenance(vehicleId);
        setVehicleMaintenance(respond.allMaintenance);
        setVehicleMaintenanceLoading(false);
      } catch (error) {
        toast.error(error.response.data?.message);
        setVehicleMaintenanceLoading(false);
      }
    })();
  }, [vehicleId]);

  useEffect(() => {
    // fetch vehicle positions for map
    (async () => {
      try {
        const respond = await fetchVehiclePositions(vehicleId);
        setMapPins(respond?.mostVisited);
        const positions = respond?.mostVisited;
        if (L && myMap) {
          positions.map((position) =>
            L?.marker(L.latLng(position?._id.lat, position?._id.long)).addTo(
              myMap
            )
          );
          myMap.panTo(
            new L.LatLng(positions[0]._id.lat, positions[0]._id.long)
          );
        }
        setMapPinsLoading(false);
      } catch (error) {
        toast.error(error.response.data?.message);
        setVehicleMaintenanceLoading(false);
        setMapPinsLoading(false);
      }
    })();
  }, [L, myMap, vehicleId]);

  return (
    <Container
      fluid
      className={`
      ${darkMode ? "" : "bg-light"}
      `}
    >
      <VehicleInfo data={vehicleInfo} loading={vehicleInfoLoading} />

      <Row>
        <VehicleBehavior
          data={vehicleBehaviorAndUtiz?.utilization}
          loading={vehicleBehaviorAndUtizLoading}
        />

        <VehicleViolations data={vehicleBehaviorAndUtiz?.violations} />

        <VehicleUtilization
          data={vehicleBehaviorAndUtiz?.utilization}
          loading={vehicleBehaviorAndUtizLoading}
        />

        <VehicleAvgHumidity
          data={vehicleHumidity.allHumidity}
          loading={vehicleHumidityLoading}
        />

        <VehicleAvgTemp
          data={vehicleTemp.allTemperatures}
          loading={vehicleTempLoading}
        />

        <VehicleAvgWeight
          data={vehicleWeight.avgWeights}
          loading={vehicleWeightLoading}
        />

        <VehicleHumidity
          data={vehicleHumidity.hum}
          loading={vehicleHumidityLoading}
        />

        <VehicleTemp data={vehicleTemp.temp} loading={vehicleTempLoading} />

        <VehicleWeight
          data={vehicleWeight.weight}
          loading={vehicleWeightLoading}
        />
        <VehicleMaintenance
          data={vehicleMaintenance}
          loading={vehicleMaintenanceLoading}
        />
        {/* map component */}
        <Col lg="5">
          <Card style={{ height: "calc(100% - 2rem)" }}>
            {mapPinsLoading ? (
              <Spinner />
            ) : mapPins.length > 0 ? (
              <Card.Body>
                <h5 className="mb-4">{t("most_visited_places_key")}</h5>
                <div
                  style={{ height: "calc(100% - 3rem)" }}
                  className="d-flex justify-content-center align-items-center"
                >
                  <Vector height="45vh" />
                </div>
              </Card.Body>
            ) : (
              <EmptyMess msg={`${t("oops!_no_data_found_key")}.`} />
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VehiclesDashboard;

// translation ##################################
export async function getServerSideProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["main", "vehicle"])),
      query: context.query,
    },
  };
}
// translation ##################################
