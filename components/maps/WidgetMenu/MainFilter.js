import { useVehicleContext } from "context/VehiclesContext";
import { useTranslation } from "next-i18next";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Styles from "styles/WidgetMenu.module.scss";

const MainFilter = ({
  setAllTreeData,
  setSelectedVehicles,
  setFilterStatus,
  filterStatus,
}) => {
  const { t } = useTranslation("common");
  const [activeFilter, setActiveFilter] = useState("All");
  const { vehicles } = useVehicleContext();
  const myMap = useSelector((state) => state.mainMap.myMap);

  const handleMainFilter = (e) => {
    myMap.deselectAll();
    setSelectedVehicles([]);
    setFilterStatus("mainFilter");
    switch (e.target.name) {
      case "All":
        setActiveFilter("All");
        setAllTreeData(vehicles);
        break;
      case "Active":
        setActiveFilter("Active");
        setAllTreeData(vehicles?.filter((e) => e?.VehicleStatus !== 5));
        break;
      case "Offline":
        setActiveFilter("Offline");
        setAllTreeData(vehicles?.filter((e) => e?.VehicleStatus === 5));
        break;
      default:
        setActiveFilter("All");
        setAllTreeData(vehicles);
        break;
    }
  };

  useEffect(() => {
    if (filterStatus !== "mainFilter") {
      setActiveFilter("All");
    }
  }, [filterStatus]);
  const dataMainFilter = useMemo(() => {
    return [
      {
        id: "btn-check-all",
        text: "All",
        val: null,
        num: vehicles.length || 0,
      },
      {
        id: "btn-check-active",
        text: "Active",
        val: 5,
        num: vehicles?.filter((e) => e?.VehicleStatus !== 5)?.length,
      },
      {
        id: "btn-check-offline",
        text: "Offline",
        val: -5,
        num: vehicles?.filter((e) => e?.VehicleStatus === 5)?.length,
      },
    ];
  }, [vehicles]);
  return (
    <div className={`  ${Styles.nav__item} ${Styles.active}`}>
      <div
        className={`${Styles.section__one} d-flex align-items-center justify-content-center text-center`}
      >
        {dataMainFilter?.map(({ id, text, val, num }, key) => (
          <Fragment key={key}>
            <input
              type="radio"
              name={text}
              className="btn-check"
              id={id}
              autoComplete="off"
              onChange={handleMainFilter}
              checked={activeFilter == text}
              value={val}
            />
            <label
              className="btn btn-outline-primary mx-2 rounded d-flex  justify-content-center flex-column"
              htmlFor={id}
              id={`${id}-tour`}
            >
              <span>{t(text)}</span>
              <span>{num}</span>
            </label>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default MainFilter;
