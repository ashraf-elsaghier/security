import React from "react";
import Btn from "./Btn";
import { useVehicleContext } from "context/VehiclesContext";
import { convertJsonToExcel } from "helpers/helpers";
import Styles from "styles/MenuBottom.module.scss";
import { useTranslation } from "next-i18next";
import moment from "moment";
const VehicleStatus = {
  600: "Offline",
  5: "Offline",
  204: "Sleeping",
  101: "OverSpeed",
  100: "OverStreetSpeed",
  0: "Stopped",
  1: "Running",
  2: "Idle",
  500: "Not connected",
};

const EngineStatus = {
  true: "On",
  false: "Off",
};
const IsPowerCutOff = {
  true: "Yes",
  false: "No",
};

const DeviceTypeID = {
  1: "SR01",
  3: "GT06",
  4: "OBD",
  5: "SR02AS",
  6: "SR02B",
  7: "idp 782",
  8: "SR02HTTP",
  9: "Software Tracker",
  10: "FMB120",
  11: "FMB640",
  12: "STD",
  13: "FMB920",
  14: "FMM130",
  15: "HERO",
  16: "FMC130",
  17: "Astro500",
  18: "Astro700",
  19: "Astro900",
  20: "FMC920",
};

const DownloadBtn = () => {
  const { vehicles } = useVehicleContext();
  const { t } = useTranslation("common");
  const handleExportVehicles = () => {
    if (vehicles?.length > 0) {
      convertJsonToExcel(
        vehicles?.map((entry) => {
          return {
            VehicleStatus: VehicleStatus[entry.VehicleStatus] || "Invalid",
            DisplayName: entry.DisplayName || "N/A",
            PlateNumber: entry.PlateNumber || "N/A",
            Mileage: entry.Mileage / 1000 || "N/A",
            Latitude: entry.Latitude || "N/A",
            Longitude: entry.Longitude || "N/A",
            Address: entry.Address || "N/A",
            DeviceTypeID: DeviceTypeID[entry.DeviceTypeID] || "N/A",
            EngineStatus: EngineStatus[entry.EngineStatus] || "N/A",
            IsPowerCutOff: IsPowerCutOff[entry.IsPowerCutOff] || "N/A",
            DeviceSerialNumber: entry.SerialNumber,
            Speed: Math.round(entry.Speed ?? 0),
            RecordDateTime: moment(entry.RecordDateTime)
              .local()
              .format("YYYY-MM-DD HH:mm:ss"),
          };
        }),
        "TreeExportedData.csv"
      );
    }
  };
  return (
    <>
      <Btn
        text={t("export_key")}
        Styles={Styles}
        handleClick={handleExportVehicles}
      >
        <svg
          id="export"
          xmlns="http://www.w3.org/2000/svg"
          x="0"
          y="0"
          version="1.1"
          viewBox="0 0 92 92"
          xmlSpace="preserve"
          fillOpacity={1}
        >
          <path d="M73 76.5v5c0 2.2-1.9 3.5-4.1 3.5H3.6C1.4 85 0 83.8 0 81.5V32.1c0-2.2 1.4-4.2 3.6-4.2h11.7c2.2 0 4 1.8 4 4s-1.8 4-4 4H8V77h57v-.5c0-2.2 1.8-4 4-4s4 1.8 4 4zm17.8-37.3L66 64.5c-1.2 1.2-2.9 1.5-4.4.9-1.6-.7-2.6-2.1-2.6-3.8V50.7c-8-.2-27.2.6-34.2 12.9-.7 1.3-2.1 2.1-3.5 2.1-.3 0-.7 0-1-.1-1.8-.5-3-2.1-3-3.9 0-.6 0-16.1 11.6-27.6C36.2 26.6 46 22.6 59 21.9V11c0-1.6 1-3.1 2.5-3.7 1.6-.6 3.3-.3 4.5.9l24.9 25.3c1.5 1.6 1.5 4.1-.1 5.7zm-8.6-2.9L67 20.9v4.9c0 2.2-1.7 4-4 4-12.4 0-21.9 3.3-28.4 9.9-3 3-5 6.3-6.3 9.5 9.4-5.6 21.3-6.6 28.6-6.6 3.8 0 6.3.3 6.6.3 2 .2 3.5 2 3.5 4v4.9l15.2-15.5z"></path>
        </svg>
      </Btn>
    </>
  );
};

export default DownloadBtn;
