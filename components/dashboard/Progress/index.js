import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { Card, Col } from "react-bootstrap";
import DProgress from "./dProgress";
import { useSelector } from "react-redux";
import Spinner from "components/UI/Spinner";
import { useVehicleContext } from "context/VehiclesContext";

export default function Index({ loading }) {
  const { VehTotal } = useSelector((state) => state.streamData);
  const { vehicles } = useVehicleContext();

  const ActiveVehs =
    vehicles?.filter((e) => e?.VehicleStatus !== 5)?.length || 0;
  const OfflineVehs =
    vehicles?.filter((e) => e?.VehicleStatus === 5)?.length || 0;
  const { t } = useTranslation("Dashboard");
  const totalVehs = VehTotal?.totalVehs || 0;

  const PercentageActiveVehcles =
    ((ActiveVehs * 100) / totalVehs)?.toFixed(1) || 0;

  const PercentageOfflineVehs =
    ((OfflineVehs * 100) / totalVehs)?.toFixed(1) || 0;

  const AllDrivers = VehTotal?.totalDrivers || 0;
  const ActiveDrivers = VehTotal?.activeDrivers || 0;
  const PercentageActiveDrivers =
    ((ActiveDrivers * 100) / AllDrivers).toFixed(1) || 0;

  return (
    <>
      <Col sm="12">
        <Card>
          <Card.Body>
            {VehTotal?.totalVehs !== undefined ? (
              <DProgress
                VehTotal={vehicles.length}
                loading={loading}
                duration={1.5}
                name={["Active_Vehicles", "Total_Vehicles"]}
                countStart={[0, 0]}
                countEnd={[ActiveVehs, totalVehs]}
                progresCount={PercentageActiveVehcles}
                color={"primary"}
              />
            ) : (
              <>
                <div className="d-flex align-items-center justify-content-between w-75">
                  <p className="fw-bold mt-2">{t("Active_Vehicles")}</p>
                  <p
                    className="fw-bold"
                    style={{
                      marginRight: "80px",
                    }}
                  >
                    {t("Total_Vehicles")}
                  </p>
                </div>
                <Spinner height={"150px"} />
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
      <Col sm="12">
        <Card>
          <Card.Body>
            {VehTotal?.totalVehs !== undefined ? (
              <DProgress
                loading={loading}
                duration={1.5}
                name={["Offline_Vehicles"]}
                countStart={[0]}
                countEnd={[OfflineVehs]}
                progresCount={PercentageOfflineVehs}
                color={"warning"}
              />
            ) : (
              <>
                <p className="fw-bold">{t("Offline_Vehicles")}</p>
                <Spinner height={"150px"} />
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
      <Col sm="12">
        <Card>
          <Card.Body>
            {VehTotal?.totalDrivers !== undefined ? (
              <DProgress
                loading={loading}
                duration={1.5}
                name={["Active_Drivers", "Total_Drivers"]}
                countStart={[0, 0]}
                countEnd={[ActiveDrivers, AllDrivers]}
                progresCount={PercentageActiveDrivers}
                color={"danger"}
              />
            ) : (
              <>
                <div className="d-flex align-items-center justify-content-between w-75">
                  <p className="fw-bold mt-2 ">{t("Active_Drivers")}</p>
                  <p
                    className="fw-bold"
                    style={{
                      marginRight: "80px",
                    }}
                  >
                    {t("Total_Drivers")}
                  </p>
                </div>
                <Spinner height={"150px"} />
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}
