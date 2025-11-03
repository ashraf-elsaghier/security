import React, { useEffect, useRef, useState } from "react";
import StreamHelper from "helpers/streamHelper";
import Image from "next/image";
import { useSelector } from "react-redux";
import { iconUrl } from "helpers/helpers";
import useLatestVehicle from "hooks/useLatestVehicleUpdate";

const StatusIcon = ({ item, vehicleIcon }) => {
  const latestUpdate = useLatestVehicle(item.SerialNumber);
  const [statusIcons, setStatusIcon] = useState(item.VehicleStatus ?? {});
  const { CalcVstatus, isBefore } = StreamHelper();
  const darkMode = useSelector((state) => state.config.darkMode);
  const dateRef = useRef(item.RecordDateTime);
  const socket = useSelector((state) => state.socket.socket);

  useEffect(() => {
    setStatusIcon(latestUpdate?.VehicleStatus ?? {});
    dateRef.current = latestUpdate?.RecordDateTime.toString() + "z";
    if (!socket) return;

    const updateVehicleData = (data) => {
      if (!data || data.SerialNumber !== item.SerialNumber) return;
      const dataDate = new Date(data.RecordDateTime.toString() + "z");
      const currentDate = new Date(dateRef.current);
      if (isBefore(dataDate, currentDate)) return;
      dateRef.current = data.RecordDateTime.toString() + "z";
      setStatusIcon(CalcVstatus({ ...item, ...data }));
    };
    socket.on("update", updateVehicleData);
    return () => {
      if (socket) socket.off("update", updateVehicleData);
    };
  }, [item, latestUpdate, CalcVstatus, isBefore]);

  return (
    <div
      className={`position-relative ${
        darkMode ? "bg-primary p-1" : "bg-transparent p-0"
      } d-flex justify-content-center rounded-1`}
      style={{ padding: "3px" }}
    >
      <Image
        src={iconUrl(item?.configJson, vehicleIcon, statusIcons)}
        width={11}
        height={20}
        alt={item?.SerialNumber}
        title={item?.SerialNumber}
      />
    </div>
  );
};

export default StatusIcon;
