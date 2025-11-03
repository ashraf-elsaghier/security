import { memo, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { Saferoad } from "components/maps/leafletchild";
import { useDispatch, useSelector } from "react-redux";
import { setMap } from "../../lib/slices/mainMap";

const Map = ({ myMap }) => {
  const L = require("leaflet");
  const dispatch = useDispatch();
  const VehFullData = useSelector((state) => state.streamData.VehFullData);

  useEffect(() => {
    try {
      myMap.off();
      myMap.remove();
    } catch (e) {
      console.log("not map");
    }

    dispatch(
      setMap(
        Saferoad?.map("MyHomeMap", {
          popupSettings: { newvar: true, dontShowPopUp: false },
        })
          .setZoom(7)
          .setView(L.latLng(24.629778, 46.799308))
      )
    );
  }, [L, Saferoad]);
  // to pin the data in the map

  useEffect(() => {
    let interval;
    let amount = 1000;
    if (myMap && VehFullData.length > 5000) {
      let index = 0;
      let limit = 1000;
      interval = setInterval(() => {
        for (let i = index; i < limit; i++) {
          const {
            Speed = 0,
            DisplayName,
            VehicleID,
            Latitude,
            Longitude,
            VehicleStatus,
          } = VehFullData[i];
          if (!(!Longitude && !Latitude)) {
            myMap.pin(
              {
                Speed,
                DisplayName,
                VehicleID,
                Latitude,
                Longitude,
                VehicleStatus,
              },
              false
            );
          }
        }
        // increase the index and limit by amount
        index += amount;
        limit += amount;
        // check if the limit is larger than the VehFullData length
        if (limit > VehFullData.length) {
          limit = VehFullData.length;
        }
      }, 5000);
    } else if (myMap && VehFullData.length > 0) {
      VehFullData?.forEach((x) => {
        if (!(!x.Longitude && !x.Latitude)) {
          myMap.pin(x, false);
        }
      });
    }

    return () => clearInterval(interval);
  }, [myMap, VehFullData.length]);

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
          minHeight: "61.3vh",
          borderRadius: "10px",
        }}
        id="MyHomeMap"
      ></div>
    </>
  );
};

export default memo(Map);
