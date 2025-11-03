import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import Styles from "styles/Tree.module.scss";
import { handleShowConfigItems } from "helpers/helpers";
import StreamHelper from "helpers/streamHelper";
import useLatestVehicleUpdate from "hooks/useLatestVehicleUpdate";
import { useSelector } from "react-redux";

const TreeNodeItem = ({ item, ToggleConfig }) => {
  const { t } = useTranslation("common");
  const dateRef = useRef(item.RecordDateTime);
  const { isBefore } = StreamHelper();
  const latestDate = useLatestVehicleUpdate(item.SerialNumber);
  const [currentVehicle, setCurrentVehicle] = useState(item);
  const socket = useSelector((state) => state.socket.socket);

  useEffect(() => {
    if (!socket) return;
    let once = true;
    if (once) {
      setCurrentVehicle((prevVehicle) => ({
        ...prevVehicle,
        ...latestDate,
      }));
      once = false;
    }
    const updateVehicleData = (data) => {
      if (!data || item?.SerialNumber !== data.SerialNumber) return;
      const dataDate = new Date(data.RecordDateTime.toString() + "z");
      const currentDate = new Date(dateRef.current);
      if (isBefore(dataDate, currentDate)) return;
      dateRef.current = data.RecordDateTime.toString() + "z";
      setCurrentVehicle((prevVehicle) => ({
        ...prevVehicle,
        ...data,
      }));
    };
    socket.on("update", updateVehicleData);
    return () => {
      if (socket) socket.off("update", updateVehicleData);
    };
  }, [item, latestDate, socket]);

  return (
    <div className="d-flex align-items-center flex-column w-100">
      <div className="d-flex align-items-start justify-content-start">
        {ToggleConfig?.ToggleConfigSettings?.map(
          (itemToggle, key) =>
            itemToggle.value && (
              <div
                key={key}
                className={`${Styles.menuItem} me-1 border-bottom`}
                title={Object.values(itemToggle)[0]}
                style={{
                  fontSize: "13px",
                  marginBottom: "10px",
                  paddingBottom: "5px",
                  overflow: "hidden",
                  marginTop: "4px",
                  fontWeight: "600",
                }}
              >
                ({currentVehicle[itemToggle.name]} )
              </div>
            )
        )}
      </div>

      <div className="d-flex align-items-center justify-content-start w-100">
        {ToggleConfig?.ToggleConfig?.map(
          (x, key) =>
            x.value &&
            handleShowConfigItems(x.name, currentVehicle) && (
              <div key={key}>
                <div
                  key={key}
                  title={t(Object.values(x)[0])}
                  className="fw-bold me-1"
                  style={{
                    fontSize: "11px",
                    backgroundColor:
                      currentVehicle.Speed > currentVehicle.SpeedLimit
                        ? x.name === "Speed"
                          ? "#D9514E"
                          : "#0E6395"
                        : "#0E6395",
                    borderRadius: "5px",
                    marginTop: "-3px",
                    color: "#fff",
                    minWidth: "30px",
                    textAlign: "center",
                    padding: "0px 8px",
                  }}
                >
                  {handleShowConfigItems(x.name, currentVehicle)}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default TreeNodeItem;
