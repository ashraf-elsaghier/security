import { useVehicleContext } from "context/VehiclesContext";
import { useTranslation } from "next-i18next";
import { memo, useEffect, useRef, useState } from "react";
import {
  ButtonGroup,
  Dropdown,
  DropdownButton,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import styles from "styles/WidgetMenu.module.scss";

const InputsFilter = ({
  setAllTreeData,
  filterStatus,
  setFilterStatus,
  setSelectedVehicles,
  selectedVehicles,
  setclusterToggle,
  setTreeFilter
}) => {
  const [currentTimeOut, setCurrentTimeOut] = useState(null);
  const [filterBy, setfilterBy] = useState("DisplayName");
  const { t } = useTranslation("common");
  const { vehicles } = useVehicleContext();
  const displayNameRef = useRef(null);
  const serialNumberRef = useRef(null);
  const addressRef = useRef(null);
  const plateNumberRef = useRef(null);
  const speedToRef = useRef(null);
  const speedFromRef = useRef(null);
  let listOfFilterMap = [
    "Speed",
    "Address",
    "SerialNumber",
    "PlateNumber",
    "DisplayName",
  ];
  const selectedSerials = selectedVehicles.map((v) => `${v.SerialNumber}`);
  const myMap = useSelector((state) => state.mainMap.myMap);

  useEffect(() => {
    if (
      vehicles.length &&
      (speedToRef.current?.value || speedFromRef.current?.value)
    ) {
      // setclusterToggle(false)

      setAllTreeData(
        vehicles.filter((e) => {
          const condition = (e?.Speed >= (speedFromRef.current?.value?.length
            ? speedFromRef.current.value
            : 0) &&
            e?.Speed <=
            (speedToRef.current?.value?.length
              ? speedToRef.current.value
              : 200)
          );
          if (
            selectedSerials.length &&
            !condition &&
            selectedSerials.includes(e.SerialNumber)
          ) {
            myMap.unpin(e.VehicleID, { doRezoom: false });
            // myMap.setCluster(false);
            setSelectedVehicles(
              selectedVehicles.filter((v) => {
                return !(e.SerialNumber == v.SerialNumber);
              })
            );
          }
          return condition;
        })
      );
    }
  }, [vehicles]);
  const handleChange = (e) => {
    setFilterStatus("InputFilter");
    const value = e.target.value;
    setTreeFilter(value)
    clearTimeout(currentTimeOut);
    const timeout = setTimeout(() => {
      let filteredVehicles = []
      switch (e.target.name) {
        case "address":
          filteredVehicles = vehicles.filter((e) => e?.Address?.toLowerCase().replace(/\s/g, "").includes(value.toLowerCase().replace(/\s/g, "")))
          setAllTreeData(filteredVehicles);
          break;
        case "PlateNumber":
          filteredVehicles  = vehicles.filter((e) =>e?.PlateNumber?.replace(/\s/g, "").toLowerCase()?.includes(value.trim()?.replace(/\s/g, "")?.toLowerCase()))
          setAllTreeData(filteredVehicles);
          break;
        case "DisplayName":
          filteredVehicles = vehicles.filter((e) =>e?.DisplayName?.replace(/\s/g, "").toLowerCase()?.includes(value?.replace(/\s/g, "")?.toLowerCase()))
          setAllTreeData(filteredVehicles);
          break;
        case "SerialNumber":
          filteredVehicles = vehicles.filter((e) => e?.SerialNumber?.includes(value.trim()))
          setAllTreeData(filteredVehicles);
          break;
        default:
          break;
      }
      if (selectedVehicles.length) {
        myMap.rezoomToCoordinates(filteredVehicles.filter((v)=>selectedSerials.includes(`${v.SerialNumber}`)).map((v)=> [v.Latitude,v.Longitude]))
      }
    }, 500);
    setCurrentTimeOut(timeout);
  };
  const handleSpeedChange = (e) => {
    clearTimeout(currentTimeOut);
    setFilterStatus("InputFilter");
    if (!speedToRef.current.value && !speedFromRef.current.value) {
      setAllTreeData(vehicles)
    }
    else {

      const filteredVehicles = vehicles.filter(
        (e) =>
          e?.Speed >= (speedFromRef.current?.value?.length
            ? speedFromRef.current.value
            : 0) &&
          e?.Speed <=
          (speedToRef.current?.value?.length
            ? speedToRef.current.value
            : 200)
      );
      const timeout = setTimeout(() => {
        selectedVehicles.forEach((veh) => {
          const { value: speedFromValue, name: speedFromName } = speedFromRef?.current
          const { value: speedToValue, name: speedToName } = speedToRef?.current
          if ((veh.Speed < speedFromValue && speedFromName == "speedFrom")) {
            myMap.unpin(veh.VehicleID)
          }

          if ((speedToValue && veh.Speed > speedToValue && speedToName == "speedTo")) {

            myMap.unpin(veh.VehicleID)
          }

        })


        setSelectedVehicles(filteredVehicles.filter((v) => selectedSerials.includes(`${v.SerialNumber}`)));
        setAllTreeData(filteredVehicles);
      }, 500);
      setCurrentTimeOut(timeout);
    }
  };
  useEffect(() => {
    if (filterStatus !== "InputFilter") {
      displayNameRef.current?.value = "";
      serialNumberRef.current?.value = "";
      plateNumberRef.current?.value = "";
      addressRef.current?.value = "";
      speedToRef.current?.value = "";
      speedFromRef.current?.value = "";
      setSelectedVehicles([])
    }
  }, [filterStatus]);
  return (
    <>
      <InputGroup id="search-filter">
        {filterBy === "Speed" && (
          <>
            <span className="mt-2 mx-1">{t("from")}</span>
            <FormControl
              ref={speedFromRef}
              dir="auto"
              className="text-start"
              type="number"
              name="speedFrom"
              placeholder={`${t("Enter")} ${t(filterBy)}...`}
              onChange={handleSpeedChange}
            />
            <span className="mt-2 mx-1">{t("to")}</span>
            <FormControl
              ref={speedToRef}
              type="number"
              className="me-2"
              placeholder={`${t("Enter")} ${t(filterBy)}...`}
              name="speedTo"
              onChange={handleSpeedChange}
            />
          </>
        )}
        {filterBy === "Address" && (
          <FormControl
            ref={addressRef}
            type="text"
            name="address"
            placeholder={`${t("Enter")}  ${t(filterBy)}...`}
            onChange={handleChange}
          />
        )}

        {filterBy === "DisplayName" && (
          <FormControl
            ref={displayNameRef}
            type="text"
            name="DisplayName"
            placeholder={`${t("Enter")}  ${t(filterBy)}...`}
            onChange={handleChange}
          />
        )}

        {filterBy === "PlateNumber" && (
          <FormControl
            ref={plateNumberRef}
            type="text"
            name="PlateNumber"
            placeholder={`${t("Enter")}  ${t(filterBy)}...`}
            onChange={handleChange}
          />
        )}

        {filterBy === "SerialNumber" && (
          <FormControl
            ref={serialNumberRef}
            type="number"
            name="SerialNumber"
            placeholder={`${t("Enter")}  ${t(filterBy)}...`}
            onChange={handleChange}
          />
        )}

        <DropdownButton
          as={ButtonGroup}
          variant="outline-primary"
          title={t(filterBy)}
          id="input-group-dropdown-4"
          align="end"
        >
          {listOfFilterMap?.map((item, key) => {
            if (filterBy !== item) {
              return (
                <Dropdown.Item
                  onClick={() => {
                    displayNameRef.current?.value = "";
                    serialNumberRef.current?.value = "";
                    plateNumberRef.current?.value = "";
                    addressRef.current?.value = "";
                    speedToRef.current?.value = "";
                    speedFromRef.current?.value = "";
                    setAllTreeData(vehicles);
                    setFilterStatus("InputFilter");
                    setfilterBy(item);
                    // setSelectedVehicles([]);
                    // myMap.deselectAll()
                    setTreeFilter("")
                  }}
                  key={key}
                  href="#"
                  className={`${styles.dropDownItem} bg-soft-primary nav-link py-2`}
                >
                  {t(item)}
                </Dropdown.Item>
              );
            }
          })}
        </DropdownButton>
      </InputGroup>
    </>
  );
};

export default memo(InputsFilter);
