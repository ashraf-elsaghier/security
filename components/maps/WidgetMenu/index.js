import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlidersH } from "@fortawesome/free-solid-svg-icons";
import Styles from "styles/WidgetMenu.module.scss";
import { useSelector } from "react-redux";
import MenuTree from "./menuTree";
import FilterTree from "./cars-filter";
import InputsFilter from "./inputsFilter";
import { Resizable } from "react-resizable";

import useConfig from "hooks/useConfig";
import MainFilter from "./MainFilter";
import React from "react";
import Spinner from "components/UI/Spinner";
import ConfigSettings from "./ConfigSettings";
const WidgetMenu = ({
  toggleMinuTrack,
  handleToggleMinuTrack,
  selectedVehicles,
  setSelectedVehicles,
  setclusterToggle,
  allTreeData,
  setAllTreeData,
}) => {
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);
  const { notConnectedVehicles } = useSelector((state) => state.streamData);

  const [treeFilter, setTreeFilter] = useState("");
  const darkMode = useSelector((state) => state.config.darkMode);
  const [filterBy, setfilterBy] = useState("DisplayName");
  const [activeCar, setActiveCar] = useState();
  const {
    handleSaveUpdates,
    handleConfigActive,
    handleConfigSettingActive,
    setisToggleConfigOpen,
    setToggleConfig,
    handleIconVehicle,
    isToggleConfigOpen,
    vehicleIcon,
    ToggleConfig,
  } = useConfig(selectedVehicles);

  const onResize = (event, { size }) => {
    setToggleConfig({
      ...ToggleConfig,
      treeBoxWidth: size.width,
    });
  };

  return (
    <>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9990,
          }}
        >
          <Spinner />
        </div>
      )}
      <aside className={`${darkMode && Styles.dark}`}>
        <nav
          className={`${Styles.nav} ${
            toggleMinuTrack && Styles.active
          } position-absolute rounded shadow-lg pt-5 overflow-hidden`}
          id="widget-menu"
          style={{
            minWidth: parseInt(ToggleConfig?.treeBoxWidth) + "px",
            zIndex: "9996 !important",
            width: "200px !important",
          }}
        >
          <Resizable
            width={+ToggleConfig?.treeBoxWidth}
            height={200}
            onResize={onResize}
            resizeHandles={["w"]}
            className="box"
            maxConstraints={[700, 100]}
            minConstraints={[21.875 * 16, 100]}
            axis="x"
          >
            <>
              {/* Main Filter */}
              <div
                style={{ height: "240px", zIndex: "50" }}
                className="position-relative"
              >
                <MainFilter
                  setAllTreeData={setAllTreeData}
                  setSelectedVehicles={setSelectedVehicles}
                  setFilterStatus={setFilterStatus}
                  filterStatus={filterStatus}
                />

                {/* Cars Filter */}
                <div
                  className={`  ${Styles.nav__item} ${Styles.active} mb-1`}
                  id="car-filter"
                >
                  <FilterTree
                    vehicleIcon={vehicleIcon}
                    setSelectedVehicles={setSelectedVehicles}
                    setAllTreeData={setAllTreeData}
                    setFilterStatus={setFilterStatus}
                    setclusterToggle={setclusterToggle}
                    filterStatus={filterStatus}
                    selectedVehicles={selectedVehicles}
                    activeCar={activeCar}
                    setActiveCar={setActiveCar}
                  />
                </div>

                <div
                  className={` ${Styles.nav__item} ${
                    toggleMinuTrack && Styles.active
                  } mb-1`}
                >
                  <InputsFilter
                    setAllTreeData={setAllTreeData}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                    setSelectedVehicles={setSelectedVehicles}
                    selectedVehicles={selectedVehicles}
                    setclusterToggle={setclusterToggle}
                    setTreeFilter={setTreeFilter}
                    filterBy={filterBy}
                    setfilterBy={setfilterBy}
                    allTreeData={allTreeData}
                    activeCar={activeCar}
                  />
                </div>
              </div>
              {/* MenuTree */}
              <div
                className={`${Styles.nav__item} ${
                  toggleMinuTrack && Styles.active
                } border-top pt-2`}
              >
                <MenuTree
                  vehicleIcon={vehicleIcon}
                  setSelectedVehicles={setSelectedVehicles}
                  allTreeData={allTreeData}
                  selectedVehicles={selectedVehicles}
                  setclusterToggle={setclusterToggle}
                  setLoading={setLoading}
                  ToggleConfig={ToggleConfig}
                  filterStatus={filterStatus}
                  treeFilter={treeFilter}
                  filterBy={filterBy}
                />
              </div>

              {/* Config Settings */}
              <button
                id="config-menu"
                onClick={() => setisToggleConfigOpen((prev) => !prev)}
                type="button"
                className={Styles.config_btn}
              >
                <FontAwesomeIcon icon={faSlidersH} />
              </button>

              <ConfigSettings
                handleSaveUpdates={handleSaveUpdates}
                handleConfigActive={handleConfigActive}
                handleConfigSettingActive={handleConfigSettingActive}
                setisToggleConfigOpen={setisToggleConfigOpen}
                setToggleConfig={setToggleConfig}
                handleIconVehicle={handleIconVehicle}
                isToggleConfigOpen={isToggleConfigOpen}
                toggleMinuTrack={toggleMinuTrack}
                ToggleConfig={ToggleConfig}
                vehicleIcon={vehicleIcon}
              />
            </>
          </Resizable>
        </nav>

        {/* Close Btn */}
        <div
          id="track-toggle"
          onClick={handleToggleMinuTrack}
          className={`${Styles.hamburger} ${toggleMinuTrack && Styles.active}`}
        >
          <span className={Styles.hamburger__patty} />
          <span className={Styles.hamburger__patty} />
          <span className={Styles.hamburger__patty} />
        </div>
      </aside>
    </>
  );
};

export default WidgetMenu;
