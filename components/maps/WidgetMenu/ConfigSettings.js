import DisplaySettings from "./DisplaySettings";
import ReactSelect from "components/Select";
import Image from "next/image";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Styles from "styles/WidgetMenu.module.scss";
import { useTranslation } from "next-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";

const ConfigSettings = ({
  handleSaveUpdates,
  handleConfigActive,
  handleConfigSettingActive,
  setisToggleConfigOpen,
  setToggleConfig,
  handleIconVehicle,
  isToggleConfigOpen,
  toggleMinuTrack,
  ToggleConfig,
  vehicleIcon,
}) => {
  const { t } = useTranslation("common");
  const darkMode = useSelector((state) => state.config.darkMode);

  const label = { inputProps: { "aria-label": "Switch demo" } };
  const VehicleOptions = [
    {
      label: `${t("sedan_key")} 1`,
      value: "/assets/images/cars/car0/",
      img: "/assets/images/cars/car0/1.png",
    },
    {
      label: `${t("minivan_key")}`,
      value: "/assets/images/cars/car1/",
      img: "/assets/images/cars/car1/1.png",
    },
    {
      label: `${t("sedan_key")} 2`,
      value: "/assets/images/cars/car2/",
      img: "/assets/images/cars/car2/1.png",
    },
    {
      label: `${t("pickup_key")}`,
      value: "/assets/images/cars/car3/",
      img: "/assets/images/cars/car3/1.png",
    },
    {
      label: `${t("truck_head_key")}`,
      value: "/assets/images/cars/car4/",
      img: "/assets/images/cars/car4/1.png",
    },
    {
      label: `${t("reefer_truck_key")}`,
      value: "/assets/images/cars/car5/",
      img: "/assets/images/cars/car5/1.png",
    },
    {
      label: `${t("jeep_key")}`,
      value: "/assets/images/cars/car6/",
      img: "/assets/images/cars/car6/1.png",
    },
    {
      label: `${t("bus_key")}`,
      value: "/assets/images/cars/car7/",
      img: "/assets/images/cars/car7/1.png",
    },
    {
      label: `${t("truck_key")}`,
      value: "/assets/images/cars/car8/",
      img: "/assets/images/cars/car8/1.png",
    },
    {
      label: `${t("forklift_key")}`,
      value: "/assets/images/cars/car9/",
      img: "/assets/images/cars/car9/1.png",
    },
    {
      label: `${t("generator_key")}`,
      value: "/assets/images/cars/car10/",
      img: "/assets/images/cars/car10/1.png",
    },
    {
      label: `${t("camera_live_key")}`,
      value: "/assets/images/cars/car11/",
      img: "/assets/images/cars/car11/1.png",
    },
  ];

  return (
    <div className={`${Styles.config} ${isToggleConfigOpen && Styles.active}`}>
      <button
        onClick={() => setisToggleConfigOpen((prev) => !prev)}
        type="button"
        className={Styles.config_btn_close}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <h4 className={`${Styles.title} pt-2`}>{t("Config")}</h4>
      <div
        className={`sidebar-body pt-3 data-scrollbar menu-scrollbar ${Styles.config_main}`}
        data-scroll="1"
      >
        <div
          className={`${Styles.nav__item} ${toggleMinuTrack && Styles.active}`}
        >
          <div className="container">
            <div className="row">
              <div className="d-flex justify-content-between align-items-center mt-5">
                <span className={`text-${darkMode ? "light" : "primary"}`}>
                  800px
                </span>
                <span className={`text-${darkMode ? "light" : "primary"}`}>
                  350px
                </span>
              </div>
              <input
                style={{
                  transform: "rotate(-180deg)",
                  background: "none",
                }}
                type="range"
                id="WedgitTreeWidthInput"
                name="volume"
                step={5}
                value={ToggleConfig?.treeBoxWidth}
                onChange={(e) => {
                  setToggleConfig({
                    ...ToggleConfig,
                    treeBoxWidth: e.currentTarget.value,
                  });
                }}
                min={parseInt(21.875 * 16)}
                max="800"
              />
            </div>
            <div
              className="row"
              style={{
                height: "65vh",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <p className="fs-5 text-secondary text-center">
                {t("vehicle_icon_key")}
              </p>
              <ReactSelect
                onSelectChange={handleIconVehicle}
                // value={vehicleIcon}
                options={VehicleOptions}
                defaultValue={VehicleOptions[0]}
                label={t("select_car_icon_key")}
                className="mb-3"
                formatOptionLabel={(guide) => (
                  <div className="d-flex align-items-center ps-3">
                    <span style={{ rotate: "90deg" }}>
                      {/* {guide.icon} */}
                      <Image
                        width={14}
                        height={
                          guide?.value == "/assets/images/cars/car11/" ? 14 : 30
                        }
                        src={guide?.img}
                        alt={guide?.label}
                        title={guide?.label}
                      />
                    </span>

                    <span className="ms-2 text-capitalize px-2">
                      {guide.label}
                    </span>
                  </div>
                )}
              />
              <DisplaySettings
                nameSettings="Meters_Settings"
                ToggleConfigSettings={ToggleConfig?.ToggleConfig}
                ToggleConfigSettingsKey="ToggleConfig"
                t={t}
                setToggleConfig={setToggleConfig}
                label={label}
                handleConfigSettingActive={handleConfigActive}
              />
              <hr className="mt-2 bg-secondary" />
              <DisplaySettings
                nameSettings="Display_Settings"
                ToggleConfigSettings={ToggleConfig?.ToggleConfigSettings}
                ToggleConfigSettingsKey="ToggleConfigSettings"
                t={t}
                setToggleConfig={setToggleConfig}
                label={label}
                handleConfigSettingActive={handleConfigSettingActive}
              />

              <div className="my-3">
                <button
                  onClick={handleSaveUpdates}
                  id="Save_changesTrackConfig"
                  className="btn btn-primary w-50 d-block px-4 py-2 mx-auto mb-4"
                >
                  {t("Save_changes")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigSettings;
