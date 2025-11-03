import { memo, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { Button, Col, Image, Row } from "react-bootstrap";
import Styles from "../../../styles/Filter_tree.module.scss";
import { useVehicleContext } from "context/VehiclesContext";
import { useSelector } from "react-redux";
const FilterTree = ({
  vehicleIcon,
  setSelectedVehicles,
  setAllTreeData,
  setFilterStatus,
  setclusterToggle,
  filterStatus,
  selectedVehicles,
  activeCar,
  setActiveCar,
}) => {
  const { t } = useTranslation("Dashboard");
  const [lang, setlang] = useState();
  const { vehicles } = useVehicleContext();
  const FilterCars = (id) => {
    myMap.deselectAll();
    setFilterStatus("carFilter");
    setSelectedVehicles([]);
    setActiveCar((prev) => (prev === id ? null : id));
    setAllTreeData(
      vehicles.filter((e) =>
        id !== 201
          ? e.VehicleStatus == id
          : e.VehicleStatus == id || e.VehicleStatus == 203
      )
    );
    if (id == activeCar) setAllTreeData(vehicles);
  };
  const myMap = useSelector((state) => state.mainMap.myMap);
  const selectedSerials = selectedVehicles.map((v) => `${v.SerialNumber}`);
  useEffect(() => {
    // Check if there is an active car
    if (activeCar && activeCar != 201) {
      // Reset clusterToggle to false when there is an active car
      // Filter vehicles based on conditions and update state
      setAllTreeData(
        vehicles.filter((e) => {
          // Check if the vehicle status is the same as the active car
          if (
            selectedSerials.length &&
            e.VehicleStatus !== activeCar &&
            selectedSerials.includes(e.SerialNumber)
          ) {
            // Unpin the vehicle from the map and update selected vehicles
            myMap.unpin(e.VehicleID, { doRezoom: false });
            setSelectedVehicles((selectedVehicles) =>
              selectedVehicles.filter((v) => e.SerialNumber !== v.SerialNumber)
            );
          }

          // Return true only for vehicles with the same status as the active car
          return e.VehicleStatus === activeCar;
        })
      );
    }
  }, [vehicles]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setlang(window.location.href.includes("/ar"));
    }
  }, []);
  useEffect(() => {
    if (filterStatus !== "carFilter") {
      setActiveCar(null);
    }
  }, [filterStatus]);
  const cars = [
    {
      id: 1,
      title: t("Running"),
      img: `${vehicleIcon}1.png`,
    },
    {
      id: 0,
      title: t("Stopped"),
      img: `${vehicleIcon}0.png`,
    },
    {
      id: 2,
      title: t("Idling"),
      img: `${vehicleIcon}2.png`,
    },
    {
      id: 5,
      title: t("Offline"),
      img: `${vehicleIcon}5.png`,
    },
    {
      id: 101,
      title: t("Over_Speed"),
      img: `${vehicleIcon}101.png`,
    },
    {
      id: 100,
      title: t("Over_Street_Speed"),
      img: `${vehicleIcon}100.png`,
    },
    {
      id: 201,
      title: t("Invalid_Locations"),
      img: `${vehicleIcon}201.png`,
    },
    {
      id: 204,
      title: t("Sleep_mode"),
      img: `${vehicleIcon}204.png`,
    },
    {
      id: 500,
      title: t("Not_Connected"),
      img: `${vehicleIcon}500.png`,
    },
    {
      id: 501,
      title: t("UnAssigned"),
      img: `${vehicleIcon}501.png`,
    },
  ];

  return (
    <div className="mt-3">
      <Row className={`text-center rounded ${Styles.cars}`}>
        {cars?.map((car) => (
          <Col
            data-toggle="tooltip"
            data-placement="bottom"
            data-original-title={car.title}
            title={car.title}
            key={`car_icon_${car?.id}`}
            onClick={() => FilterCars(car?.id)}
            className={` 
            ${Styles.cars__car} ${Styles.active}
            ${
              activeCar === car?.id
                ? lang
                  ? Styles.btnActiveAr
                  : Styles.btnActive
                : ""
              }
            `}
            xs={1}
            style={{ marginInline: "2px" }}>
            <Button
              type="buttun"
              className={`${
                activeCar === car?.id ? "" : "bg-transparent opacity-2"
              }  border-0 p-1`}>
              <Image
                width={14}
                src={car?.img}
                alt={car?.title}
                title={car?.title}
              />
            </Button>
          </Col>
        ))}
      </Row>
    </div>
  );
};
export default memo(FilterTree);
