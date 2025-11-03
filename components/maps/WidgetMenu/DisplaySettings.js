import Switch from "@mui/material/Switch";
import { useSelector } from "react-redux";

const DisplaySettings = ({
  nameSettings,
  ToggleConfigSettings,
  ToggleConfigSettingsKey,
  t,
  setToggleConfig,
  label,
  handleConfigSettingActive,
}) => {
  const darkMode = useSelector((state) => state.config.darkMode);

  return (
    <>
      <p className="fs-5 text-secondary text-center">{t(`${nameSettings}`)}</p>
      {ToggleConfigSettings?.map((toggle, index) => (
        <div key={index} className="mt-3 col-6">
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div style={{ minWidth: "90px" }}>
              <span
                style={{
                  color: toggle?.value
                    ? darkMode
                      ? "#FFF"
                      : "#0E6395"
                    : darkMode
                    ? "#8A92A6"
                    : "#575757",
                  fontSize: ".9rem",
                }}
              >
                {t(toggle?.name)}
              </span>
            </div>
            <Switch
              onChange={(e) => {
                const newObg = ToggleConfigSettings?.findIndex(
                  (ele) => ele.name === e.target.name
                );
                setToggleConfig((prev) => ({
                  ...prev,
                  [ToggleConfigSettingsKey]: [
                    ...ToggleConfigSettings?.slice(0, newObg),
                    {
                      name: e.target.name,
                      value: !toggle.value,
                    },
                    ...ToggleConfigSettings?.slice(newObg + 1),
                  ],
                }));
              }}
              {...label}
              style={{
                color: toggle?.value
                  ? darkMode
                    ? "#FFF"
                    : "#0E6395"
                  : darkMode
                  ? "#8A92A6"
                  : "#575757",
              }}
              name={toggle?.name}
              value={toggle?.value ?? false}
              checked={toggle?.value ?? false}
              disabled={handleConfigSettingActive(toggle)}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default DisplaySettings;
