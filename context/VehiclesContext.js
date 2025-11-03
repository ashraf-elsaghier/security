import moment from "moment";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import StreamHelper from "helpers/streamHelper";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "lib/slices/notifications";

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const vehiclesRef = useRef({});
  const overSpeedCode = 101;
  const { aggregate, isBefore } = StreamHelper();
  const { VehFullData } = useSelector((state) => state.streamData);
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);

  const [repeater, setRepeater] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRepeater((prev) => !prev);
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const sendNotification = (locInfo) => {
    if (
      !moment(moment.parseZone(locInfo?.RecordDateTime))
        .local()
        .isBefore(moment().subtract(5, "minutes"))
    ) {
      if (locInfo.VehicleStatus === overSpeedCode) {
        dispatch(
          addNotification({
            message: `${locInfo.DisplayName} Is over speed`,
            serial: locInfo.SerialNumber,
            type: "over speed",
          })
        );
      } else if (locInfo.IsPowerCutOff) {
        dispatch(
          addNotification({
            message: `${locInfo.DisplayName} power is off`,
            serial: locInfo.SerialNumber,
            type: "power",
          })
        );
      } else if (locInfo.IsFuelCutOff) {
        dispatch(
          addNotification({
            message: `${locInfo.DisplayName} fuel is off`,
            serial: locInfo.SerialNumber,
            type: "fuel",
          })
        );
      } else if (locInfo.IsCrash) {
        dispatch(
          addNotification({
            message: `${locInfo.DisplayName} is Crashed`,
            serial: locInfo.SerialNumber,
            type: "crash",
          })
        );
      }
    }
  };

  useEffect(() => {
    if (VehFullData.length) {
      vehiclesRef.current = Object.fromEntries(
        VehFullData.map((x) => [x?.SerialNumber, { Speed: 0, ...x }])
      );

      if (socket) {
        const updateVehicleData = (data) => {
          const vehicle = vehiclesRef.current[data.SerialNumber];
          if (!vehicle) return;
          const dataDate = new Date(data.RecordDateTime.toString() + "z");
          const currentDate = new Date(vehicle.RecordDateTime);
          if (isBefore(dataDate, currentDate)) return;
          const newData = aggregate(data, vehicle);
          vehiclesRef.current[data.SerialNumber] = newData;
          sendNotification(newData);
        };
        socket.on("update", updateVehicleData);
      }
      return () => {
        if (socket) socket.off("update", updateVehicleData);
      };
    }
  }, [VehFullData, socket]);

  const getVehicleBySerialNumber = (serialNumber) => {
    return vehiclesRef.current[serialNumber] || null;
  };

  const vehiclesMemoized = useMemo(() => {
    return [...Object.values(vehiclesRef.current)];
  }, [repeater]);

  const value = {
    vehicles: vehiclesMemoized,
    getVehicleBySerialNumber,
  };

  return (
    <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>
  );
};

export const useVehicleContext = () => {
  return useContext(VehicleContext);
};
