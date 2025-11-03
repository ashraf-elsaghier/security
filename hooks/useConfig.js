import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const useConfig = (selectedVehicles) => {
  const [ToggleConfig, setToggleConfig] = useState({
    ToggleConfig: [
      { name: "Speed", value: true },
      { name: "Mileage", value: true },
      { name: "TotalWeight", value: true },
      { name: "Direction", value: false },
      { name: "EngineStatus", value: false },
      { name: "Temp", value: false },
      { name: "Humidy", value: false },
    ],
    ToggleConfigSettings: [
      { name: "DisplayName", value: true },
      { name: "PlateNumber", value: true },
      { name: "SerialNumber", value: true },
    ],
    treeBoxWidth: window.innerWidth < 375 ? 300 : 350,
  });

  const [vehicleIcon, setVehicleIcon] = useState("/assets/images/cars/car0/");
  const { notConnectedVehicles } = useSelector((state) => state.streamData);

  const myMap = useSelector((state) => state.mainMap.myMap);

  const [isToggleConfigOpen, setisToggleConfigOpen] = useState(false);

  const fetchDataConfigWidgetMenu = async () => {
    await axios
      .get(`config`)
      .then((response) => {
        const configurations = response.data.configs[0].configurations;

        if (configurations) {
          setToggleConfig({
            ToggleConfig: [
              {
                name: "Speed",
                value:
                  configurations["Speed"] || ToggleConfig.ToggleConfig["Speed"],
              },
              {
                name: "Mileage",
                value:
                  configurations["Mileage"] ||
                  ToggleConfig.ToggleConfig["Mileage"],
              },
              {
                name: "TotalWeight",
                value:
                  configurations["TotalWeight"] ||
                  ToggleConfig.ToggleConfig["TotalWeight"],
              },
              {
                name: "Direction",
                value:
                  configurations["Direction"] ||
                  ToggleConfig.ToggleConfig["Direction"],
              },
              {
                name: "EngineStatus",
                value:
                  configurations["EngineStatus"] ||
                  ToggleConfig.ToggleConfig["EngineStatus"],
              },
              {
                name: "Temp",
                value:
                  configurations["Temp"] || ToggleConfig.ToggleConfig["Temp"],
              },
              {
                name: "Humidy",
                value:
                  configurations["Humidy"] ||
                  ToggleConfig.ToggleConfig["Humidy"],
              },
            ],
            ToggleConfigSettings: [
              {
                name: "DisplayName",
                value:
                  configurations["DisplayName"] ||
                  ToggleConfig.ToggleConfigSettings["DisplayName"],
              },
              {
                name: "PlateNumber",
                value:
                  configurations["PlateNumber"] ||
                  ToggleConfig.ToggleConfigSettings["PlateNumber"],
              },
              {
                name: "SerialNumber",
                value:
                  configurations["SerialNumber"] ||
                  ToggleConfig.ToggleConfigSettings["SerialNumber"],
              },
            ],
            treeBoxWidth:
              configurations["treeBoxWidth"] ||
              ToggleConfig.ToggleConfigSettings["treeBoxWidth"],
          });
          configurations["vehicleIcon"]
            ? setVehicleIcon(configurations["vehicleIcon"])
            : setVehicleIcon("/assets/images/cars/car0/");
          localStorage.setItem(
            "VehicleIcon",
            configurations["vehicleIcon"]
              ? configurations["vehicleIcon"]
              : "/assets/images/cars/car0/"
          );

          selectedVehicles?.map((x) =>
            myMap.unpin(x.VehicleID, { doRezoom: false })
          );
          selectedVehicles?.map((x) => myMap.pin(x));
        }
      })
      .catch((error) => toast.error(error?.response?.data?.message));
  };
  const handleSaveUpdates = async () => {
    const _newConfig = {
      configurations: [
        ...ToggleConfig.ToggleConfig?.map((ele) => {
          return { [ele.name]: ele.value };
        }),
        ...ToggleConfig.ToggleConfigSettings?.map((ele) => {
          return { [ele.name]: ele.value };
        }),
        { treeBoxWidth: ToggleConfig.treeBoxWidth },
        { vehicleIcon },
      ],
    };
    setisToggleConfigOpen(false);
    await axios
      .post(`config`, _newConfig)
      .then(() => {})
      .catch((err) => {
        toast.error(err.meesage);
      });
  };

  useEffect(() => {
    setTimeout(() => {
      fetchDataConfigWidgetMenu();
    }, 8000);
  }, []);

  const handleConfigActive = (toggle) => {
    if (toggle.value) {
      if (
        ToggleConfig.ToggleConfig.filter((toggle) => toggle.value).length === 1
      )
        return true;
      return false;
    } else {
      if (
        ToggleConfig.ToggleConfig.filter((toggle) => toggle.value).length === 4
      )
        return true;
      return false;
    }
  };

  const handleConfigSettingActive = (toggle) => {
    if (toggle.value) {
      if (
        ToggleConfig.ToggleConfigSettings.filter((toggle) => toggle.value)
          .length === 1
      )
        return true;
      return false;
    } else {
      if (
        ToggleConfig.ToggleConfigSettings.filter((toggle) => toggle.value)
          .length === 2
      )
        return true;
      return false;
    }
  };

  const handleIconVehicle = (value) => {
    localStorage.setItem("VehicleIcon", value);
    setVehicleIcon(value);
    selectedVehicles?.map((x) => myMap.unpin(x.VehicleID, { doRezoom: false }));
    selectedVehicles?.map((x) => {
      if (!notConnectedVehicles.includes(x.SerialNumber)) {
        myMap.pin(x);
      }
    });
  };

  return {
    isToggleConfigOpen,
    ToggleConfig,

    handleSaveUpdates,
    handleConfigActive,
    handleConfigSettingActive,
    setisToggleConfigOpen,
    setToggleConfig,
    vehicleIcon,

    handleIconVehicle,
  };
};

export default useConfig;
