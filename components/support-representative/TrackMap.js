import StreamHelper from "helpers/streamHelper";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Saferoad } from "components/maps/leafletchild";
import { setMap } from "lib/slices/mainMap";

export default function TrackMap({ vehicleData, updateModalData }) {
  const { CalcVstatus, isBefore } = StreamHelper();
  const [currentVehicle, setCurrentVehicle] = useState(vehicleData);
  const socket = useSelector((state) => state.socket.socket);
  const dateRef = useRef();
  const dispatch = useDispatch();
  const L = require("leaflet");
  const myMap = useSelector((state) => state.mainMap.myMap);
  const emitEvent = (serial) => {
    if (socket && socket.connected) {
      socket.emit("track", {
        serial: serial,
      });
    } else {
      console.log("Socket is not connected");
    }
  };
  useEffect(() => {
    try {
      myMap.off();
      myMap.remove();
    } catch (e) {
      console.log("not map");
    }
    setCurrentVehicle(vehicleData);
    emitEvent(vehicleData.SerialNumber);
    dispatch(
      setMap(
        Saferoad?.map("MyHomeMap", {
          popupSettings: { newvar: true, dontShowPopUp: false },
        })
          .setZoom(14)
          .setView(
            L.latLng(vehicleData.Latitude ?? 0, vehicleData.Longitude ?? 0)
          )
      )
    );
  }, [L, Saferoad]);

  useEffect(() => {
    if (!socket || !currentVehicle) return;
    const updateVehicleData = (data) => {
      if (!data || data.SerialNumber !== vehicleData?.SerialNumber) return;
      const dataDate = new Date(data.RecordDateTime.toString() + "z");
      const currentDate = new Date(dateRef.current);
      if (isBefore(dataDate, currentDate)) return;
      dateRef.current = data.RecordDateTime.toString() + "z";
      setCurrentVehicle((prevVehicle) => {
        const vehStatus = CalcVstatus({ ...prevVehicle, ...data });
        const newData = { ...prevVehicle, ...data, VehicleStatus: vehStatus };
        myMap?.UpdateMarker(newData);
        updateModalData(newData);
        return {
          ...prevVehicle,
          ...newData,
        };
      });
    };
    socket.on("update", updateVehicleData);
    return () => {
      if (socket) socket.off("update", updateVehicleData);
    };
  }, [currentVehicle]);
  useEffect(() => {
    if (L && myMap) {
      myMap?.pin(vehicleData);
    }
    () => myMap?.deselectAll();
  }, [L, myMap, vehicleData]);
  return (
    <>
      {vehicleData && (
        <div className="d-flex justify-content-center align-items-center">
          <div
            style={{
              width: "100%",
              height: "100%",
              minHeight: "65.3vh",
              borderRadius: "10px",
            }}
            id="MyHomeMap"
          ></div>
        </div>
      )}
    </>
  );
}
